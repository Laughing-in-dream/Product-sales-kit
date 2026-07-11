# M1N 2.0 向导全遍历审计报告（生成物，勿手改）

> 用 `node scripts/test/audit-m1n20.js` 生成。
> 方法：在 Node 沙盒加载真实应用代码，遍历 M1N 2.0 基础套装、接线、摄像头、可选件与导出流程，并按知识库规则审计。

## 步骤 1 · 基础套装

- M1N 2.0（SKU 5110038100014）

## 步骤 2 · 接线

- IPC Video Expansion Cable（SKU 1261050100344）
- Alarm Serial Port Connection Cable（SKU 1210040000008）

## 步骤 3 · 摄像头与通道容量

- **C29N（SKU 5152119100007）**（IPC）
  - 延长线：3M / 5M / 7M；默认=已选
- **CA29M（SKU 5151036100003）**（AHD）
  - 延长线：3M / 5M / 7M / 9M；默认=已选
- **CA20S（SKU 5151019100038）**（AHD）
  - 延长线：3M / 5M / 7M / 9M；默认=已选
- **AD Kit 3.0（SKU 5200007100101）**（IPC）
  - AD Kit 配件 DMS Riser Bracket（SKU 1120041000455）：自动勾选
  - AD Kit 配件 Riser Bracket Screws（SKU 1160010100023）：自动勾选
- **CA46（SKU 5151053100007）**（AHD）
  - 延长线：3M / 5M / 7M / 9M；默认=已选
- **Square Camera（SKU 5151003100126）**（AHD）
  - 延长线：3M / 5M / 7M / 9M；默认=已选
- **New Metal Conch（SKU 5151022100069）**（AHD）
  - 延长线：3M / 5M / 7M / 9M；默认=已选
- 强行设置 IPC 为 9：实际 2（上限 2） ✅
- 强行设置 AHD 为 9：实际 4（上限 4） ✅
- ADKIT + 1 路 IPC：IPC 2/2，录像 3（应为 2 路 IPC、3 路录像） ✅
- 4 AI 推荐方案：IPC 1/2，AHD 2/4，录像 4，内置算法 2/2，外置算法 2 ✅

## 步骤 4 · 可选件与联动配件

- R-Watch（SKU 5190067100044）
- Microphone（SKU 5190021100004）
  - 自动带出 Microphone Adapter Cable（SKU 1260040100057）：是
- 惯导模块（SKU 1630008100001）
- B2（SKU 5090091100025）
  - 延长线：3M / 5M / 7M；默认=已选
- B2（SKU 5090091100026）
  - 延长线：3M / 5M / 7M；默认=已选
- DP7S Overseas Version（SKU 5190012100075）
  - 自动带出 AHD Signal Adapter Cable（SKU 1210010100059）：是
  - 延长线：3M / 5M / 7M / 9M；默认=已选
- 12V Speaker（SKU 5190015100004）
  - 自动带出 Speaker Adapter Cable（SKU 1260011000026）：是
- Micro SD Card（SKU Specific Part Number Refer to Storage Device Recommendation List）
  - 可选规格：Micro SD 128GB / 1610002100008；Micro SD 256GB / 1610002100007；Micro SD 512GB / 1610002100006；Micro SD 1TB / 1610002100005
- M.2 SSD（SKU Specific Part Number Refer to Storage Device Recommendation List）
  - 可选规格：M.2 SSD 512GB / 1610004100014；M.2 SSD 1TB / 1610004100013；M.2 SSD 2TB / 1610004100012
- 选 1 个 B2：带出 1262010000025 ✅
- 选 2 个 B2：带出 1262010100031 ✅

## 步骤 5 · 清单汇总与导出

满配抽样方案共 15 行物料：

- 5110038100014 × 1 — M1N 2.0
- 1261050100344 × 1 — IPC Video Expansion Cable
- 5152119100007 × 2 — C29N DMS camera
- 5151036100003 × 4 — CA29M DMS camera
- 5090091100025 × 1 — B2 sound and light alarm
- 5090091100026 × 1 — B2 sound and light alarm
- 1262010100031 × 1 — B2 adapter cable
- 1260010000351 × 1 — IPC Extension Cable
- 1260010000351 × 1 — IPC Extension Cable
- 1260010100356 × 1 — AHD Extension Cable
- 1260010100356 × 1 — AHD Extension Cable
- 1260010100356 × 1 — AHD Extension Cable
- 1260010100356 × 1 — AHD Extension Cable
- 1260010000351 × 1 — IPC Extension Cable
- 1260010000351 × 1 — IPC Extension Cable

CSV 导出：15 行数据（清单 15 行） ✅ 一致

## 疑似 Bug / 需要注意的问题（0 条）

本次遍历未发现问题。