# AVM 向导审计报告

> 自动验证独立单机与级联从机的固定 BOM、延长线、B2 和存储规则。

- ✅ 单机固定带出 5170004100001
- ✅ 单机固定带出 5151097100002
- ✅ 单机固定带出 5190074100007
- ✅ 单机带出 4 条摄像机延长线
- ✅ 单机屏幕带 AHD 信号转接线且不带级联线
- ✅ 级联直接到屏幕：带 IPC 级联线和 AHD 信号转接线
- ✅ 级联分流录制：带 IPC 级联线和一拖二线
- ✅ B2 与两张 SD 卡正确带出

## 级联组合（AVM → 主机向导）

- ✅ [direct] 选 adplus20 后进入主机向导（productId=adplus20）
- ✅ [direct] adplus20: 预占 1 IPC / 0 AHD / 1 录像
- ✅ [direct] adplus20: 组合清单含 AVM Kit 与级联线（共 11 行）
- ✅ [direct] adplus20+Standard: 预占后 IPC 剩 0，C29N 被禁用
- ✅ [direct] 选 m1n20 后进入主机向导（productId=m1n20）
- ✅ [direct] m1n20: 预占 1 IPC / 0 AHD / 1 录像
- ✅ [direct] m1n20: 组合清单含 AVM Kit 与级联线（共 12 行）
- ✅ [direct] m1n20: 资源额度已计入预占（IPC 1/2，录像 1/6）
- ✅ [direct] m1n20: 主机自身套装已入组合清单
- ✅ [direct] 选 m3n 后进入主机向导（productId=m3n）
- ✅ [direct] m3n: 预占 1 IPC / 0 AHD / 1 录像
- ✅ [direct] m3n: 组合清单含 AVM Kit 与级联线（共 12 行）
- ✅ [direct] m3n: 资源额度已计入预占（IPC 1/4，录像 1/8）
- ✅ [direct] m3n: 主机自身套装已入组合清单
- ✅ [split] 选 adplus20 后进入主机向导（productId=adplus20）
- ✅ [split] adplus20: 预占 1 IPC / 1 AHD / 2 录像
- ✅ [split] adplus20: 组合清单含 AVM Kit 与级联线（共 11 行）
- ✅ [split] adplus20+Standard: 预占后 IPC 剩 0，C29N 被禁用
- ✅ [split] adplus20+Standard: AHD 也剩 0
- ✅ [split] 选 m1n20 后进入主机向导（productId=m1n20）
- ✅ [split] m1n20: 预占 1 IPC / 1 AHD / 2 录像
- ✅ [split] m1n20: 组合清单含 AVM Kit 与级联线（共 12 行）
- ✅ [split] m1n20: 资源额度已计入预占（IPC 1/2，录像 2/6）
- ✅ [split] m1n20: 主机自身套装已入组合清单
- ✅ [split] 选 m3n 后进入主机向导（productId=m3n）
- ✅ [split] m3n: 预占 1 IPC / 1 AHD / 2 录像
- ✅ [split] m3n: 组合清单含 AVM Kit 与级联线（共 12 行）
- ✅ [split] m3n: 资源额度已计入预占（IPC 1/4，录像 2/8）
- ✅ [split] m3n: 主机自身套装已入组合清单
- ✅ 返回导航：回到 AVM 第 4 步，模式/主机选择保留，组合状态已清
- ✅ 返回后 AVM 已选内容保留（11 行）
- ✅ 切换到其他产品后组合状态解除
- ✅ 直接进入 M1N 时无预占残留

审计完成：🔴 0 个疑似 bug