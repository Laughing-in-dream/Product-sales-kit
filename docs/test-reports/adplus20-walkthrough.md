# AD Plus 2.0 向导全遍历审计报告（生成物，勿手改）

> 由 `node scripts/test/audit-adplus.js` 生成。
> 方法：在 Node 沙箱中加载真实应用代码，调用应用自身的交互函数遍历每个分支，
> 并对照 docs/knowledge/adplus-2.0.md 的规则判定。

## 步骤 2 · 选主机（共 2 种）

- **Dual-lens host**：Best for projects that need dual-path base video capability.
  - 搭配 standard 电源盒 → 套装 AD Plus 2.0 Kit（SKU 5154021100049）
  - 搭配 plus 电源盒 → 套装 AD Plus 2.0+PBP Kit（SKU 5154021100098）
  - 搭配 max 电源盒 → 套装 AD Plus 2.0+PBM Kit（SKU 5154021100086）
- **Single-lens host**：Best for projects that only need a single-path host and may add accessories later.
  - 搭配 standard 电源盒 → 套装 AD Plus 2.0-S Kit（SKU 5154021100054）
  - 搭配 plus 电源盒 → 套装 AD Plus 2.0-S + PBP Kit（SKU 5154021100103）
  - 搭配 max 电源盒 → 套装 AD Plus 2.0-S+PBM Kit（SKU 5154021100090）

## 步骤 3 · 选电源盒（共 3 种）

- **Standard Power Box**：Base solution for standard deployments.
- **Power Box Plus**：With ECU parsing cability, suitable for mid-level projects.
- **Power Box Max**：Extra 4 channels expansion. Highest expandability for more complex alarm and linkage setups.

## 步骤 4 · 选接线方式（逐电源盒遍历）

### Standard Power Box
- 默认勾选: loose
- Loose wire: 套装内置，无需单独物料
- 9PIN J1939: 需要物料 9PIN OBD Cable（SKU 1261080100075）
- 16PIN OBD: 需要物料 16PIN OBD Cable（SKU 1261080100072）

### Power Box Plus
- 默认勾选: 16pin
- Loose wire: 需要物料 Power Breakout Cable（SKU 1261090100044）
- 9PIN J1939: 需要物料 9PIN OBD Cable（SKU 1260060100012）
- 16PIN OBD: 需要物料 16PIN OBD Extension Cable（SKU 1260040100236）（另有专用 SKU 1260040100242）

### Power Box Max
- 默认勾选: 16pin
- Loose wire: 需要物料 Power Breakout Cable（SKU 1261090100061）
- 9PIN J1939: 需要物料 9PIN OBD Cable（SKU 1260060100012）
- 16PIN OBD: 需要物料 16PIN OBD Extension Cable（SKU 1260040100236）（另有专用 SKU 1260040100242）

## 步骤 5 · 选摄像头与屏幕（逐电源盒遍历）

### Standard Power Box（可见 6 项）

- **C29N DMS camera**（IPC 摄像头）
  - 勾选后出现「IPC extension cable」选择，共 3 种（3M / 5M / 7M），默认 3M
  - 当前可选数量上限: 1
- **CA38 reverse camera**（AHD 摄像头）
  - 勾选后出现「AHD extension cable」选择，共 3 种（3M / 5M / 7M），默认 3M
  - 当前可选数量上限: 1
- **CA42 wireless camera**（AHD 摄像头）
  - 勾选后出现「Rear BSD extension cable」选择，共 3 种（9M / 1.5M / 11M），默认 9M
  - 当前可选数量上限: 1
- **Square camera**（AHD 摄像头）
  - 勾选后出现「AHD extension cable」选择，共 3 种（3M / 5M / 7M），默认 3M
  - 当前可选数量上限: 1
- **Metal snail camera**（AHD 摄像头）
  - 勾选后出现「AHD 延长线」选择，共 3 种（3M / 5M / 7M），默认 3M
  - 当前可选数量上限: 1
- **DP7S screen**（非摄像头项）
  - 勾选后出现「Screen corrugated cable」选择，共 1 种（150MM），锁定不可换
  - 另出现「AHD 延长线」，共 3 种（3M / 5M / 7M）

**容量规则验证**（最多 1 路 IPC + 1 路 AHD（知识库规则 1））：

- 选 1 IPC + 1 AHD 后：IPC 剩余 0、AHD 剩余 0，警告=「无」
- 此时再选第二路 AHD（ca42）：✅ 被禁用
- 强行把 AHD 数量改为 2：实际被钳制回 1 ✅

### Power Box Plus（可见 6 项）

- **C29N DMS camera**（IPC 摄像头）
  - 勾选后出现「IPC extension cable」选择，共 3 种（3M / 5M / 7M），默认 3M
  - 当前可选数量上限: 1
- **CA38 reverse camera**（AHD 摄像头）
  - 勾选后出现「AHD extension cable」选择，共 3 种（3M / 5M / 7M），默认 3M
  - 当前可选数量上限: 1
- **CA42 wireless camera**（AHD 摄像头）
  - 勾选后出现「Rear BSD extension cable」选择，共 3 种（9M / 1.5M / 11M），默认 9M
  - 当前可选数量上限: 1
- **Square camera**（AHD 摄像头）
  - 勾选后出现「AHD extension cable」选择，共 3 种（3M / 5M / 7M），默认 3M
  - 当前可选数量上限: 1
- **Metal snail camera**（AHD 摄像头）
  - 勾选后出现「AHD 延长线」选择，共 3 种（3M / 5M / 7M），默认 3M
  - 当前可选数量上限: 1
- **DP7S screen**（非摄像头项）
  - 勾选后出现「Screen corrugated cable」选择，共 1 种（150MM），锁定不可换
  - 另出现「AHD 延长线」，共 3 种（3M / 5M / 7M）

**容量规则验证**（最多 1 路 IPC + 1 路 AHD（知识库规则 1））：

- 选 1 IPC + 1 AHD 后：IPC 剩余 0、AHD 剩余 0，警告=「无」
- 此时再选第二路 AHD（ca42）：✅ 被禁用
- 强行把 AHD 数量改为 2：实际被钳制回 1 ✅

### Power Box Max（可见 7 项）

- **CA46 BSD camera**（AHD 摄像头，仅 max）
  - 勾选后出现「AHD extension cable」选择，共 3 种（3M / 5M / 7M），默认 3M
  - 当前可选数量上限: 4
- **C29N DMS camera**（IPC 摄像头）
  - 勾选后出现「IPC extension cable」选择，共 3 种（3M / 5M / 7M），默认 3M
  - 当前可选数量上限: 1
- **CA38 reverse camera**（AHD 摄像头）
  - 勾选后出现「AHD extension cable」选择，共 3 种（3M / 5M / 7M），默认 3M
  - 当前可选数量上限: 4
- **CA42 wireless camera**（AHD 摄像头）
  - 勾选后出现「Rear BSD extension cable」选择，共 3 种（9M / 1.5M / 11M），默认 9M
  - 当前可选数量上限: 4
- **Square camera**（AHD 摄像头）
  - 勾选后出现「AHD extension cable」选择，共 3 种（3M / 5M / 7M），默认 3M
  - 当前可选数量上限: 4
- **Metal snail camera**（AHD 摄像头）
  - 勾选后出现「AHD 延长线」选择，共 3 种（3M / 5M / 7M），默认 3M
  - 当前可选数量上限: 4
- **DP7S screen**（非摄像头项）
  - 勾选后出现「Screen corrugated cable」选择，共 1 种（150MM），锁定不可换
  - 另出现「AHD 延长线」，共 3 种（3M / 5M / 7M）

**容量规则验证**（最多 1 IPC + 3 AHD，或 4 AHD（知识库规则 2））：

- 选 1 IPC + 3 AHD 后：剩余 IPC 0 / AHD 0，警告=「无」
- 不选 IPC、全选 AHD（4 路）后：警告=「无」，此时 IPC 剩余 0
- 4 路 AHD 时再选 IPC：✅ 被禁用

## 步骤 6 · 可选件（逐电源盒遍历）

### Standard Power Box（可见 2 项）
- **R-Watch**
- **Micro SD card**（最多 2 个）
  - 强行设置数量 7 → 实际 2 ✅ 钳制生效

### Power Box Plus（可见 2 项）
- **R-Watch**
- **Micro SD card**（最多 2 个）
  - 强行设置数量 7 → 实际 2 ✅ 钳制生效

### Power Box Max（可见 4 项）
- **R-Watch**
- **B2 sound and light alarm**（最多 2 个）
  - 勾选后自动带出必配件: B2 Power and Adapter Cable（SKU 1262010000025）
  - 延长线共 3 种（3M / 5M / 7M），可任选长度
  - 强行设置数量 7 → 实际 2 ✅ 钳制生效
- **B3 sound and light alarm**（最多 2 个）
  - 延长线共 3 种（3M / 7.5M / 2M），可任选长度
  - 强行设置数量 7 → 实际 2 ✅ 钳制生效
- **Micro SD card**（最多 2 个）
  - 强行设置数量 7 → 实际 2 ✅ 钳制生效

**R-Watch 互斥验证**（知识库规则 7：Standard 电源盒 + CA42 拖挂转接 时不可选 R-Watch）：
- Standard + CA42 + 拖挂转接后，R-Watch ✅ 被禁用

## 步骤 7 · 清单汇总与导出（满配 PBM 方案）

满配方案共 14 行物料：

- 5154021100086 × 1 — AD Plus 2.0+PBM Kit
- 1260040100236 × 1 — 16PIN OBD Extension Cable
- 1261020100065 × 1 — Video Output Cable
- 5190012100075 × 1 — DP7S Overseas Version
- 1210010100059 × 1 — AHD Signal Adapter Cable
- 1210030000163 × 2 — AHD Extension Cable
- 5152119100007 × 1 — C29N
- 1260010000351 × 2 — IPC Extension Cable
- 5051043100003 × 1 — CA38
- 5090091100025 × 1 — B2 Sound and Light Alarm
- 1262010000025 × 1 — B2 Power and Adapter Cable
- 5190108100003 × 1 — B3 Sound and Light Alarm
- 1260040100038 × 1 — B3 Extension Cable
- 1610002100008 × 1 — Micro SD 128GB

CSV 导出：14 行数据（清单 14 行）✅ 一致

## 疑似 Bug / 需要注意的问题（8 条）

### 🟡 提醒（8）

1. **[步骤5-standard-ca38-延长线]** 行 31 AHD Extension Cable（SKU 1210030000163） 页面上没有任何图片（catalog 与兜底图均缺）
2. **[步骤5-standard-ca38-延长线]** 行 32 AHD Extension Cable（SKU 1210030000164） 页面上没有任何图片（catalog 与兜底图均缺）
3. **[步骤5-standard-ca38-延长线]** 行 33 AHD Extension Cable（SKU 1210030000165） 页面上没有任何图片（catalog 与兜底图均缺）
4. **[步骤5-standard-ca42-延长线]** 行 37 Extension cable（SKU 1260010100201） 页面上没有任何图片（catalog 与兜底图均缺）
5. **[步骤5-standard-ca42-延长线]** 行 38 Extension cable（SKU 1260010100204） 页面上没有任何图片（catalog 与兜底图均缺）
6. **[步骤5-standard-ca42-延长线]** 行 39 Extension cable（SKU 1260010100216） 页面上没有任何图片（catalog 与兜底图均缺）
7. **[步骤6-max-b3-延长线]** 行 48 B3 Extension Cable（SKU 1260040100038） 页面上没有任何图片（catalog 与兜底图均缺）
8. **[步骤7-清单]** 清单 SKU 1610002100008 不在产品主数据库里（Micro SD 128GB）
