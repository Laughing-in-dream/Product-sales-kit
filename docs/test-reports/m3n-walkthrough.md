# M3N 向导全遍历审计报告（生成物，勿手改）

> 用 `node scripts/test/audit-m3n.js` 生成。通过 Node 沙盒加载真实向导代码，遍历基础套装、接线、摄像头、可选件与导出。

## 步骤 1 · 基础套装

- M3N（SKU 5120121100005）

## 步骤 2 · 接线

- 20PIN Plug Signal Cable（SKU 1261050100409）：勾选后进入清单 ✅
- Alarm Serial Port Connection Cable（SKU 1210040000008）：勾选后进入清单 ✅

## 步骤 3 · 摄像头与通道容量

- **C29N（SKU 5152119100007）**（IPC；延长线 3M / 5M / 7M）
- **CA29M（SKU 5151036100003）**（AHD；延长线 3M / 5M / 7M / 9M）
- **CA20S（SKU 5151019100038）**（AHD；延长线 3M / 5M / 7M / 9M）
- **AD Kit 3.0（SKU 5200007100101）**
  - AD Kit 配件 DMS Riser Bracket（SKU 1120041000455）：自动勾选
  - AD Kit 配件 Riser Bracket Screws（SKU 1160010100023）：自动勾选
- **CA46（SKU 5151053100007）**（AHD；延长线 3M / 5M / 7M / 9M）
- **Square Camera（SKU 5151003100126）**（AHD；延长线 3M / 5M / 7M / 9M）
- **New Metal Conch（SKU 5151022100069）**（AHD；延长线 3M / 5M / 7M / 9M）
- 强行设置 IPC 为 9：实际 4（上限 4） ✅
- 强行设置 AHD 为 9：实际 4（上限 4） ✅

## 步骤 4 · 可选件与联动配件

- 惯导模块（SKU 5190076100018）
- R-Watch（SKU 5190067100044）
- Microphone（SKU 5190021100004）
  - 自动带出 Microphone Adapter Cable（SKU 1260040100057）：是
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

满配抽样方案共 17 行物料：

- 5120121100005 × 1 — M3N
- 1261050100409 × 1 — 20PIN Plug Signal Cable
- 5152119100007 × 4 — C29N DMS camera
- 5151036100003 × 4 — CA29M DMS camera
- 5090091100025 × 1 — B2 sound and light alarm
- 5090091100026 × 1 — B2 sound and light alarm
- 1262010100031 × 1 — B2 adapter cable
- 1260010000351 × 1 — IPC Extension Cable
- 1260010000351 × 1 — IPC Extension Cable
- 1260010000351 × 1 — IPC Extension Cable
- 1260010000351 × 1 — IPC Extension Cable
- 1260010100356 × 1 — AHD Extension Cable
- 1260010100356 × 1 — AHD Extension Cable
- 1260010100356 × 1 — AHD Extension Cable
- 1260010100356 × 1 — AHD Extension Cable
- 1260010000351 × 1 — IPC Extension Cable
- 1260010000351 × 1 — IPC Extension Cable

CSV 导出：17 行数据（清单 17 行） ✅ 一致

## 疑似 Bug / 需要注意的问题（0 条）

本次遍历未发现问题。