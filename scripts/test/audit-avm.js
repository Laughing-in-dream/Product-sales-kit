// AVM standalone / cascade rules audit. Run: node scripts/test/audit-avm.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { makeDocument } = require("./dom-stub");
const ROOT = path.join(__dirname, "..", "..");
const sandbox = { console, window: { confirm: () => true }, document: makeDocument(), Blob: class Blob {}, URL: { createObjectURL() { return "blob:audit"; }, revokeObjectURL() {} }, setTimeout, clearTimeout };
vm.createContext(sandbox);
for (const rel of ["catalog-data.js", "js/01-bootstrap-i18n.js", "js/02-dom-state.js", "js/03-data-adplus.js", "js/04-product-meta.js", "js/05-selection-logic.js", "js/06-cart.js", "js/07-render-common.js", "js/08-logic-mseries.js", "js/09-render-avm-c6.js", "js/10-render-mseries.js", "js/11-render-adplus.js", "js/12-main.js"]) vm.runInContext(fs.readFileSync(path.join(ROOT, rel), "utf8"), sandbox, { filename: rel });
const g = (expr) => vm.runInContext(expr, sandbox);
const lines = ["# AVM 向导审计报告", "", "> 自动验证独立单机与级联从机的固定 BOM、延长线、B2 和存储规则。", ""];
const issues = [];
const fail = (message) => { issues.push(message); lines.push(`- ❌ ${message}`); };
const pass = (message) => lines.push(`- ✅ ${message}`);
const has = (sku, qty) => { const row = g(`selectedAvmItems().find(item => item.partNumber === ${JSON.stringify(sku)})`); return Boolean(row && (!qty || Number(row.quantity) === qty)); };
function reset(mode) { g("chooseProduct('avm'); state.productPickerOpen = false; state.step = 1; choosePackage(findItemByRow(6).id); state.avm.mode = " + JSON.stringify(mode) + ";"); }

reset("standalone");
g("state.step = 2; render()");
for (const sku of ["5170004100001", "5151097100002", "5190074100007"]) (sku === "5151097100002" ? has(sku, 4) : has(sku)) ? pass(`单机固定带出 ${sku}`) : fail(`单机缺少 ${sku}`);
const cameraExtCount = g("selectedAvmItems().filter(item => ['1260011100152','1260011100153','1260011100154','1260011100155'].includes(item.partNumber)).reduce((sum,item)=>sum+Number(item.quantity),0)");
cameraExtCount === 4 ? pass("单机带出 4 条摄像机延长线") : fail(`摄像机延长线数量为 ${cameraExtCount}，应为 4`);
g("state.step = 3; state.selections[findItemByRow(15).id] = { checked: true, quantity: '1' }; state.avm.ahdRoute = 'direct'; render()");
has("5190012100075") && has("1210010100059") && !has("1260010000130") ? pass("单机屏幕带 AHD 信号转接线且不带级联线") : fail("单机屏幕接线错误");

reset("cascade");
g("state.step = 3; state.selections[findItemByRow(15).id] = { checked: true, quantity: '1' }; state.avm.ahdRoute = 'direct'; render()");
has("1260010000130") && has("1210010100059") && !has("1261020100108") ? pass("级联直接到屏幕：带 IPC 级联线和 AHD 信号转接线") : fail("级联直接到屏幕接线错误");
g("state.avm.ahdRoute = 'split'; render()");
has("1260010000130") && has("1261020100108") && !has("1210010100059") ? pass("级联分流录制：带 IPC 级联线和一拖二线") : fail("级联分流录制接线错误");
g("state.step = 4; const b2 = findItemByRow(17); state.selections[b2.id] = { checked: true, quantity: '1', b2ExtensionRow: 29 }; state.avm.storageQuantity = 2; state.avm.storageVariants = ['1610002100008','1610002100005']; render()");
has("1262010000025") && has("1260010000352") && has("1610002100008") && has("1610002100005") ? pass("B2 与两张 SD 卡正确带出") : fail("B2 或 SD 卡带出错误");
lines.push("", `审计完成：🔴 ${issues.length} 个疑似 bug`);
fs.writeFileSync(path.join(ROOT, "docs", "test-reports", "avm-walkthrough.md"), lines.join("\n"), "utf8");
console.log(`审计完成: 🔴 ${issues.length} 个疑似 bug`);
console.log("报告: docs/test-reports/avm-walkthrough.md");
process.exitCode = issues.length ? 1 : 0;
