// M3N 向导全遍历审计
// 用法: node scripts/test/audit-m3n.js
// 输出: docs/test-reports/m3n-walkthrough.md

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { makeDocument } = require("./dom-stub");
const ROOT = path.join(__dirname, "..", "..");
const sandbox = {
  console, window: { confirm: () => true }, document: makeDocument(),
  Blob: class Blob { constructor(parts) { this.parts = parts; } },
  URL: { createObjectURL(blob) { sandbox.__lastBlob = blob; return "blob:audit"; }, revokeObjectURL() {} },
  setTimeout, clearTimeout,
};
vm.createContext(sandbox);
for (const rel of [
  "catalog-data.js", "js/01-bootstrap-i18n.js", "js/02-dom-state.js", "js/03-data-adplus.js",
  "js/04-product-meta.js", "js/05-selection-logic.js", "js/06-cart.js", "js/07-render-common.js",
  "js/08-logic-mseries.js", "js/09-render-avm-c6.js", "js/10-render-mseries.js", "js/11-render-adplus.js", "js/12-main.js",
]) vm.runInContext(fs.readFileSync(path.join(ROOT, rel), "utf8"), sandbox, { filename: rel });
const g = (expr) => vm.runInContext(expr, sandbox);
const out = [], issues = [], seen = new Set();
const say = (line = "") => out.push(line);
function flag(level, where, desc) {
  const key = `${level}:${desc}`;
  if (!seen.has(key)) { seen.add(key); issues.push({ level, where, desc }); }
}
function item(row) { return g(`findItemByRow(${row})`); }
function name(entry) { return String(g("displayCatalogText")(entry?.name) || entry?.name || "未知物料").split("\n")[0]; }
function fmt(entry) { return `${name(entry)}（SKU ${entry?.partNumber || "无"}）`; }
function extLen(entry) { return g("extractCableLength")(entry) || "?"; }
function renderOk(where) {
  try { g("render()"); if (g("wizardStageEl.innerHTML").length < 50) flag("bug", where, "页面渲染异常"); }
  catch (err) { flag("bug", where, `渲染抛异常: ${err.message}`); }
}
function hasPart(sku) { return Boolean(g(`selectedPresetItems().some(entry => entry.partNumber === ${JSON.stringify(sku)})`)); }

g("chooseProduct('m3n'); state.productPickerOpen = false; state.step = 1");
renderOk("步骤1-基础套装");
const byRow = new Map(g("product.items").map((entry) => [entry.rowNumber, entry]));

say("# M3N 向导全遍历审计报告（生成物，勿手改）");
say("");
say("> 用 `node scripts/test/audit-m3n.js` 生成。通过 Node 沙盒加载真实向导代码，遍历基础套装、接线、摄像头、可选件与导出。");
say("");

say("## 步骤 1 · 基础套装");
say("");
say(`- ${fmt(byRow.get(4))}`);
say("");

say("## 步骤 2 · 接线");
say("");
g("state.step = 2"); renderOk("步骤2-接线");
for (const row of [5, 7]) {
  const entry = byRow.get(row);
  g(`setM3nPresetSelection(${JSON.stringify(entry.id)}, true)`);
  say(`- ${fmt(entry)}：${hasPart(entry.partNumber) ? "勾选后进入清单 ✅" : "未进入清单 ❌"}`);
  if (!hasPart(entry.partNumber)) flag("bug", "步骤2", `${entry.partNumber} 勾选后未进入清单`);
  g(`setM3nPresetSelection(${JSON.stringify(entry.id)}, false)`);
}
say("");

say("## 步骤 3 · 摄像头与通道容量");
say("");
g("state.step = 3"); renderOk("步骤3-摄像头");
const cameraRows = [10, 11, 12, 13, 16, 17, 22, 23];
const cameras = cameraRows.map((row) => byRow.get(row));
for (const entry of cameras) {
  const type = g(`m3nPresetCameraType(product.items.find(item => item.id === ${JSON.stringify(entry.id)}))`);
  g(`setM3nPresetSelection(${JSON.stringify(entry.id)}, true)`);
  const block = g(`state.selections[${JSON.stringify(entry.id)}]`);
  const extensionRows = g(`m3nCameraExtensionRowsForMSeries(product.items.find(item => item.id === ${JSON.stringify(entry.id)}))`);
  const lengths = extensionRows.map((row) => extLen(item(row))).join(" / ");
  say(`- **${fmt(entry)}**${type ? `（${String(type).toUpperCase()}；延长线 ${lengths}）` : ""}`);
  if (type && extensionRows.length && !(block.extensions?.[0] || block.extensionId)) flag("bug", `步骤3-${entry.rowNumber}`, "摄像头勾选后未默认选择延长线");
  if (entry.rowNumber === 13) {
    for (const childRow of [14, 15]) {
      const child = byRow.get(childRow);
      const checked = Boolean(g(`state.selections[${JSON.stringify(child.id)}]?.checked`));
      say(`  - AD Kit 配件 ${fmt(child)}：${checked ? "自动勾选" : "未自动勾选"}`);
      if (!checked) flag("bug", "步骤3-ADKit", `${child.partNumber} 未随 AD Kit 自动带出`);
    }
  }
  g(`setM3nPresetSelection(${JSON.stringify(entry.id)}, false)`);
}
const ipc = cameras.find((entry) => g(`m3nPresetCameraType(product.items.find(item => item.id === ${JSON.stringify(entry.id)}))`) === "ipc");
const ahd = cameras.find((entry) => g(`m3nPresetCameraType(product.items.find(item => item.id === ${JSON.stringify(entry.id)}))`) === "ahd");
g(`setM3nPresetQuantity(${JSON.stringify(ipc.id)}, 9)`);
let status = g("m3nPresetCameraStatus()");
say(`- 强行设置 IPC 为 9：实际 ${status.ipc}（上限 4）${status.ipc === 4 ? " ✅" : " ❌"}`);
if (status.ipc !== 4) flag("bug", "步骤3-容量", `IPC 数量未钳制为 4，实际 ${status.ipc}`);
g(`setM3nPresetQuantity(${JSON.stringify(ahd.id)}, 9)`);
status = g("m3nPresetCameraStatus()");
say(`- 强行设置 AHD 为 9：实际 ${status.ahd}（上限 4）${status.ahd === 4 ? " ✅" : " ❌"}`);
if (status.ahd !== 4) flag("bug", "步骤3-容量", `AHD 数量未钳制为 4，实际 ${status.ahd}`);
say(`- 总录像通道：${status.recording}/8${status.recording === 8 ? " ✅" : " ❌"}`);
if (status.recording !== 8) flag("bug", "步骤3-容量", `录像通道未钳制为 8，实际 ${status.recording}`);
g("state.selections = {}; seedPresetSelections()");

const adkit = byRow.get(13);
const c29n = byRow.get(10);
g(`setM3nPresetSelection(${JSON.stringify(adkit.id)}, true)`);
g(`setM3nPresetSelection(${JSON.stringify(c29n.id)}, true)`);
status = g("m3nPresetCameraStatus()");
say(`- ADKIT + 1 路 IPC：IPC ${status.ipc}/4，录像 ${status.recording}（应为 2 路 IPC、3 路录像）${status.ipc === 2 && status.recording === 3 ? " ✅" : " ❌"}`);
if (status.ipc !== 2 || status.recording !== 3) flag("bug", "步骤3-ADKIT", "ADKIT 与额外 IPC 的接口/录像通道占用错误");
g("state.selections = {}; seedPresetSelections()");

g("applyMSeriesAlgorithmPreset('adkit_ca46')");
status = g("m3nPresetCameraStatus()");
say(`- 4 AI 推荐方案：IPC ${status.ipc}/4，AHD ${status.ahd}/4，录像 ${status.recording}，内置算法 ${status.internalAlgorithms}/2，外置算法 ${status.externalAlgorithms}${status.ipc === 1 && status.ahd === 2 && status.recording === 4 && status.internalAlgorithms === 2 && status.externalAlgorithms === 2 ? " ✅" : " ❌"}`);
if (status.ipc !== 1 || status.ahd !== 2 || status.recording !== 4 || status.internalAlgorithms !== 2 || status.externalAlgorithms !== 2) flag("bug", "步骤3-4AI方案", "ADKIT + 2×CA46 的资源占用不正确");
g("state.selections = {}; seedPresetSelections()");

g("applyMSeriesAlgorithmPreset('c46_ca20s_ca29m')");
status = g("m3nPresetCameraStatus()");
say(`- C46 4 AI 推荐方案：IPC ${status.ipc}/4，AHD ${status.ahd}/4，录像 ${status.recording}/8，内置算法 ${status.internalAlgorithms}/2，外置算法 ${status.externalAlgorithms}${status.ipc === 2 && status.ahd === 2 && status.recording === 4 && status.internalAlgorithms === 2 && status.externalAlgorithms === 2 ? " ✅" : " ❌"}`);
if (status.ipc !== 2 || status.ahd !== 2 || status.recording !== 4 || status.internalAlgorithms !== 2 || status.externalAlgorithms !== 2) flag("bug", "步骤3-C46方案", "2×C46 + CA20S + CA29M 的资源占用不正确");
g("state.selections = {}; seedPresetSelections()");
say("");

say("## 步骤 4 · 可选件与联动配件");
say("");
g("state.step = 4"); renderOk("步骤4-可选件");
for (const row of [3, 6, 8, 18, 19, 31, 34, 37, 38]) {
  const entry = byRow.get(row);
  g(`setM3nPresetSelection(${JSON.stringify(entry.id)}, true)`);
  say(`- ${fmt(entry)}`);
  const childRows = g(`m3nOptionalChildRows(product.items.find(item => item.id === ${JSON.stringify(entry.id)}))`);
  for (const childRow of childRows) {
    const child = byRow.get(childRow);
    const checked = Boolean(g(`state.selections[${JSON.stringify(child.id)}]?.checked`));
    say(`  - 自动带出 ${fmt(child)}：${checked ? "是" : "否"}`);
    if (!checked) flag("bug", `步骤4-${row}`, `${child.partNumber} 未随 ${entry.partNumber} 自动带出`);
  }
  const optionalExtensionRows = g(`m3nOptionalExtensionRows(product.items.find(item => item.id === ${JSON.stringify(entry.id)}))`);
  if (optionalExtensionRows.length) {
    const block = g(`state.selections[${JSON.stringify(entry.id)}]`);
    say(`  - 延长线：${optionalExtensionRows.map((extensionRow) => extLen(item(extensionRow))).join(" / ")}；默认=${block.extensionId ? "已选" : "未选"}`);
    if (!block.extensionId) flag("bug", `步骤4-${row}`, "勾选后未默认选择必配延长线");
  }
  const variants = g(`presetVariantOptions(product.items.find(item => item.id === ${JSON.stringify(entry.id)}))`);
  if (variants?.length) say(`  - 可选规格：${variants.map((variant) => `${variant.name.en} / ${variant.partNumber}`).join("；")}`);
  g(`setM3nPresetSelection(${JSON.stringify(entry.id)}, false)`);
}
const b2a = byRow.get(18), b2b = byRow.get(19);
g(`setM3nPresetSelection(${JSON.stringify(b2a.id)}, true)`);
say(`- 选 1 个 B2：${hasPart("1262010000025") ? "带出 1262010000025 ✅" : "未带出 1262010000025 ❌"}`);
if (!hasPart("1262010000025") || hasPart("1262010100031")) flag("bug", "步骤4-B2", "单个 B2 的适配线映射错误");
if (Number(g("selectedPresetItems().filter(entry => entry.partNumber === '1260010000351').length")) !== 1) flag("bug", "步骤4-B2", "单个 B2 未带出一条 IPC 延长线");
g(`setM3nPresetSelection(${JSON.stringify(b2b.id)}, true)`);
say(`- 选 2 个 B2：${hasPart("1262010100031") ? "带出 1262010100031 ✅" : "未带出 1262010100031 ❌"}`);
if (!hasPart("1262010100031") || hasPart("1262010000025")) flag("bug", "步骤4-B2", "两个 B2 的适配线映射错误");
if (Number(g("selectedPresetItems().filter(entry => entry.partNumber === '1260010000351').length")) !== 2) flag("bug", "步骤4-B2", "两个 B2 未各自带出一条 IPC 延长线");
g("state.selections = {}; seedPresetSelections()");
say("");

say("## 步骤 5 · 清单汇总与导出");
say("");
g(`setM3nPresetSelection(${JSON.stringify(byRow.get(5).id)}, true); setM3nPresetQuantity(${JSON.stringify(ipc.id)}, 4); setM3nPresetQuantity(${JSON.stringify(ahd.id)}, 4); setM3nPresetSelection(${JSON.stringify(b2a.id)}, true); setM3nPresetSelection(${JSON.stringify(b2b.id)}, true); state.step = 5`);
renderOk("步骤5-清单");
const list = g("selectedPresetItems()");
say(`满配抽样方案共 ${list.length} 行物料：`); say("");
for (const entry of list) say(`- ${entry.partNumber || "❌ 无SKU"} × ${entry.quantity || "?"} — ${entry.name}`);
try {
  g("exportCsv()");
  const csv = sandbox.__lastBlob ? String(sandbox.__lastBlob.parts.join("")) : "";
  const csvRows = csv.trim().split("\n").length - 1;
  say(`\nCSV 导出：${csvRows} 行数据（清单 ${list.length} 行）${csvRows === list.length ? " ✅ 一致" : " ❌ 不一致"}`);
  if (csvRows !== list.length) flag("bug", "导出", `CSV 行数 ${csvRows} 与清单行数 ${list.length} 不一致`);
} catch (err) { flag("bug", "导出", `CSV 导出抛异常: ${err.message}`); }
say("");

say(`## 疑似 Bug / 需要注意的问题（${issues.length} 条）`); say("");
const bugs = issues.filter((issue) => issue.level === "bug");
const warns = issues.filter((issue) => issue.level === "warn");
if (!issues.length) say("本次遍历未发现问题。");
if (bugs.length) { say(`### 🔴 疑似 Bug（${bugs.length}）`); say(""); bugs.forEach((issue, index) => say(`${index + 1}. **[${issue.where}]** ${issue.desc}`)); say(""); }
if (warns.length) { say(`### 🟡 提醒（${warns.length}）`); say(""); warns.forEach((issue, index) => say(`${index + 1}. **[${issue.where}]** ${issue.desc}`)); say(""); }
const report = path.join(ROOT, "docs", "test-reports", "m3n-walkthrough.md");
fs.mkdirSync(path.dirname(report), { recursive: true });
fs.writeFileSync(report, out.join("\n"), "utf8");
console.log(`审计完成: 🔴 ${bugs.length} 个疑似 bug, 🟡 ${warns.length} 个提醒`);
console.log("报告: docs/test-reports/m3n-walkthrough.md");
process.exitCode = bugs.length ? 1 : 0;
