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

// ===== 级联组合：进入主机向导 =====
lines.push("", "## 级联组合（AVM → 主机向导）", "");

function enterHostFlow(host, route) {
  reset("cascade");
  g(`state.step = 3; state.selections[findItemByRow(15).id] = { checked: true, quantity: '1' }; state.avm.ahdRoute = ${JSON.stringify(route)}; state.avm.cascadeHost = ${JSON.stringify(host)}; render()`);
  g("state.step = 4; render()");
  g("avmEnterHostFlow()");
}

for (const route of ["direct", "split"]) {
  const expected = route === "direct" ? { ipc: 1, ahd: 0, recording: 1 } : { ipc: 1, ahd: 1, recording: 2 };
  for (const host of ["adplus20", "m1n20", "m3n"]) {
    enterHostFlow(host, route);
    const productId = g("state.productId");
    productId === host ? pass(`[${route}] 选 ${host} 后进入主机向导（productId=${productId}）`) : fail(`[${route}] ${host}: 未切换到主机向导，实际 ${productId}`);
    const reserved = g("avmCascadeReserved()");
    (reserved.ipc === expected.ipc && reserved.ahd === expected.ahd && reserved.recording === expected.recording)
      ? pass(`[${route}] ${host}: 预占 ${reserved.ipc} IPC / ${reserved.ahd} AHD / ${reserved.recording} 录像`)
      : fail(`[${route}] ${host}: 预占应为 ${JSON.stringify(expected)}，实际 ${JSON.stringify(reserved)}`);
    const combined = g("selectedItems()");
    const hasAvmKit = combined.some((item) => item.partNumber === "5170004100001");
    const hasCascadeCable = combined.some((item) => item.partNumber === "1260010000130");
    hasAvmKit && hasCascadeCable ? pass(`[${route}] ${host}: 组合清单含 AVM Kit 与级联线（共 ${combined.length} 行）`) : fail(`[${route}] ${host}: 组合清单缺 AVM 部分`);
    if (host === "adplus20") {
      g("setCustomHost('dual'); setCustomPowerBox('standard')");
      const counts = g("selectedCameraCounts()");
      const status = g("cameraCapacityStatus()");
      const c29nDisabled = g("isAccessoryChoiceDisabled(customCatalog.accessories.find(a => a.id === 'c29n'))");
      (counts.ipc === expected.ipc && status.ipcRemaining === 0 && c29nDisabled)
        ? pass(`[${route}] adplus20+Standard: 预占后 IPC 剩 0，C29N 被禁用`)
        : fail(`[${route}] adplus20+Standard: 预占未生效（counts=${JSON.stringify(counts)}, ipcRemaining=${status.ipcRemaining}, c29n禁用=${c29nDisabled}）`);
      if (route === "split") {
        status.ahdRemaining === 0 ? pass(`[split] adplus20+Standard: AHD 也剩 0`) : fail(`[split] adplus20+Standard: AHD 剩 ${status.ahdRemaining}，应为 0`);
      }
    } else {
      const rule = g("currentMSeriesChannelRule()");
      const status = g("m3nPresetCameraStatus()");
      (status.ipc === expected.ipc && status.ahd === expected.ahd && status.recording === expected.recording &&
       status.ipcRemaining === rule.ipc - expected.ipc && status.recordingRemaining === rule.recording - expected.recording)
        ? pass(`[${route}] ${host}: 资源额度已计入预占（IPC ${status.ipc}/${rule.ipc}，录像 ${status.recording}/${rule.recording}）`)
        : fail(`[${route}] ${host}: 资源计算错误 status=${JSON.stringify(status)} rule=${JSON.stringify(rule)}`);
      const hostKitIncluded = combined.length > g("state.avmCascade.items.length");
      hostKitIncluded ? pass(`[${route}] ${host}: 主机自身套装已入组合清单`) : fail(`[${route}] ${host}: 组合清单没有主机部分`);
    }
  }
}

// 返回导航：主机流程第一步"上一步"回到 AVM
enterHostFlow("m3n", "direct");
g("avmReturnFromHostFlow()");
const backState = { productId: g("state.productId"), step: g("state.step"), mode: g("state.avm?.mode"), host: g("state.avm?.cascadeHost"), cascadeCleared: g("state.avmCascade === null") };
(backState.productId === "avm" && backState.step === 4 && backState.mode === "cascade" && backState.host === "m3n" && backState.cascadeCleared)
  ? pass("返回导航：回到 AVM 第 4 步，模式/主机选择保留，组合状态已清")
  : fail(`返回导航异常: ${JSON.stringify(backState)}`);
const avmItemsAfterReturn = g("selectedAvmItems().length");
avmItemsAfterReturn > 0 ? pass(`返回后 AVM 已选内容保留（${avmItemsAfterReturn} 行）`) : fail("返回后 AVM 选择丢失");

// 手动切换产品应解除组合
enterHostFlow("m1n20", "direct");
g("chooseProduct('z5')");
g("state.avmCascade === null") ? pass("切换到其他产品后组合状态解除") : fail("切换产品后 avmCascade 未清除");
g("chooseProduct('m1n20')");
const strayReserved = g("avmCascadeReserved()");
strayReserved.ipc === 0 ? pass("直接进入 M1N 时无预占残留") : fail(`M1N 出现预占残留: ${JSON.stringify(strayReserved)}`);

lines.push("", `审计完成：🔴 ${issues.length} 个疑似 bug`);
fs.writeFileSync(path.join(ROOT, "docs", "test-reports", "avm-walkthrough.md"), lines.join("\n"), "utf8");
console.log(`审计完成: 🔴 ${issues.length} 个疑似 bug`);
console.log("报告: docs/test-reports/avm-walkthrough.md");
process.exitCode = issues.length ? 1 : 0;
