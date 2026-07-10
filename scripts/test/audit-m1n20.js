// M1N 2.0 向导全遍历审计
// 用法: node scripts/test/audit-m1n20.js
// 输出: docs/test-reports/m1n20-walkthrough.md

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { makeDocument } = require("./dom-stub");

const ROOT = path.join(__dirname, "..", "..");
const sandbox = {
  console,
  window: { confirm: () => true },
  document: makeDocument(),
  Blob: class Blob { constructor(parts) { this.parts = parts; } },
  URL: { createObjectURL(blob) { sandbox.__lastBlob = blob; return "blob:audit"; }, revokeObjectURL() {} },
  setTimeout, clearTimeout,
};
vm.createContext(sandbox);

const SCRIPTS = [
  "catalog-data.js",
  "js/01-bootstrap-i18n.js", "js/02-dom-state.js", "js/03-data-adplus.js",
  "js/04-product-meta.js", "js/05-selection-logic.js", "js/06-cart.js",
  "js/07-render-common.js", "js/08-logic-mseries.js", "js/09-render-avm-c6.js",
  "js/10-render-mseries.js", "js/11-render-adplus.js", "js/12-main.js",
];
for (const rel of SCRIPTS) vm.runInContext(fs.readFileSync(path.join(ROOT, rel), "utf8"), sandbox, { filename: rel });
const g = (expr) => vm.runInContext(expr, sandbox);

const out = [];
const issues = [];
const issueKeys = new Set();
const say = (line = "") => out.push(line);
function flag(level, where, desc) {
  const key = `${level}:${desc}`;
  if (issueKeys.has(key)) return;
  issueKeys.add(key);
  issues.push({ level, where, desc });
}
function imgExists(rel) { return fs.existsSync(path.join(ROOT, rel)); }
function itemByRow(row) { return g(`findItemByRow(${JSON.stringify(row)})`); }
function itemName(item) { return String(g("displayCatalogText")(item?.name) || item?.name || "未知物料").split("\n")[0]; }
function fmtItem(item) { return `${itemName(item)}（SKU ${item?.partNumber || "无"}）`; }
function cableLen(item) { return g("extractCableLength")(item) || "?"; }
function checkRows(rows, where) {
  return (rows || []).map(itemByRow).filter(Boolean).map((item) => {
    if (!item.partNumber) flag("bug", where, `物料 ${itemName(item)} 缺少 SKU`);
    for (const img of item.images || []) if (!imgExists(img)) flag("bug", where, `图片文件不存在: ${img}`);
    return item;
  });
}
function renderOk(where) {
  try {
    g("render()");
    const html = g("wizardStageEl.innerHTML");
    if (!html || html.length < 50) flag("bug", where, "页面渲染内容为空或异常");
  } catch (err) {
    flag("bug", where, `渲染抛异常: ${err.message}`);
  }
}
function hasPart(sku) { return Boolean(g(`selectedPresetItems().some(item => item.partNumber === ${JSON.stringify(sku)})`)); }

// 初始化为 M1N 的基础套装流程。
g("chooseProduct('m1n20'); state.productPickerOpen = false; state.step = 1");
renderOk("步骤1-基础套装");
const productItems = g("product.items");
const rows = new Map(productItems.map((item) => [item.rowNumber, item]));

say("# M1N 2.0 向导全遍历审计报告（生成物，勿手改）");
say("");
say("> 用 `node scripts/test/audit-m1n20.js` 生成。");
say("> 方法：在 Node 沙盒加载真实应用代码，遍历 M1N 2.0 基础套装、接线、摄像头、可选件与导出流程，并按知识库规则审计。");
say("");

// 步骤 1：基础套装
const pkg = rows.get(4);
say("## 步骤 1 · 基础套装");
say("");
say(`- ${fmtItem(pkg)}`);
if (!pkg?.partNumber) flag("bug", "步骤1", "基础套装缺少 SKU");
say("");

// 步骤 2：接线
say("## 步骤 2 · 接线");
say("");
g("state.step = 2");
renderOk("步骤2-接线");
for (const row of [5, 7]) {
  const item = checkRows([row], "步骤2")[0];
  say(`- ${fmtItem(item)}`);
  g(`setM3nPresetSelection(${JSON.stringify(item.id)}, true)`);
  if (!hasPart(item.partNumber)) flag("bug", "步骤2", `${item.partNumber} 勾选后未进入清单`);
  g(`setM3nPresetSelection(${JSON.stringify(item.id)}, false)`);
}
say("");

// 步骤 3：摄像头与容量
say("## 步骤 3 · 摄像头与通道容量");
say("");
g("state.step = 3");
renderOk("步骤3-摄像头");
const cameraRows = [11, 12, 13, 14, 17, 22, 23];
const cameras = cameraRows.map((row) => rows.get(row)).filter(Boolean);
for (const item of cameras) {
  const type = g(`m3nPresetCameraType(product.items.find(item => item.id === ${JSON.stringify(item.id)}))`);
  say(`- **${fmtItem(item)}**${type ? `（${String(type).toUpperCase()}）` : ""}`);
  g(`setM3nPresetSelection(${JSON.stringify(item.id)}, true)`);
  const block = g(`state.selections[${JSON.stringify(item.id)}]`);
  const extensions = Array.isArray(block.extensions) ? block.extensions : [block.extensionId];
  const extensionRows = g(`m3nCameraExtensionRowsForMSeries(product.items.find(item => item.id === ${JSON.stringify(item.id)}))`);
  if (type) {
    const options = checkRows(extensionRows, `步骤3-${item.rowNumber}-延长线`);
    say(`  - 延长线：${options.map(cableLen).join(" / ")}；默认=${extensions[0] ? "已选" : "未选"}`);
    if (!extensions[0]) flag("bug", `步骤3-${item.rowNumber}`, "摄像头勾选后未默认选择延长线");
  }
  if (item.rowNumber === 14) {
    for (const childRow of [15, 16]) {
      const child = rows.get(childRow);
      const checked = Boolean(g(`state.selections[${JSON.stringify(child.id)}]?.checked`));
      say(`  - AD Kit 配件 ${fmtItem(child)}：${checked ? "自动勾选" : "未自动勾选"}`);
      if (!checked) flag("bug", "步骤3-ADKit", `${child.partNumber} 未随 AD Kit 自动带出`);
    }
  }
  g(`setM3nPresetSelection(${JSON.stringify(item.id)}, false)`);
}

const ipc = cameras.find((item) => g(`m3nPresetCameraType(product.items.find(entry => entry.id === ${JSON.stringify(item.id)}))`) === "ipc");
const ahd = cameras.find((item) => g(`m3nPresetCameraType(product.items.find(entry => entry.id === ${JSON.stringify(item.id)}))`) === "ahd");
g(`setM3nPresetQuantity(${JSON.stringify(ipc.id)}, 9)`);
let status = g("m3nPresetCameraStatus()");
say(`- 强行设置 IPC 为 9：实际 ${status.ipc}（上限 2）${status.ipc === 2 ? " ✅" : " ❌"}`);
if (status.ipc !== 2) flag("bug", "步骤3-容量", `IPC 数量未钳制为 2，实际 ${status.ipc}`);
g(`setM3nPresetQuantity(${JSON.stringify(ahd.id)}, 9)`);
status = g("m3nPresetCameraStatus()");
say(`- 强行设置 AHD 为 9：实际 ${status.ahd}（上限 4）${status.ahd === 4 ? " ✅" : " ❌"}`);
if (status.ahd !== 4) flag("bug", "步骤3-容量", `AHD 数量未钳制为 4，实际 ${status.ahd}`);
g("state.selections = {}; seedPresetSelections()");
say("");

// 步骤 4：可选件与联动线
say("## 步骤 4 · 可选件与联动配件");
say("");
g("state.step = 4");
renderOk("步骤4-可选件");
const optionalRows = [6, 8, 10, 18, 19, 31, 34, 36, 37, 38];
for (const row of optionalRows) {
  const item = rows.get(row);
  if (!item) continue;
  g(`setM3nPresetSelection(${JSON.stringify(item.id)}, true)`);
  say(`- ${fmtItem(item)}`);
  const childRows = g(`m3nOptionalChildRows(product.items.find(entry => entry.id === ${JSON.stringify(item.id)}))`);
  for (const childRow of childRows) {
    const child = rows.get(childRow);
    const checked = Boolean(g(`state.selections[${JSON.stringify(child.id)}]?.checked`));
    say(`  - 自动带出 ${fmtItem(child)}：${checked ? "是" : "否"}`);
    if (!checked) flag("bug", `步骤4-${row}`, `${child.partNumber} 未随 ${item.partNumber} 自动带出`);
  }
  const variants = g(`presetVariantOptions(product.items.find(entry => entry.id === ${JSON.stringify(item.id)}))`);
  if (variants?.length) say(`  - 可选规格：${variants.map((entry) => `${entry.name.en} / ${entry.partNumber}`).join("；")}`);
  g(`setM3nPresetSelection(${JSON.stringify(item.id)}, false)`);
}

// B2：单个 / 两个时适配线必须切换。
const b2Right = rows.get(18);
const b2Left = rows.get(19);
g(`setM3nPresetSelection(${JSON.stringify(b2Right.id)}, true)`);
say(`- 选 1 个 B2：${hasPart("1262010000025") ? "带出 1262010000025 ✅" : "未带出 1262010000025 ❌"}`);
if (!hasPart("1262010000025") || hasPart("1262010100031")) flag("bug", "步骤4-B2", "单个 B2 的适配线映射错误");
g(`setM3nPresetSelection(${JSON.stringify(b2Left.id)}, true)`);
say(`- 选 2 个 B2：${hasPart("1262010100031") ? "带出 1262010100031 ✅" : "未带出 1262010100031 ❌"}`);
if (!hasPart("1262010100031") || hasPart("1262010000025")) flag("bug", "步骤4-B2", "两个 B2 的适配线映射错误");
g("state.selections = {}; seedPresetSelections()");
say("");

// 步骤 5：满配清单与导出
say("## 步骤 5 · 清单汇总与导出");
say("");
g(`setM3nPresetSelection(${JSON.stringify(rows.get(5).id)}, true); setM3nPresetQuantity(${JSON.stringify(ipc.id)}, 2); setM3nPresetQuantity(${JSON.stringify(ahd.id)}, 4); setM3nPresetSelection(${JSON.stringify(b2Right.id)}, true); setM3nPresetSelection(${JSON.stringify(b2Left.id)}, true); state.step = 5`);
renderOk("步骤5-清单");
const list = g("selectedPresetItems()");
say(`满配抽样方案共 ${list.length} 行物料：`);
say("");
const productsDb = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "products.json"), "utf8"));
const knownSkus = new Set(productsDb.products.map((entry) => entry.sku));
for (const item of list) {
  say(`- ${item.partNumber || "❌ 无SKU"} × ${item.quantity || "?"} — ${item.name}`);
  if (!item.partNumber) flag("bug", "步骤5-清单", `清单行 ${item.name} 缺少 SKU`);
  else if (!knownSkus.has(String(item.partNumber).trim())) flag("warn", "步骤5-清单", `SKU ${item.partNumber} 不在产品主数据库中（${item.name}）`);
}
try {
  g("exportCsv()");
  const csv = sandbox.__lastBlob ? String(sandbox.__lastBlob.parts.join("")) : "";
  const csvRows = csv.trim().split("\n").length - 1;
  say(`\nCSV 导出：${csvRows} 行数据（清单 ${list.length} 行）${csvRows === list.length ? " ✅ 一致" : " ❌ 不一致"}`);
  if (csvRows !== list.length) flag("bug", "导出", `CSV 行数 ${csvRows} 与清单行数 ${list.length} 不一致`);
} catch (err) {
  flag("bug", "导出", `CSV 导出抛异常: ${err.message}`);
}
say("");

say(`## 疑似 Bug / 需要注意的问题（${issues.length} 条）`);
say("");
const bugs = issues.filter((issue) => issue.level === "bug");
const warns = issues.filter((issue) => issue.level === "warn");
if (!issues.length) say("本次遍历未发现问题。");
if (bugs.length) {
  say(`### 🔴 疑似 Bug（${bugs.length}）`);
  say("");
  bugs.forEach((issue, index) => say(`${index + 1}. **[${issue.where}]** ${issue.desc}`));
  say("");
}
if (warns.length) {
  say(`### 🟡 提醒（${warns.length}）`);
  say("");
  warns.forEach((issue, index) => say(`${index + 1}. **[${issue.where}]** ${issue.desc}`));
  say("");
}

const report = path.join(ROOT, "docs", "test-reports", "m1n20-walkthrough.md");
fs.mkdirSync(path.dirname(report), { recursive: true });
fs.writeFileSync(report, out.join("\n"), "utf8");
console.log(`审计完成: 🔴 ${bugs.length} 个疑似 bug, 🟡 ${warns.length} 个提醒`);
console.log("报告: docs/test-reports/m1n20-walkthrough.md");
process.exitCode = bugs.length ? 1 : 0;
