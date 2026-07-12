// 从 catalog-data.js 生成产品主数据（data/products.json + docs/product-index.md）
// 用法: node scripts/build_product_db.js
// 组织方式：以产品(SKU)为主键去重，"哪些产品线/方案在用"是产品的一个字段（usedBy）。
// 分类规则改动后重新运行即可，两份输出文件都是生成物，不要手改。

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const window = {};
eval(fs.readFileSync(path.join(ROOT, "catalog-data.js"), "utf8"));
const catalog = window.CATALOG;

// 统一分类体系（合理分类的唯一定义处）。
// 规则从上到下依次匹配，先命中先得。
// test(text, name)：text = 名称+原始分组 小写拼接；name = 仅名称小写。
// 电源盒必须在套装之前、且只看名称——否则会被 "C53 Kit" 这类分组值带偏。
const TAXONOMY = [
  { id: "power",     label: "电源",        test: (_, n) => /power box|power module|电源盒|电源模块/.test(n) },
  { id: "kit",       label: "核心套装",    test: (s) => /\bkit\b|套装/.test(s) },
  { id: "mdvr",      label: "主机 / MDVR", test: (s) => /mdvr|\bx3n|\bx1n|\bm1n-|record host|主机/.test(s) },
  { id: "cable",     label: "线材",        test: (s) => /cable|wire|harness|线/.test(s) },
  { id: "screen",    label: "屏幕",        test: (s) => /screen|monitor\b|屏/.test(s) },
  { id: "alarm",     label: "报警与提醒",  test: (s) => /\bb2\b|\bb3\b|alarm|speaker|notifier|buzzer|报警|蜂鸣|喇叭|振动器/.test(s) },
  { id: "camera",    label: "摄像头",      test: (s) => /camera|\bdms\b|\bbsd\b|revers|\bipc\b|\bahd\b|\bca\d+|\bc29|surveillance|镜头|摄像|监控/.test(s) },
  { id: "storage",   label: "存储",        test: (s) => /micro sd|\bssd\b|storage|存储卡?/.test(s) },
  { id: "gps",       label: "GPS / 定位",  test: (s) => /gps|inertial|惯导|定位/.test(s) },
  { id: "mount",     label: "支架与安装",  test: (s) => /bracket|screw|sunshade|mount|wrench|\btool\b|支架|螺丝|遮阳|扳手|工具/.test(s) },
  { id: "maintain",  label: "维护与标定",  test: (s) => /maintenance|calibrat|router adapter|dongle|标定|维护/.test(s) },
  { id: "misc",      label: "其他配件",    test: () => true },
];

function classify(name, group) {
  const n = String(name || "").toLowerCase();
  const text = `${n} ${String(group || "").toLowerCase()}`;
  for (const rule of TAXONOMY) {
    if (rule.test(text, n)) return rule.id;
  }
  return "misc";
}

function clean(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

// 从名称/描述里提取线长（统一换算为米）。
// 支持 "3M"、"7.5m"、"9 米"、"Extension Cable-3M-EN"，以及转接线常见的 "300mm"/"500mm"。
// 镜头焦距 "2.8mm" 这类小值靠 ≥50mm 的下限过滤。
function extractLengthM(...sources) {
  // (?<![a-z0-9]) 防止把型号编码里的数字+M（如 "CA29M"）当成线长。
  for (const src of sources) {
    const text = String(src || "");
    const m = text.match(/(?<![a-z0-9])(\d+(?:\.\d+)?)\s*(?:m(?![a-z0-9])|米)/i);
    if (m) {
      const v = parseFloat(m[1]);
      if (v > 0 && v <= 100) return v; // 合理线长范围，过滤误匹配
    }
    const mm = text.match(/(?<![a-z0-9])(\d+(?:\.\d+)?)\s*mm\b/i);
    if (mm) {
      const v = parseFloat(mm[1]);
      if (v >= 50 && v <= 20000) return Math.round((v / 1000) * 100) / 100;
    }
  }
  return null;
}

// 从名称/备注/描述里提取分辨率类规格（4K / 800P / 1080P / 500W 像素等）。
function extractResolution(...sources) {
  for (const src of sources) {
    const m = String(src || "").match(/\b(4K|\d{3,4}P|\d{3,4}W)\b/i);
    if (m) return m[1].toUpperCase();
  }
  return null;
}

// ---- 以 SKU 为主键聚合 ----
const products = new Map();
const skuAnomalies = []; // SKU 列填了说明文字等非料号内容的行
for (const line of catalog.productLines) {
  for (const it of line.items) {
    const sku = String(it.partNumber || "").trim();
    if (!sku) continue;
    if (!/^\d{8,}$/.test(sku)) {
      skuAnomalies.push({
        productLine: line.id,
        rowNumber: it.rowNumber,
        name: clean(it.name).slice(0, 40),
        skuCell: sku.slice(0, 60),
      });
      continue;
    }
    if (!products.has(sku)) {
      products.set(sku, {
        sku,
        name: "",
        nameAliases: new Set(),
        category: null,
        lengthM: null,
        resolution: null,
        notes: new Set(),
        description: "",
        images: new Set(),
        usedBy: [],
      });
    }
    const p = products.get(sku);
    const name = clean(it.name);
    if (name) {
      if (!p.name || name.length > p.name.length) {
        if (p.name && p.name !== name) p.nameAliases.add(p.name);
        p.name = name;
      } else if (name !== p.name) {
        p.nameAliases.add(name);
      }
    }
    if (!p.category) p.category = classify(it.name, it.group);
    // 线长：线材类可从描述提取；其他类别只认名称里的长度，
    // 避免把摄像头自带尾线（描述里的 "2-meter cable"）当成产品长度。
    if (p.lengthM == null) {
      p.lengthM = p.category === "cable"
        ? extractLengthM(it.name, it.description)
        : extractLengthM(it.name);
    }
    if (!p.resolution) p.resolution = extractResolution(it.name, it.note, it.description);
    if (it.note) p.notes.add(clean(it.note));
    if (!p.description && it.description) p.description = String(it.description).trim();
    for (const img of it.images || []) p.images.add(img);
    p.usedBy.push({
      productLine: line.id,
      sheetName: clean(line.sheetName),
      rowNumber: it.rowNumber,
      group: clean(it.group),
      quantity: it.quantity || "",
      solutions: it.solutionRefs || [],
    });
  }
}

// ---- 手动补图（两条通道，均以 SKU 为键，不依赖 Excel 行号）----
// 通道1：assets/products/ 下按 SKU 命名的图片自动挂载
//        （5152119100007.png、5152119100007-2.jpg 都认，前缀是 SKU 即可）
const MANUAL_IMG_DIR = path.join(ROOT, "assets", "products");
if (fs.existsSync(MANUAL_IMG_DIR)) {
  for (const f of fs.readdirSync(MANUAL_IMG_DIR)) {
    if (!/\.(png|jpe?g|webp|gif)$/i.test(f)) continue;
    const m = f.match(/^(\d{8,})/);
    if (!m) { console.warn(`⚠ assets/products/${f}: 文件名不以 SKU 开头，已忽略`); continue; }
    const p = products.get(m[1]);
    if (p) p.images.add(`assets/products/${f}`);
    else console.warn(`⚠ assets/products/${f}: SKU ${m[1]} 不存在于任何产品线，已忽略`);
  }
}
// 通道2：data/image-overrides.json 里 SKU → 项目内已有图片路径
const OVERRIDES_PATH = path.join(ROOT, "data", "image-overrides.json");
if (fs.existsSync(OVERRIDES_PATH)) {
  const overrides = JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf8"));
  for (const [sku, paths] of Object.entries(overrides)) {
    if (sku.startsWith("_")) continue; // 说明/示例键
    const p = products.get(sku);
    if (!p) { console.warn(`⚠ image-overrides: SKU ${sku} 不存在，已忽略`); continue; }
    for (const rel of [].concat(paths)) {
      if (!fs.existsSync(path.join(ROOT, rel))) {
        console.warn(`⚠ image-overrides: ${sku} 的图片路径不存在: ${rel}`);
        continue;
      }
      p.images.add(rel);
    }
  }
}

const productList = [...products.values()]
  .map((p) => ({
    ...p,
    nameAliases: [...p.nameAliases],
    notes: [...p.notes],
    images: [...p.images],
    hasImage: p.images.size > 0,
  }))
  .sort((a, b) => {
    const ca = TAXONOMY.findIndex((t) => t.id === a.category);
    const cb = TAXONOMY.findIndex((t) => t.id === b.category);
    if (ca !== cb) return ca - cb;
    if (a.name !== b.name) return a.name.localeCompare(b.name);
    return (a.lengthM || 0) - (b.lengthM || 0);
  });

const db = {
  generatedFrom: "catalog-data.js（源头是 North America Sales List.xlsx）",
  generatedBy: "scripts/build_product_db.js",
  generatedAt: new Date().toISOString(),
  organizedBy: "product（SKU 去重；产品线/方案是产品的 usedBy 字段）",
  taxonomy: TAXONOMY.map((t) => ({ id: t.id, label: t.label })),
  productLines: catalog.productLines.map((p) => ({
    id: p.id,
    sheetName: clean(p.sheetName),
    itemCount: p.items.length,
    solutionCount: (p.solutions || []).length,
  })),
  productCount: productList.length,
  skuAnomalies,
  stats: {
    withImage: productList.filter((p) => p.hasImage).length,
    withoutImage: productList.filter((p) => !p.hasImage).length,
    sharedAcrossLines: productList.filter((p) => new Set(p.usedBy.map((u) => u.productLine)).size > 1).length,
    cablesWithLength: productList.filter((p) => p.category === "cable" && p.lengthM != null).length,
    cablesTotal: productList.filter((p) => p.category === "cable").length,
  },
  products: productList,
};

fs.mkdirSync(path.join(ROOT, "data"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "data", "products.json"), JSON.stringify(db, null, 2), "utf8");

// ---- 人可读索引 docs/product-index.md（按分类组织） ----
const KB_DOC = {
  adplus20: "knowledge/adplus-2.0.md", m1n20: "knowledge/m1n-2.0.md", m3n: "knowledge/m3n.md",
  c6lite20: "knowledge/c6-lite-2.0.md", avm: "knowledge/avm.md", z5: "knowledge/z5.md",
  "960c53": "knowledge/960c53.md", "966c46ipc": "knowledge/966c46-ipc.md",
  gt1prodcmax: "knowledge/gt1-pro-dc-max.md", f6n: "knowledge/f6n.md",
  accessories: "knowledge/accessories.md",
  forkliftsolutionwaterproofc4: "knowledge/forklift-waterproof-c46.md",
};

const lines = [];
lines.push("# 产品主数据索引（生成物，勿手改）");
lines.push("");
lines.push("> 由 `scripts/build_product_db.js` 从 `catalog-data.js` 生成，机器可读版在 `data/products.json`。");
lines.push("> 组织方式：**按产品分类**，每个产品（SKU）一行，\"使用位置\"列出所有用到它的产品线。");
lines.push("> 更新方式：改 Excel → 重新生成 catalog-data.js → `node scripts/build_product_db.js`。");
lines.push("");
lines.push(`共 **${db.productCount} 个产品（SKU 去重）**，其中 ${db.stats.withImage} 个有图片、` +
  `${db.stats.withoutImage} 个缺图片；${db.stats.sharedAcrossLines} 个被多条产品线复用；` +
  `线材 ${db.stats.cablesTotal} 个中 ${db.stats.cablesWithLength} 个已识别出线长。`);
lines.push("");
lines.push("## 产品线总览");
lines.push("");
lines.push("| 产品线 id | Excel 工作表 | 物料数 | 方案数 | 知识库文档 |");
lines.push("| --- | --- | --- | --- | --- |");
for (const p of db.productLines) {
  const doc = KB_DOC[p.id] ? `[有](${KB_DOC[p.id]})` : "**缺**";
  lines.push(`| ${p.id} | ${p.sheetName} | ${p.itemCount} | ${p.solutionCount} | ${doc} |`);
}
lines.push("");

function usedByText(p) {
  const byLine = new Map();
  for (const u of p.usedBy) {
    if (!byLine.has(u.productLine)) byLine.set(u.productLine, []);
    byLine.get(u.productLine).push(u.rowNumber);
  }
  return [...byLine.entries()].map(([l, rows]) => `${l}#${rows.join(",")}`).join("; ");
}

function specText(p) {
  const parts = [];
  if (p.lengthM != null) parts.push(`${p.lengthM}m`);
  if (p.resolution) parts.push(p.resolution);
  const note = p.notes.join("; ");
  if (note) parts.push(note.length > 40 ? note.slice(0, 40) + "…" : note);
  return parts.join(" · ") || "";
}

for (const t of TAXONOMY) {
  const list = productList.filter((p) => p.category === t.id);
  if (!list.length) continue;
  lines.push(`## ${t.label}（${list.length}）`);
  lines.push("");
  lines.push("| SKU | 名称 | 规格 | 图片 | 使用位置（产品线#行号） |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const p of list) {
    const name = (p.name || "（名称缺失）").slice(0, 60);
    const img = p.hasImage ? `✅ ${p.images.length}张` : "❌";
    lines.push(`| ${p.sku} | ${name} | ${specText(p)} | ${img} | ${usedByText(p)} |`);
  }
  lines.push("");
}

if (skuAnomalies.length) {
  lines.push("## SKU 列异常的行（Excel 数据质量问题）");
  lines.push("");
  lines.push("以下行的 SKU 单元格填的不是料号（多为\"参考推荐表\"类说明文字），未收入产品库，需回源头补真实料号：");
  lines.push("");
  lines.push("| 产品线 | 行号 | 名称 | SKU 单元格内容 |");
  lines.push("| --- | --- | --- | --- |");
  for (const a of skuAnomalies) lines.push(`| ${a.productLine} | ${a.rowNumber} | ${a.name} | ${a.skuCell} |`);
  lines.push("");
}

lines.push("## 缺图片的产品清单");
lines.push("");
lines.push("以下产品在所有产品线里都没有图片，补图时对照 Excel / 钉钉页面：");
lines.push("");
lines.push("| SKU | 名称 | 分类 | 使用位置 |");
lines.push("| --- | --- | --- | --- |");
const labelOf = Object.fromEntries(TAXONOMY.map((t) => [t.id, t.label]));
for (const p of productList.filter((x) => !x.hasImage)) {
  lines.push(`| ${p.sku} | ${(p.name || "（名称缺失）").slice(0, 50)} | ${labelOf[p.category]} | ${usedByText(p)} |`);
}
lines.push("");

fs.writeFileSync(path.join(ROOT, "docs", "product-index.md"), lines.join("\n"), "utf8");

// 控制台报告
const catCount = {};
for (const p of productList) catCount[p.category] = (catCount[p.category] || 0) + 1;
console.log("按产品(SKU)分类分布:");
for (const t of TAXONOMY) console.log(`  ${t.label}: ${catCount[t.id] || 0}`);
console.log(`产品总数(去重): ${db.productCount} | 有图: ${db.stats.withImage} | 缺图: ${db.stats.withoutImage}`);
console.log(`线材线长识别: ${db.stats.cablesWithLength}/${db.stats.cablesTotal}`);
console.log("已生成 data/products.json 与 docs/product-index.md");
