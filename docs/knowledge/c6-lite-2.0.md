# C6 Lite 2.0（产品线 id: `c6lite20`）

> 预置套装流程：单镜头或双镜头核心套装，再按接线、摄像头、附件完成选型。

## 1. 向导流程

1. 选择核心套装：双镜头 C6 Lite 2.0（row 7）或单镜头 C6 Lite 2.0-S（row 8）。
2. 选择接线：主机延长线、电源线、PBP 连接线与 AHD 拓展线（rows 9–15）。
3. 选择摄像头：单镜头套装可扩展 DMS / 倒车摄像头（rows 20–22）。
4. 选择附件：R-Watch 与 Micro SD 卡（rows 23–24）。
5. 确认并导出。

## 2. 已实现规则

| # | 规则 | 状态 | 来源 | 代码位置 |
| --- | --- | --- | --- | --- |
| 1 | 双镜头套装已占用两路 AHD，不能再增加摄像头 | ✅ 已核对 | 当前代码与审计 | `js/09-render-avm-c6.js: normalizeC6Selections` |
| 2 | 单镜头套装最多扩展 1 个 AHD 摄像头；选摄像头时自动带 1 条 AHD 视频拓展线，并可选摄像头延长线 | ✅ 已核对 | 当前代码与审计 | `js/06-cart.js: selectedPresetItems` |
| 3 | R-Watch 仅适用于 RS232 机型；CAN 接线时自动排除 | ✅ 已核对 | 当前代码与审计 | `js/09-render-avm-c6.js: normalizeC6Selections` |
| 4 | Micro SD 卡最多 1 张，规格复用统一 SD 卡容量选项 | ✅ 已核对 | 当前代码与审计 | `js/08-logic-mseries.js: presetVariantOptions` |

## 3. 待确认问题

- [ ] 当前可售清单仅有 RS232 核心套装（rows 7–8），但向导仍提供 CAN 电源线（rows 12–13）选择；需确认是否应补 CAN 核心套装，或隐藏 CAN 分支。（审计 2026-07-11）
- [ ] C6 Lite 2.0 的外接摄像头路数上限（AHD / IPC）是否除现有单镜头 1 路 AHD 扩展规则外还有其他限制？
