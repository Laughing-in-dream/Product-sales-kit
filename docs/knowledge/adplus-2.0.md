# AD Plus 2.0（产品线 id: `adplus20`）

> 双目/单目 ADAS 一体机方案，是向导里唯一走"自定义搭配"流程的产品：
> 主机 → 电源盒 → 接线方式 → 外接摄像头 → 可选件 → 导出。

## 1. 方案构成

- **主机（二选一）**
  - Dual-lens host（双目）—— 需要双路基础视频能力的项目
  - Single-lens host（单目）—— 只需单路、后续可能加配件的项目
- **电源盒（三选一）**，决定整个方案的扩展能力：
  - Standard Power Box —— 基础方案
  - Power Box Plus（PBP）—— 带 ECU 解析能力，默认含 16PIN 线
  - Power Box Max（PBM）—— 额外 4 路扩展，扩展性最强
- **接线方式（三选一）**：散线 / 9PIN J1939 / 16PIN OBD

## 2. 硬性规则（既是知识也是限制）

| # | 规则 | 状态 | 来源 | 代码位置 |
| --- | --- | --- | --- | --- |
| 1 | Standard / Plus 电源盒：最大支持 **1 路外接 IPC + 1 路 AHD** | ✅ 已确认 | 产品方案（用户 2026-07-10 口头确认） | `js/05-selection-logic.js: cameraCapacityRule()` |
| 2 | Power Box Max：最大 **1 路 IPC + 3 路 AHD**，或 **4 路 AHD（不带 IPC）** | ✅ 已确认 | 用户 2026-07-10 确认 | `js/05-selection-logic.js: cameraCapacityRule()` |
| 3 | CA46（AHD 摄像头，SKU 5151053100007）可搭配 Standard / PBP / PBM，计入 AHD 路数；Standard / PBP **各最多 1 个**，PBM 按规则 2 的 AHD 总路数限制 | ✅ 已确认 | 用户 2026-07-10 确认 | `js/03-data-adplus.js: customCatalog.accessories` |
| 4 | B2 声光报警器：**只能搭配 PBM**，最多 2 个；选 1 个时必带单 B2 电源及转接线（row 45 / SKU 1262010000025），选 2 个时改带双 B2 三合一转接线（row 46 / SKU 1262010100031）；每个 B2 必须带一条可选长度的 6PIN IPC 延长线（rows 28/29/30） | ✅ 已确认 | 用户 2026-07-10 确认 | `js/03-data-adplus.js: customCatalog.optionals → b2` |
| 5 | B3 报警器：**只能搭配 PBM**，最多 2 个；每个 B3 必须带一条延长线，**三种长度均可选** | ✅ 已确认 | 用户 2026-07-10 确认 | `js/03-data-adplus.js: customCatalog.optionals → b3` |
| 6 | Micro SD 卡最多选 2 张 | ✅ 已确认 | 用户 2026-07-10 确认 | `js/03-data-adplus.js: customCatalog.optionals → micro_sd` |
| 7 | R-Watch 与 **Standard 电源盒 + CA42 拖挂转接** 的组合互斥（选了后者不能选 R-Watch） | ✅ 已确认 | 用户 2026-07-10 确认 | `js/05-selection-logic.js: ca42TrailerAdapterBlocksRwatch()` |
| 8 | 散线接线：Standard 电源盒内置；PBP / PBM 需要单独散线物料 | ✅ 已确认 | 用户 2026-07-10 确认 | `js/03-data-adplus.js: customCatalog.wiringModes → loose` |
| 9 | 16PIN OBD：PBP / PBM **套装料号不含** 16PIN 电源延长线；向导默认勾选该延长线（SKU 1260040100236）并计入清单 | ✅ 已确认 | 用户 2026-07-10 确认 | `js/05-selection-logic.js: applyDefaultWiring()` |
| 10 | Standard / PBP 方案选屏幕或任一外接摄像头时，必须自动带出 Video Output Cable（SKU 1261020100065）；PBM 不带出此线 | ✅ 已确认 | 用户 2026-07-10 确认 | `js/06-cart.js: selectedCustomItems()` |

## 3. 选配关系

### 外接摄像头（受规则 1/2 的路数限制约束）

| 摄像头 | 类型 | 电源盒限制 | 延长线 |
| --- | --- | --- | --- |
| CA46（5151053100007） | AHD | Standard / PBP 最多 1 个；PBM 按 AHD 总路数限制 | AHD 延长线（3 档长度可选） |
| C29N（5152119100007，DMS 驾驶员监控） | IPC | 无 | IPC 延长线 |
| CA38（5051043100003） | AHD | 无 | AHD 延长线 |
| CA42（5200027100004，后 BSD） | AHD | 无 | 后 BSD 专用延长线 |
| CA46 M 系列版（5151022100069，借自 M3N 清单） | AHD | 无 | AHD 延长线 |
| 方形摄像头（5151003100126，借自 M1N 2.0 清单） | AHD | 无 | AHD 延长线 |

- 每路摄像头都要配对应类型的延长线。
- 屏幕（5190012100075）：波纹管线为锁定必配，另需 AHD 延长线；在 Standard / PBP 方案还必须带 Video Output Cable。
- Standard / PBP 方案的每个外接摄像头同样必须带 Video Output Cable；PBM 不需要此线。

### 可选件

| 可选件 | 电源盒限制 | 数量上限 | 备注 |
| --- | --- | --- | --- |
| R-Watch | 全部 | 1 | 见规则 7 的互斥关系 |
| B2 | 仅 PBM | 2 | 1 个配 row 45 单 B2 转接线；2 个配 row 46 双 B2 三合一转接线；每个 B2 均需一条 6PIN IPC 延长线（3M / 5M / 7M 可选） |
| B3 | 仅 PBM | 2 | 每个 B3 均需一条延长线，3 种长度可选 |
| Micro SD | 全部 | 2 | 128GB / 256GB / 512GB / 1TB |

## 4. 关键 SKU

见 `catalog-data.js`（AD Plus 2_0 产品线）及 `js/02-dom-state.js: SKU_LIBRARY`。
套装行号：Dual → row 14/19/17（Standard/Plus/Max），Single → row 15/20/18。

## 5. 待确认问题

- [ ] 已无待确认的硬性规则；后续新增或调整方案时需同步维护本表。
- [ ] CA42 拖挂转接与 R-Watch 互斥的原因（硬件冲突还是供电限制？）。
