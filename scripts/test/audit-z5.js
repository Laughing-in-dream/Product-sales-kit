// Z5 walkthrough audit. Run: node scripts/test/audit-z5.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { makeDocument } = require("./dom-stub");
const ROOT = path.join(__dirname, "..", "..");
const sandbox = { console, window: { confirm: () => true }, document: makeDocument(), Blob: class Blob {}, URL: { createObjectURL() { return "blob:audit"; }, revokeObjectURL() {} }, setTimeout, clearTimeout };
vm.createContext(sandbox);
for (const rel of ["catalog-data.js", "js/01-bootstrap-i18n.js", "js/02-dom-state.js", "js/03-data-adplus.js", "js/04-product-meta.js", "js/05-selection-logic.js", "js/06-cart.js", "js/07-render-common.js", "js/08-logic-mseries.js", "js/09-render-avm-c6.js", "js/10-render-mseries.js", "js/11-render-adplus.js", "js/12-main.js"]) vm.runInContext(fs.readFileSync(path.join(ROOT, rel), "utf8"), sandbox, { filename: rel });
const g = (expr) => vm.runInContext(expr, sandbox);
const report = ["# Z5 向导审计报告", "", "> 自动验证单机 Kit 与单张 Micro SD 卡互斥规则。", ""];
const issues = [];
const check = (ok, text) => { report.push(`- ${ok ? "✅" : "❌"} ${text}`); if (!ok) issues.push(text); };
g("chooseProduct('z5'); state.productPickerOpen = false; state.step = 1; render()");
const kit = g("z5CoreItem()");
check(Boolean(kit && kit.partNumber === '5210056100004' && g("state.packageId") === kit.id), "核心 Z5 Kit 自动固定为 5210056100004");
check(g("Boolean(z5SystemDiagram()?.images?.[0])"), "核心套装页提供系统连接图资源入口");
g("state.step = 2; render()");
const storage = g("z5StorageItems()");
check(storage.length === 4 && storage.map(item => item.partNumber).join(',') === '5190005100063,5190005100062,5190005100060,5190005100083', "四个可选 SD 卡料号完整");
for (const item of storage) {
  g(`setZ5StorageQuantity(${JSON.stringify(item.id)}, 1)`);
  const selected = g("z5StorageItems().filter(item => state.selections[item.id]?.checked)");
  check(selected.length === 1 && selected[0].id === item.id, `${item.partNumber} 被选择时其余容量自动取消`);
  g(`setZ5StorageQuantity(${JSON.stringify(item.id)}, 9)`);
  check(g(`Number(state.selections[${JSON.stringify(item.id)}].quantity)`) === 1, `${item.partNumber} 数量被限制为 1`);
}
g("state.step = 3; render()");
check(g("selectedPresetItems().some(item => item.partNumber === '5210056100004')"), "导出清单始终包含 Z5 Kit");
report.push("", `审计完成：🔴 ${issues.length} 个疑似 bug`);
fs.writeFileSync(path.join(ROOT, "docs", "test-reports", "z5-walkthrough.md"), report.join("\n"), "utf8");
console.log(`审计完成: 🔴 ${issues.length} 个疑似 bug`);
console.log("报告: docs/test-reports/z5-walkthrough.md");
process.exitCode = issues.length ? 1 : 0;
