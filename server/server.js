"use strict";

// Small same-origin production server: static configurator, feedback collection,
// exported-solution telemetry, and a token-protected admin API.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const ROOT_DIR = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT || 8080);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const MAX_BODY_BYTES = 64 * 1024;
const MAX_ANNOTATION_BODY_BYTES = 128 * 1024;

if (!ADMIN_TOKEN) {
  console.error("ADMIN_TOKEN is required. Refusing to start without an admin password.");
  process.exit(1);
}

fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(path.join(DATA_DIR, "configurator.db"));
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version TEXT NOT NULL,
    session_id TEXT NOT NULL,
    product_id TEXT,
    product_name TEXT,
    step INTEGER,
    message TEXT NOT NULL,
    contact TEXT,
    page_url TEXT,
    items_json TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS annotations (
    id INTEGER PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version TEXT NOT NULL,
    session_id TEXT NOT NULL,
    product_id TEXT,
    product_name TEXT,
    step INTEGER,
    message TEXT NOT NULL,
    contact TEXT,
    page_url TEXT,
    target_label TEXT NOT NULL,
    target_selector TEXT,
    target_text TEXT,
    target_bounds_json TEXT,
    review_state_json TEXT,
    items_json TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS solution_events (
    id INTEGER PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version TEXT NOT NULL,
    session_id TEXT NOT NULL,
    product_id TEXT,
    product_name TEXT,
    items_json TEXT NOT NULL
  );
`);
if (!db.prepare("PRAGMA table_info(annotations)").all().some((column) => column.name === "review_state_json")) {
  db.exec("ALTER TABLE annotations ADD COLUMN review_state_json TEXT");
}

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(payload));
}

function cleanText(value, maxLength = 200) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanItems(items) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 100).map((item) => ({
    partNumber: cleanText(item?.partNumber, 100),
    name: cleanText(item?.name, 300),
    quantity: cleanText(item?.quantity, 30) || "1",
  })).filter((item) => item.partNumber || item.name);
}

function buildContext(body) {
  return {
    version: cleanText(body.version, 40) || "unknown",
    sessionId: cleanText(body.sessionId, 100) || "unknown",
    productId: cleanText(body.productId, 100),
    productName: cleanText(body.productName, 200),
    step: Number.isInteger(body.step) ? body.step : null,
    items: cleanItems(body.items),
  };
}

function cleanBounds(bounds) {
  if (!bounds || typeof bounds !== "object") return "";
  const cleanNumber = (value) => Number.isFinite(Number(value)) ? Math.round(Number(value)) : null;
  return JSON.stringify({ x: cleanNumber(bounds.x), y: cleanNumber(bounds.y), width: cleanNumber(bounds.width), height: cleanNumber(bounds.height) });
}

function readJson(request, maxBytes = MAX_BODY_BYTES) {
  return new Promise((resolve, reject) => {
    let bytes = 0;
    const chunks = [];
    request.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > maxBytes) {
        reject(new Error("Request is too large."));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch {
        reject(new Error("Invalid JSON."));
      }
    });
    request.on("error", reject);
  });
}

function isAdmin(request) {
  const header = request.headers.authorization || "";
  return header === `Bearer ${ADMIN_TOKEN}`;
}

function overview() {
  const totals = db.prepare(`
    SELECT COUNT(*) AS exports, COUNT(DISTINCT session_id) AS uniqueSessions
    FROM solution_events
    WHERE created_at >= datetime('now', '-30 days')
  `).get();
  const productCounts = db.prepare(`
    SELECT product_id AS productId, product_name AS productName, COUNT(*) AS exports
    FROM solution_events
    WHERE created_at >= datetime('now', '-30 days')
    GROUP BY product_id, product_name
    ORDER BY exports DESC
  `).all();
  const events = db.prepare(`
    SELECT items_json FROM solution_events
    WHERE created_at >= datetime('now', '-30 days')
    ORDER BY id DESC LIMIT 1000
  `).all();
  const components = new Map();
  for (const event of events) {
    let items = [];
    try { items = JSON.parse(event.items_json); } catch { continue; }
    for (const item of items) {
      const key = item.partNumber || item.name;
      if (!key) continue;
      const current = components.get(key) || { partNumber: item.partNumber, name: item.name, uses: 0, quantity: 0 };
      current.uses += 1;
      current.quantity += Number(item.quantity) || 0;
      components.set(key, current);
    }
  }
  const feedback = db.prepare(`
    SELECT id, created_at AS createdAt, version, product_name AS productName, message, contact, step
    FROM feedback ORDER BY id DESC LIMIT 100
  `).all();
  const annotations = db.prepare(`
    SELECT id, created_at AS createdAt, version, product_name AS productName, step, message, contact,
      target_label AS targetLabel, target_selector AS targetSelector, target_text AS targetText
    FROM annotations ORDER BY id DESC LIMIT 100
  `).all();
  return {
    period: "Last 30 days",
    exports: totals.exports,
    uniqueSessions: totals.uniqueSessions,
    productCounts,
    components: [...components.values()].sort((a, b) => b.uses - a.uses).slice(0, 50),
    feedback,
    annotations,
  };
}

function serveStatic(response, pathname) {
  const relativePath = pathname === "/" ? "index.html" : decodeURIComponent(pathname).replace(/^[/\\]+/, "");
  const filePath = path.resolve(ROOT_DIR, relativePath);
  if (!filePath.startsWith(`${ROOT_DIR}${path.sep}`) || path.basename(filePath).startsWith(".")) {
    sendJson(response, 403, { error: "Forbidden" });
    return;
  }
  fs.stat(filePath, (error, stat) => {
    if (error || !stat.isFile()) {
      sendJson(response, 404, { error: "Not found" });
      return;
    }
    const mime = MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": mime, "X-Content-Type-Options": "nosniff" });
    fs.createReadStream(filePath).pipe(response);
  });
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  try {
    if (request.method === "GET" && url.pathname === "/healthz") return sendJson(response, 200, { ok: true });
    if (request.method === "GET" && url.pathname === "/admin") {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      return fs.createReadStream(path.join(__dirname, "admin.html")).pipe(response);
    }
    if (request.method === "GET" && url.pathname === "/api/admin/overview") {
      if (!isAdmin(request)) return sendJson(response, 401, { error: "Administrator token required" });
      return sendJson(response, 200, overview());
    }
    if (request.method === "GET" && url.pathname === "/admin/review") {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      return fs.createReadStream(path.join(__dirname, "admin-review.html")).pipe(response);
    }
    const annotationMatch = /^\/api\/admin\/annotations\/(\d+)$/.exec(url.pathname);
    if (request.method === "GET" && annotationMatch) {
      if (!isAdmin(request)) return sendJson(response, 401, { error: "Administrator token required" });
      const annotation = db.prepare(`SELECT id, created_at AS createdAt, version, product_name AS productName, step, message, contact,
        target_label AS targetLabel, target_selector AS targetSelector, target_text AS targetText,
        target_bounds_json AS targetBoundsJson, review_state_json AS reviewStateJson
        FROM annotations WHERE id = ?`).get(Number(annotationMatch[1]));
      if (!annotation) return sendJson(response, 404, { error: "Annotation not found" });
      let reviewState = null;
      try { reviewState = JSON.parse(annotation.reviewStateJson || "null"); } catch { reviewState = null; }
      return sendJson(response, 200, { annotation: { ...annotation, reviewState } });
    }
    if (request.method === "POST" && url.pathname === "/api/feedback") {
      const body = await readJson(request);
      const context = buildContext(body);
      const message = cleanText(body.message, 2000);
      if (!message) return sendJson(response, 400, { error: "A feedback message is required." });
      db.prepare(`INSERT INTO feedback (version, session_id, product_id, product_name, step, message, contact, page_url, items_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(context.version, context.sessionId, context.productId, context.productName, context.step, message, cleanText(body.contact, 200), cleanText(body.pageUrl, 1000), JSON.stringify(context.items));
      return sendJson(response, 201, { ok: true });
    }
    if (request.method === "POST" && url.pathname === "/api/annotations") {
      const body = await readJson(request, MAX_ANNOTATION_BODY_BYTES);
      const context = buildContext(body);
      const message = cleanText(body.message, 2000);
      const targetLabel = cleanText(body.targetLabel, 240);
      if (!message) return sendJson(response, 400, { error: "An annotation message is required." });
      if (!targetLabel) return sendJson(response, 400, { error: "An annotated element is required." });
      const reviewState = body.reviewState && typeof body.reviewState === "object" ? JSON.stringify(body.reviewState).slice(0, 100000) : "";
      db.prepare(`INSERT INTO annotations (version, session_id, product_id, product_name, step, message, contact, page_url, target_label, target_selector, target_text, target_bounds_json, review_state_json, items_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
        context.version, context.sessionId, context.productId, context.productName, context.step, message,
        cleanText(body.contact, 200), cleanText(body.pageUrl, 1000), targetLabel, cleanText(body.targetSelector, 700),
        cleanText(body.targetText, 1000), cleanBounds(body.targetBounds), reviewState, JSON.stringify(context.items)
      );
      return sendJson(response, 201, { ok: true });
    }
    if (request.method === "POST" && url.pathname === "/api/solutions") {
      const context = buildContext(await readJson(request));
      if (!context.items.length) return sendJson(response, 400, { error: "At least one selected item is required." });
      db.prepare(`INSERT INTO solution_events (version, session_id, product_id, product_name, items_json)
        VALUES (?, ?, ?, ?, ?)`)
        .run(context.version, context.sessionId, context.productId, context.productName, JSON.stringify(context.items));
      return sendJson(response, 201, { ok: true });
    }
    if (request.method === "OPTIONS") {
      response.writeHead(204, { Allow: "GET, POST, OPTIONS" });
      return response.end();
    }
    if (request.method === "GET") return serveStatic(response, url.pathname);
    return sendJson(response, 405, { error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return sendJson(response, 400, { error: error.message || "Bad request" });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Sales configurator is listening on http://127.0.0.1:${PORT}`);
});
