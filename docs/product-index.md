# 产品主数据索引（生成物，勿手改）

> 由 `scripts/build_product_db.js` 从 `catalog-data.js` 生成，机器可读版在 `data/products.json`。
> 组织方式：**按产品分类**，每个产品（SKU）一行，"使用位置"列出所有用到它的产品线。
> 更新方式：改 Excel → 重新生成 catalog-data.js → `node scripts/build_product_db.js`。

共 **205 个产品（SKU 去重）**，其中 147 个有图片、58 个缺图片；53 个被多条产品线复用；线材 70 个中 69 个已识别出线长。

## 产品线总览

| 产品线 id | Excel 工作表 | 物料数 | 方案数 | 知识库文档 |
| --- | --- | --- | --- | --- |
| adplus20 | AD Plus 2_0 | 38 | 12 | [有](knowledge/adplus-2.0.md) |
| gt1prodcmax | GT1 Pro+DC Max | 45 | 2 | [有](knowledge/gt1-pro-dc-max.md) |
| c6lite20 | C6 Lite 2_0 | 20 | 5 | [有](knowledge/c6-lite-2.0.md) |
| m1n20 | M1N 2_0 | 36 | 2 | [有](knowledge/m1n-2.0.md) |
| m3n | M3N | 36 | 1 | [有](knowledge/m3n.md) |
| 960c53 | 960C53 | 46 | 3 | [有](knowledge/960c53.md) |
| 966c46ipc | 966C46-IPC | 25 | 0 | [有](knowledge/966c46-ipc.md) |
| f6n | F6N | 39 | 1 | [有](knowledge/f6n.md) |
| avm | AVM | 15 | 4 | [有](knowledge/avm.md) |
| z5 | Z5 | 7 | 1 | [有](knowledge/z5.md) |
| accessories | Accessories | 6 | 0 | [有](knowledge/accessories.md) |
| forkliftsolutionwaterproofc4 | Forklift Solution-Waterproof C4 | 30 | 0 | [有](knowledge/forklift-waterproof-c46.md) |

## 电源（2）

| SKU | 名称 | 规格 | 图片 | 使用位置（产品线#行号） |
| --- | --- | --- | --- | --- |
| 5190060100044 | 电源盒 |  | ❌ | accessories#4 |
| 3390000100032 | Power Box | C53 power box, can also power the screen… | ✅ 1张 | 960c53#11 |

## 核心套装（41）

| SKU | 名称 | 规格 | 图片 | 使用位置（产品线#行号） |
| --- | --- | --- | --- | --- |
| 1210050100055 | 3G/4G Antenna | Included in Kit 套装已包含 | ❌ | f6n#7 |
| 5152178100020 | 966C46-AHD kit | 1080P · 966C46-AHD kit | ✅ 1张 | forkliftsolutionwaterproofc4#6 |
| 5152178100018 | 966C46-IPC kit | 1080P · 966C46-IPC kit Note：When equipped with F… | ✅ 1张 | forkliftsolutionwaterproofc4#2 |
| 5200007100101 | AD Kit 3.0 | Contains CA20S, R-WATCH, and built-in AD… | ✅ 3张 | gt1prodcmax#42; m1n20#14; m3n#13 |
| 5154021100049 | AD Plus 2.0 Kit 套装 | 1080P · North American version 北美版本 | ❌ | adplus20#14 |
| 5154021100103 | AD Plus 2.0-S + PBP Kit 套装 | 500W · North American version 北美版本 | ✅ 1张 | adplus20#20 |
| 5154021100054 | AD Plus 2.0-S Kit 套装 | 500W · North American version 北美版本 | ✅ 1张 | adplus20#15 |
| 5154021100090 | AD Plus 2.0-S+PBM Kit 套装 | 500W · North American version 北美版本 | ✅ 1张 | adplus20#18 |
| 5154021100086 | AD Plus 2.0+PBM Kit 套装 | 1080P · North American version 北美版本 | ✅ 1张 | adplus20#17 |
| 5154021100098 | AD Plus 2.0+PBP Kit 套装 | 1080P · North American version 北美版本 | ✅ 1张 | adplus20#19 |
| 5170004100001 | AVM | Without Streamax Logo. This kit includes… | ✅ 1张 | avm#6 |
| 5190108100001 | B3 Alarm Device | Kit includes 套装已包含 | ✅ 1张 | 960c53#8 |
| 5152178100017 | C46 966C46-IPC kit | 1080P · IPC, 1080P, PON power supply. Includes M… | ✅ 2张 | m1n20#39; m3n#16; 966c46ipc#2 |
| 1261010100043 | C53 Video Output Cable | Includes connections for screen and fron… | ✅ 1张 | 960c53#12 |
| 5152132100019 | C53-L | 1080P · White, no logo, with B3 alarm, without G… | ✅ 1张 | 960c53#2 |
| 5152132100060 | C53-L | 1080P · White, with Streamax logo, with B3 alarm… | ✅ 1张 | 960c53#3 |
| 5152132100055 | C53-L | 1080P · Black, no logo, with B3 alarm, without G… | ✅ 1张 | 960c53#4 |
| 5152132100021 | C53-R | 1080P · White, no logo, with B3 alarm, without G… | ✅ 1张 | 960c53#5 |
| 5152132100062 | C53-R | 1080P · White, with Streamax logo, with B3 alarm… | ✅ 1张 | 960c53#6 |
| 5152132100056 | C53-R | 1080P · Black, no logo, with B3 alarm, without G… | ✅ 1张 | 960c53#7 |
| 5154022100067 | C6 Lite 2.0 Kit 套装 | 1080P · North America Version, RS232. Default lo… | ❌ | c6lite20#7 |
| 5154022100044 | C6 Lite 2.0 Kit 套装 | North America Version, CAN. Default powe… | ✅ 1张 | c6lite20#25 |
| 5154022100068 | C6 Lite 2.0-S Kit套装 | 1080P · North America Version, RS232. Default lo… | ❌ | c6lite20#8 |
| 5154022100083 | C6 Lite 2.0-S Kit套装 | North America Version, CAN. Default powe… | ✅ 1张 | c6lite20#26 |
| 1120041000455 | DMS Riser Bracket DMS垫高支架 | Used for AD Kit 3.0 when height is low o… | ❌ | gt1prodcmax#43; m1n20#15; m3n#14 |
| 5110037100001 | F6N-H0401 | 1080P · Asia-Europe full-feature version 亚欧全功能版本 | ✅ 1张 | f6n#2 |
| 5110037100002 | F6N-H0401 | 1080P · Asia-Europe version without WIFI 亚欧不带WIF… | ✅ 1张 | f6n#3 |
| 5110037100003 | F6N-H0401 | 1080P · Latin America full-feature version 拉美全功能… | ❌ | f6n#4 |
| 5110037100004 | F6N-H0401 | 1080P · No communication module (offline version… | ❌ | f6n#5 |
| 1210050100111 | GNSS Antenna | Included in Kit 套装已包含 | ✅ 1张 | f6n#8 |
| 1160060100011 | Hex Screwdriver | Kit includes 套装已包含 | ✅ 1张 | 960c53#14 |
| 1160060100010 | Hex Screwdriver 内六角螺丝刀 | For securing Micro SD cards. Included in… | ❌ | f6n#10 |
| 5110038100014 | M1N 2.0 | 1080P · North American version. No Logo. With HD… | ✅ 2张 | m1n20#4; 966c46ipc#12 |
| 5120121100005 | M3N | North American version. No Logo. With HD… | ✅ 1张 | m3n#4 |
| 1261030100120 | Power Cable 电源线 | Included in Kit 套装已包含 | ❌ | f6n#6 |
| 1160010100023 | Riser Bracket Screws DMS垫高支架螺丝 | Riser bracket screws for securing the DM… | ❌ | gt1prodcmax#44; m1n20#16; m3n#15 |
| 1261080100078 | Serial Port Input Cable | Kit includes 套装已包含 | ✅ 1张 | 960c53#13 |
| 1122042100107 | Short Bracket | C53-L kit includes C53-L套装已包含 | ✅ 1张 | 960c53#9 |
| 1122042100096 | Short Bracket | C53-R kit includes C53-R套装已包含 | ✅ 1张 | 960c53#10 |
| 1120041100282 | SIM Card Ejector Pin SIM卡取卡针 | Included in Kit 套装已包含 | ❌ | f6n#9 |
| 5210056100004 | Z5 | 4K · North America Version: Includes main uni… | ✅ 3张 | z5#2 |

## 主机 / MDVR（12）

| SKU | 名称 | 规格 | 图片 | 使用位置（产品线#行号） |
| --- | --- | --- | --- | --- |
| 1260040100326 | Device Extension Cable 主机延长线 | 4 meters. Choose if the standard 2-meter… | ❌ | c6lite20#9 |
| 5110039100020 | F1N-V1.2 | EC25-EC， Europe version, please note tha… | ✅ 1张 | forkliftsolutionwaterproofc4#15 |
| 5110039100023 | F1N-V1.2 | EC25-J， Japan version, please note that … | ✅ 1张 | forkliftsolutionwaterproofc4#16 |
| 5110039100024 | F1N-V1.2 | EC25-AF， NA version, please note that th… | ✅ 1张 | forkliftsolutionwaterproofc4#17 |
| 5110039100025 | F1N-V1.2 | EC25-AU， LA version, please note that th… | ✅ 1张 | forkliftsolutionwaterproofc4#18 |
| 5110038100028 | M1N-2.0 | 1080P · Asia-Europe version, other regional vers… | ✅ 1张 | 960c53#45 |
| 5110038100228 | M1N-2.0 | 1080P · For Europe | ✅ 1张 | 966c46ipc#10 |
| 5110038100004 | M1N-2.0 | 1080P · For Latin America | ✅ 1张 | 966c46ipc#11 |
| 5195004100007 | M1N-TKH0401 | Asia-Europe version, other regional vers… | ✅ 1张 | 960c53#43 |
| 5194003100009 | X1N-H0401 | Asia-Europe version, other regional vers… | ✅ 1张 | 960c53#44 |
| 5196009100018 | X3N-H0404 | Asia-Europe version, other regional vers… | ✅ 1张 | 960c53#42 |
| 5196011100008 | X3NPRO-H0404 | Asia-Europe version, other regional vers… | ✅ 1张 | 960c53#41 |

## 线材（70）

| SKU | 名称 | 规格 | 图片 | 使用位置（产品线#行号） |
| --- | --- | --- | --- | --- |
| 1261080100072 | 16PIN OBD Cable | 0.3m · Based on vehicle model selection, it is … | ✅ 1张 | adplus20#23 |
| 1260040100236 | 16PIN OBD Extension Cable | 1.5m · Used to extend the 16PIN OBD cable which… | ✅ 1张 | adplus20#25 |
| 1261090100095 | 16PIN OBD Power Cable | 0.3m · Only for RS232 Model. Choose according t… | ✅ 1张 | c6lite20#10 |
| 1261090100120 | 16PIN OBD Power Cable | 0.3m · Only for CAN Model. Choose according to … | ✅ 1张 | c6lite20#12 |
| 1261050100409 | 20PIN Plug Signal Cable | 0.25m · Required for connecting the second IPC a… | ✅ 1张 | m3n#5 |
| 1261080100075 | 9PIN OBD Cable | 0.3m · Based on vehicle model selection, it is … | ✅ 1张 | adplus20#22 |
| 1260060100012 | 9PIN OBD Cable | 0.45m · Based on vehicle model selection, it is … | ✅ 1张 | adplus20#24 |
| 1261090100117 | 9PIN OBD Power Cable | 0.3m · Only for RS232 Model. Choose according t… | ✅ 1张 | c6lite20#11 |
| 1261090100121 | 9PIN OBD Power Cable | 0.3m · Only for CAN Model. Choose according to … | ✅ 1张 | c6lite20#13 |
| 1260020100165 | 座椅振动器连接线 | 4.5m | ❌ | accessories#3 |
| 1261010100061 | Adapt cable | 0.3m · Old version Careful selection, not recom… | ✅ 1张 | 966c46ipc#17 |
| 1260011100296 | Adapt cable | 0.3m · Kit include | ✅ 1张 | forkliftsolutionwaterproofc4#25 |
| 1261010100086 | Adapt cable | 0.3m · Kit include | ✅ 1张 | forkliftsolutionwaterproofc4#26 |
| 1260011100157 | adapt cable for normal AHD camera | 0.5m · AHD adapt cable，use for RS765-4 adapter … | ✅ 1张 | forkliftsolutionwaterproofc4#30 |
| 1261010100072 | adapter cable | 0.3m · kit include | ✅ 1张 | 966c46ipc#3 |
| 1260040100434 | adapter cable | 0.5m · kit include | ✅ 1张 | forkliftsolutionwaterproofc4#3 |
| 1260011100208 | AHD Expansion Cable AHD 视频拓展线 | 0.5m · Only for C6 Lite 2.0-S. Used for extend … | ❌ | c6lite20#15 |
| 1210030000163 | AHD Extension Cable AHD 延长线 | 3m · 3M. Select according to project requirem… | ✅ 1张 | adplus20#31; f6n#26 |
| 1210030000164 | AHD Extension Cable AHD 延长线 | 5m · 5M. Select according to project requirem… | ✅ 1张 | adplus20#32; f6n#27 |
| 1210030000165 | AHD Extension Cable AHD 延长线 | 7m · 7M. Select according to project requirem… | ✅ 1张 | adplus20#33; f6n#28 |
| 1260010100356 | AHD Extension Cable AHD延长线 | 3m · Optional based on requirements, primaril… | ✅ 1张 | gt1prodcmax#63; c6lite20#16; m1n20#24; m3n#24; f6n#22 |
| 1260010100357 | AHD Extension Cable AHD延长线 | 5m · Optional based on requirements, primaril… | ✅ 1张 | gt1prodcmax#64; c6lite20#17; m1n20#25; m3n#25; f6n#23 |
| 1260010100358 | AHD Extension Cable AHD延长线 | 7m · Optional based on requirements, primaril… | ✅ 1张 | gt1prodcmax#65; c6lite20#18; m1n20#26; m3n#26; f6n#24 |
| 1260010100359 | AHD Extension Cable AHD延长线 | 9m · Optional based on requirements, primaril… | ✅ 1张 | gt1prodcmax#66; c6lite20#19; m1n20#27; m3n#27; f6n#25 |
| 1210010100059 | AHD Signal Adapter Cable AHD信号转接线 | 0.15m · Resolve screen ripple issue. Work with D… | ❌ | adplus20#41; gt1prodcmax#72; m1n20#32; m3n#32; f6n#34; avm#16 |
| 1210010100058 | AHD Signal Adapter Cable AHD信号转接线 | 0.15m · Resolve screen ripple issue. Work with D… | ❌ | gt1prodcmax#73; f6n#35 |
| 1210040000008 | Alarm Serial Port Connection Cable | 0.2m · Required for connecting microphone and ?… | ✅ 2张 | m1n20#7; m3n#7 |
| 1261020100108 | Audio-Video Adapter Cable 音视频转接线 | 0.4m · 当接客屏接头不匹配需要转接时使用; If the customer wishes… | ✅ 1张 | 960c53#50; avm#7 |
| 1260010100268 | Audio-Video Extension Cable | 9m · 9 meters. Typically, an extension cable … | ✅ 3张 | 960c53#24,34; forkliftsolutionwaterproofc4#14 |
| 1260011100152 | Audio-Video Extension Cable 音视频延长线 | 5m · Choose based on project requirements 根据项… | ❌ | avm#9 |
| 1260011100153 | Audio-Video Extension Cable 音视频延长线 | 11m · Choose based on project requirements 根据项… | ❌ | avm#10 |
| 1260011100154 | Audio-Video Extension Cable 音视频延长线 | 15m · Choose based on project requirements 根据项… | ❌ | avm#11 |
| 1260011100155 | Audio-Video Extension Cable 音视频延长线 | 23m · Choose based on project requirements 根据项… | ❌ | avm#12 |
| 1261050000056 | Aviation Port Adapter Cable 航空头转接线 | 0.2m · Choose when speaker and screen are both … | ❌ | gt1prodcmax#74; m1n20#33; m3n#33; f6n#36 |
| 1260011100181 | AVOUT Adapter Cable | 0.5m · 当接客屏接头不匹配需要转接时使用 | ✅ 1张 | 960c53#49 |
| 1262010000025 | B2 Power and Adapter Cable 电源及转接线 | 0.5m · Connects to one B2, requires separate po… | ❌ | adplus20#45; gt1prodcmax#55; m1n20#20; m3n#20; avm#19 |
| 1262010100031 | B2 Power and Adapter Cable 电源及转接线 | 0.55m · Connects to two B2, requires separate po… | ✅ 1张 | adplus20#46; gt1prodcmax#56; m1n20#21; m3n#21; avm#20 |
| 1210040000204 | B3 Extension Cable 延长线 | 2m · 2 meters. The B3 in the kit comes with a… | ✅ 1张 | adplus20#50; 960c53#29 |
| 1260040100038 | B3 Extension Cable 延长线 | 3m | ❌ | adplus20#48 |
| 1260040000149 | B3 Extension Cable 延长线 | 7.5m · 7.5 meters. The B3 in the kit comes with… | ✅ 1张 | adplus20#49; 960c53#30 |
| 1260040100052 | BA5 serial extension cable | 7m | ❌ | 966c46ipc#25 |
| 1261010100077 | C46-AHD-Maintenance cable | 0.3m · For C46-AHD line for config，must have ，t… | ✅ 1张 | forkliftsolutionwaterproofc4#9 |
| 1260010100206 | C46-IPC-Extension cable | 3m · 3m， Please note that it is a Chinese lab… | ✅ 1张 | forkliftsolutionwaterproofc4#7 |
| 1260010100217 | C46-IPC-Extension cable | 11m · 11m， Please note that it is a Chinese la… | ✅ 1张 | forkliftsolutionwaterproofc4#8 |
| 1260010000357 | C46-IPC-Extension cable | 15m · 15m | ✅ 1张 | 966c46ipc#9 |
| 1260010100265 | C53 to CA51 Extension Cable | 3m · 3 meters, both ends with M12 waterproof … | ✅ 2张 | 960c53#31; forkliftsolutionwaterproofc4#11 |
| 1260010100266 | C53 to CA51 Extension Cable | 5m · 5 meters, both ends with M12 waterproof … | ✅ 2张 | 960c53#32; forkliftsolutionwaterproofc4#12 |
| 1260010100267 | C53 to CA51 Extension Cable | 7m · 7 meters, both ends with M12 waterproof … | ✅ 2张 | 960c53#33; forkliftsolutionwaterproofc4#13 |
| 1260010000130 | Cascading Mode Adapter Cable 级联模式转接线 | 2m · Adapter cable required to connect the AV… | ❌ | avm#8 |
| 1260010100204 | Extension cable 延长线 | 1.5m · 1.5M. Optional | ❌ | adplus20#38 |
| 1260010100201 | Extension cable 延长线 | 9m · 9M. Optional | ❌ | adplus20#37 |
| 1260010100216 | Extension cable 延长线 | 11m · 11M. Optional | ❌ | adplus20#39 |
| 1262010100136 | Extension Cable 延长线 | 1.3m · Extension cable for Z5 and ABS power box… | ✅ 1张 | z5#8 |
| 1261080100093 | I/O Serial Cable I/O串口线 | 0.2m · Required for triggering IO alarms 触发 IO … | ❌ | f6n#11 |
| 1260010000351 | IPC Extension Cable IPC 延长线 | 3m · 3M. Select according to project requirem… | ✅ 3张 | adplus20#28; gt1prodcmax#67; m1n20#28; m3n#28; 960c53#37; 966c46ipc#6; f6n#29 |
| 1260010000352 | IPC Extension Cable IPC 延长线 | 5m · 5M. Select according to project requirem… | ✅ 3张 | adplus20#29; gt1prodcmax#68; m1n20#29; m3n#29; 960c53#38; 966c46ipc#7; f6n#30 |
| 1260010000353 | IPC Extension Cable IPC 延长线 | 7m · 7M. Select according to project requirem… | ✅ 3张 | adplus20#30; gt1prodcmax#69; m1n20#30; m3n#30; 960c53#39; 966c46ipc#8; f6n#31 |
| 1260011000023 | IPC Port to Network Port Cable IPC口转网口线材 | 0.15m | ❌ | f6n#12 |
| 1261050100344 | IPC Video Expansion Cable IPC/CAN2线 | 0.25m · Required for connecting the second IPC a… | ✅ 1张 | m1n20#5 |
| 1260040100057 | Microphone Adapter Cable 麦克风转接线 | 0.5m · Connect to alarm serial cable 搭配报警串口连接线使… | ❌ | gt1prodcmax#27; m1n20#9; m3n#9 |
| 1261010100067 | PBP Connection Cable | 0.3m · For connecting with PBP. Do not use the … | ✅ 1张 | c6lite20#14 |
| 1261090100044 | Power Breakout Cable 电源散线 | 0.2m · The Power Box Plus optional OBD breakout… | ❌ | adplus20#26 |
| 1261090100061 | Power Breakout Cable 电源散线 | 0.2m · The Power Box Max optional OBD breakout … | ❌ | adplus20#27 |
| 1261010000013 | Router Adapter Cable | 0.8m · Option 1: Calibrate using a computer. Op… | ✅ 1张 | 960c53#40 |
| 1261050100490 | RS485 adapt cable | 0.2m · F1N optional - RS485 extension cable, us… | ✅ 1张 | forkliftsolutionwaterproofc4#29 |
| 1210030000162 | Screen Extension Cable | 1.5m | ✅ 1张 | 960c53#28 |
| 1260011000026 | Speaker Adapter Cable 喇叭转接线 | 0.2m · To avoid background noise issues, you ca… | ❌ | gt1prodcmax#76; m1n20#35; m3n#35; f6n#38 |
| 1261020000036 | Switch cable | 4m · When selecting switch, this line must be… | ✅ 1张 | 966c46ipc#22 |
| 1261020100065 | Video Output Cable 视频输出线 | 0.65m · Used for connecting to displays, AHD, IP… | ❌ | adplus20#21 |
| 5163020100001 | Wired Door Sensor 有线门磁 | Used in multi-door sensor scenarios. 多门磁… | ✅ 1张 | z5#9 |

## 屏幕（8）

| SKU | 名称 | 规格 | 图片 | 使用位置（产品线#行号） |
| --- | --- | --- | --- | --- |
| 5190012100059 | 7-inch Screen | It's recommended to use the C53 power bo… | ✅ 1张 | 960c53#26 |
| 5190012100030 | 7-inch Screen | It's recommended to use the C53 power bo… | ✅ 1张 | 960c53#27 |
| 5146054100001 | Display with waterproof | 7 inch Display with waterproof watch out… | ✅ 1张 | forkliftsolutionwaterproofc4#31 |
| 5190012100075 | DP7S - Streamax 7-inch Screen 锐明7寸屏：DP7S | Display only, non-touchscreen 纯显示，非触摸屏; … | ❌ | adplus20#40; gt1prodcmax#71; m1n20#31; m3n#31; f6n#33; avm#15 |
| 5190012100066 | DP7S Standard Version DP7S 标准版 | Display only, non-touchscreen 纯显示，非触摸屏 | ❌ | gt1prodcmax#70; f6n#32 |
| 5146026100001 | DP7S-With Streamax Logo | Powered by MDVR with Streamax logo Canno… | ❌ | 966c46ipc#18 |
| 5190012100084 | DP7S-Without Streamax Logo | Powered by MDVR or Vehicle power 独立电源，可以… | ❌ | 966c46ipc#19 |
| 1130040100051 | Sunshade | Optional | ❌ | 966c46ipc#20 |

## 报警与提醒（12）

| SKU | 名称 | 规格 | 图片 | 使用位置（产品线#行号） |
| --- | --- | --- | --- | --- |
| 5190015100004 | 12V Speaker 喇叭 | Support 5V/12V Power Supply 支持5V/12V供电 | ❌ | gt1prodcmax#75; m1n20#34; m3n#34; f6n#37 |
| 5181001100001 | 座椅振动器 |  | ❌ | accessories#2 |
| 5090091100025 | B2 Sound and Light Alarm 声光报警器 | Used for BSD alerts. Installed on the ex… | ✅ 2张 | adplus20#43; gt1prodcmax#53; m1n20#18; m3n#18; 960c53#35; avm#17 |
| 5090091100026 | B2 Sound and Light Alarm 声光报警器 | Used for BSD alerts. Installed on the ex… | ✅ 2张 | adplus20#44; gt1prodcmax#54; m1n20#19; m3n#19; 960c53#36; avm#18 |
| 5190108100003 | B3 Sound and Light Alarm声光报警器 | Used for BSD alerts. Installed inside th… | ✅ 1张 | adplus20#47 |
| 5164002100002 | BA5-I | standard solid line version：RS485+IO inp… | ✅ 1张 | 966c46ipc#14 |
| 5164002100004 | BA5-I | standard solid line version：RS485+IO inp… | ✅ 1张 | forkliftsolutionwaterproofc4#20 |
| 5164003100002 | BA5-O | standard solid line version：RS485+IO inp… | ✅ 1张 | 966c46ipc#13 |
| 5164003100004 | BA5-O | standard solid line version：RS485+IO inp… | ✅ 1张 | forkliftsolutionwaterproofc4#19 |
| 5190067100044 | R-Watch | No LOGO | ✅ 3张 | gt1prodcmax#23; m1n20#6; m3n#6 |
| 5190067100045 | R-Watch | With Streamax English LOGO | ✅ 1张 | gt1prodcmax#24 |
| 5190015100021 | Speaker 喇叭 | Cheap solution. Has background noise iss… | ❌ | gt1prodcmax#78; m1n20#36; m3n#36; f6n#39 |

## 摄像头（29）

| SKU | 名称 | 规格 | 图片 | 使用位置（产品线#行号） |
| --- | --- | --- | --- | --- |
| 5152119100007 | C29N | 800P · IPC，side mounting IPC，侧装 | ✅ 1张 | adplus20#34; m1n20#11; m3n#10 |
| 5152214100004 | C29N-P | 800P · waterproof DMS | ✅ 1张 | forkliftsolutionwaterproofc4#24 |
| 5151019100038 | CA20S | 1080P · AHD, NTSC. Choose based on requirements … | ✅ 3张 | gt1prodcmax#40; m1n20#13; m3n#12 |
| 5151019100070 | CA20S | 1080P · AHD, PAL. Choose based on requirements A… | ✅ 1张 | gt1prodcmax#41 |
| 5151029100026 | CA24S | 1080P · AHD, PAL, B-side mount. Choose based on … | ❌ | gt1prodcmax#45 |
| 5151029100027 | CA24S | 1080P · AHD, PAL, A-side mount. Choose based on … | ✅ 1张 | gt1prodcmax#46 |
| 5151029100022 | CA24S | 1080P · AHD, NTSC, B-side mount. Choose based on… | ✅ 1张 | gt1prodcmax#47 |
| 5151029100023 | CA24S | 1080P · AHD, NTSC, A-side mount. Choose based on… | ✅ 1张 | gt1prodcmax#48 |
| 5151036100003 | CA29M | 720P · 720P, NTSC. For side mount. Choose based… | ✅ 2张 | c6lite20#21; m1n20#12; m3n#11 |
| 5151047100025 | CA29P | 720P · PAL，Streamax logo | ❌ | f6n#14 |
| 5151047100029 | CA29P | 720P · PAL，No logo | ✅ 1张 | f6n#16 |
| 5151047100030 | CA29P | 720P · NTSC，No logo | ✅ 1张 | f6n#17 |
| 5051043100003 | CA38 | 1080P · AHD, 1080P, NTSC | ❌ | adplus20#35 |
| 5200027100004 | CA42 2.0 | 1080P · AHD, 1080P, NTSC | ✅ 1张 | adplus20#36 |
| 5151053100007 | CA46 | 1080P · AHD，1080P，NTSC; AHD, NTSC. Choose based … | ✅ 4张 | adplus20#16; gt1prodcmax#50; m1n20#17; m3n#17 |
| 5151053100002 | CA46 | 1080P · AHD, PAL. Choose based on requirements A… | ✅ 1张 | gt1prodcmax#49 |
| 5151077100038 | CA51-A | 1080P · With Independent Packaging, 1080P, PAL 带… | ✅ 1张 | 960c53#22 |
| 5151077100039 | CA51-A | 1080P · Without Independent Packaging, 1080P, PA… | ✅ 1张 | 960c53#23 |
| 5151097100002 | CA51D | 1080P · NTSC. CA51D comes with a bracket, no add… | ✅ 1张 | avm#13 |
| 3380000100089 | Camera Bracket | Adjustable Angle 0-90°, suitable for ver… | ✅ 1张 | 960c53#25 |
| 5151014100091 | MINI C24 | 720P · AHD, PAL. Choose based on requirements A… | ✅ 1张 | gt1prodcmax#51 |
| 5051014100110 | MINI C24 | 720P · AHD, NTSC. Choose based on requirements … | ✅ 1张 | gt1prodcmax#52 |
| 5151021100011 | New Metal Conch 新金属海螺 | 720P · 720P, PAL, Indoor non-waterproof 720P，PA… | ❌ | gt1prodcmax#59; f6n#18 |
| 5151021100017 | New Metal Conch 新金属海螺 | 720P · 720P, NTSC, Indoor non-waterproof 720P，N… | ❌ | gt1prodcmax#60; f6n#19 |
| 5151022100067 | New Metal Conch 新金属海螺 | 1080P · 1080P, PAL, Indoor non-waterproof 1080P，… | ❌ | gt1prodcmax#61; f6n#20 |
| 5151022100069 | New Metal Conch 新金属海螺 | 1080P · 1080P, NTSC, Indoor non-waterproof 1080P… | ❌ | gt1prodcmax#62; m1n20#23; m3n#23; f6n#21 |
| 5151003000006 | Square Camera | 720P · 720P, NTSC. Outdoor waterproof 室外防水 | ✅ 1张 | c6lite20#22 |
| 5151003100126 | Square Camera 方型机 | 720P · 720P, NTSC. Outdoor waterproof 720P，NTSC… | ❌ | gt1prodcmax#57; m1n20#22; m3n#22 |
| 5151072100008 | Square Camera 方型机 | 720P · 720P, PAL. Outdoor waterproof 720P，PAL，车… | ❌ | gt1prodcmax#58 |

## 存储（4）

| SKU | 名称 | 规格 | 图片 | 使用位置（产品线#行号） |
| --- | --- | --- | --- | --- |
| 5190005100063 | Micro SD Card | 64GB | ✅ 1张 | z5#3 |
| 5190005100062 | Micro SD Card | 128GB | ✅ 1张 | z5#4 |
| 5190005100060 | Micro SD Card | 256GB | ✅ 1张 | z5#5 |
| 5190005100083 | Micro SD Card | 512GB | ✅ 1张 | z5#6 |

## GPS / 定位（5）

| SKU | 名称 | 规格 | 图片 | 使用位置（产品线#行号） |
| --- | --- | --- | --- | --- |
| 1630008100001 | 惯导模块 | Choose based on project requirements 根据项… | ✅ 1张 | m1n20#10 |
| 5190076100018 | 惯导模块 | Choose based on project requirements 根据项… | ✅ 1张 | m3n#3 |
| 3130000100046 | External Inertial GPS Module | GOTOP, recommended. If the C53 operates … | ✅ 1张 | 960c53#19 |
| 3130000100047 | External Inertial GPS Module | GOTOP, recommended. If the C53 operates … | ✅ 1张 | 960c53#20 |
| 1210060100001 | External Standard GPS Module | Glead, not recommended. If the C53 opera… | ✅ 1张 | 960c53#21 |

## 支架与安装（9）

| SKU | 名称 | 规格 | 图片 | 使用位置（产品线#行号） |
| --- | --- | --- | --- | --- |
| 3380000100078 | Extension Bracket | White, suitable for right-side C53 白色，适用… | ✅ 1张 | 960c53#15 |
| 3380000100079 | Extension Bracket | White, suitable for left-side C53 白色，适用于… | ✅ 1张 | 960c53#16 |
| 3380000100094 | Extension Bracket | Black, suitable for right-side C53 黑色，适用… | ✅ 1张 | 960c53#17 |
| 3380000100093 | Extension Bracket | Black, suitable for left-side C53 黑色，适用于… | ✅ 1张 | 960c53#18 |
| 3380000100124 | Extension Bracket | Optional | ✅ 2张 | 966c46ipc#16; forkliftsolutionwaterproofc4#22 |
| 3380000100102 | Magnetic Mounting Bracket | Optional | ✅ 2张 | 966c46ipc#15; forkliftsolutionwaterproofc4#21 |
| 1120041100679 | Rainproof Bracket | kit include | ✅ 3张 | 966c46ipc#4; forkliftsolutionwaterproofc4#4,27 |
| 5190001000009 | Veyes Maintenance Tool 运维宝 | For Camera， to give a wifi hotspot 摄像机调试… | ✅ 1张 | f6n#13; forkliftsolutionwaterproofc4#10 |
| 1160060100013 | Wrench | kit include | ✅ 3张 | 966c46ipc#5; forkliftsolutionwaterproofc4#5,28 |

## 维护与标定（1）

| SKU | 名称 | 规格 | 图片 | 使用位置（产品线#行号） |
| --- | --- | --- | --- | --- |
| 5190074100007 | Calibration Cloth 标定布 | Set of 4, mandatory. Material is relativ… | ❌ | avm#14 |

## 其他配件（12）

| SKU | 名称 | 规格 | 图片 | 使用位置（产品线#行号） |
| --- | --- | --- | --- | --- |
| 1261050100448 | （名称缺失） |  | ❌ | 966c46ipc#24 |
| 1260040100267 | （名称缺失） |  | ❌ | 966c46ipc#26 |
| 1210010100070 | 8 IOoutput Extension Box | Optional For another extension IO output… | ✅ 1张 | 966c46ipc#23 |
| 1130082100045 | 酒测吹嘴 |  | ✅ 1张 | accessories#6 |
| 1130082100046 | 酒测吹嘴 |  | ✅ 1张 | accessories#7 |
| 5190121100001 | 酒精测试仪 | 下单请备注出货地区 | ❌ | accessories#5 |
| 5190114100001 | iButton |  | ✅ 2张 | gt1prodcmax#22 |
| 5190115100001 | iButton Reader |  | ✅ 2张 | gt1prodcmax#21 |
| 5190021100004 | Microphone 麦克风 | Connect to alarm serial cable 搭配报警串口连接线使… | ❌ | gt1prodcmax#26; m1n20#8; m3n#8 |
| 5190067100051 | R-Watch | Includes RS232 to RS485 connector cable.… | ✅ 2张 | adplus20#42; c6lite20#23 |
| 5173002100003 | Switch | Used for expanding more IPC in MDVR, up … | ✅ 1张 | 966c46ipc#21 |
| 5163001100003 | wheel speed sensor | warehouse has weak signal for gps, so wh… | ✅ 1张 | forkliftsolutionwaterproofc4#23 |

## SKU 列异常的行（Excel 数据质量问题）

以下行的 SKU 单元格填的不是料号（多为"参考推荐表"类说明文字），未收入产品库，需回源头补真实料号：

| 产品线 | 行号 | 名称 | SKU 单元格内容 |
| --- | --- | --- | --- |
| adplus20 | 51 | Micro SD Card | For specific part numbers, refer to the memory device recomm |
| gt1prodcmax | 79 | Micro SD Card | Specific Part Number Refer to Storage Device Recommendation  |
| c6lite20 | 20 | CA29P | ​5151047100028 |
| c6lite20 | 24 | Micro SD Card | Refer to specific part number in the device storage recommen |
| m1n20 | 37 | Micro SD Card | Specific Part Number Refer to Storage Device Recommendation  |
| m1n20 | 38 | M.2 SSD | Specific Part Number Refer to Storage Device Recommendation  |
| m3n | 37 | Micro SD Card | Specific Part Number Refer to Storage Device Recommendation  |
| m3n | 38 | M.2 SSD | Specific Part Number Refer to Storage Device Recommendation  |
| f6n | 15 | CA29P | ​5151047100028 |
| f6n | 40 | Micro SD Card | Specific Part Number Refer to Storage Device Recommendation  |

## 缺图片的产品清单

以下产品在所有产品线里都没有图片，补图时对照 Excel / 钉钉页面：

| SKU | 名称 | 分类 | 使用位置 |
| --- | --- | --- | --- |
| 5190060100044 | 电源盒 | 电源 | accessories#4 |
| 1210050100055 | 3G/4G Antenna | 核心套装 | f6n#7 |
| 5154021100049 | AD Plus 2.0 Kit 套装 | 核心套装 | adplus20#14 |
| 5154022100067 | C6 Lite 2.0 Kit 套装 | 核心套装 | c6lite20#7 |
| 5154022100068 | C6 Lite 2.0-S Kit套装 | 核心套装 | c6lite20#8 |
| 1120041000455 | DMS Riser Bracket DMS垫高支架 | 核心套装 | gt1prodcmax#43; m1n20#15; m3n#14 |
| 5110037100003 | F6N-H0401 | 核心套装 | f6n#4 |
| 5110037100004 | F6N-H0401 | 核心套装 | f6n#5 |
| 1160060100010 | Hex Screwdriver 内六角螺丝刀 | 核心套装 | f6n#10 |
| 1261030100120 | Power Cable 电源线 | 核心套装 | f6n#6 |
| 1160010100023 | Riser Bracket Screws DMS垫高支架螺丝 | 核心套装 | gt1prodcmax#44; m1n20#16; m3n#15 |
| 1120041100282 | SIM Card Ejector Pin SIM卡取卡针 | 核心套装 | f6n#9 |
| 1260040100326 | Device Extension Cable 主机延长线 | 主机 / MDVR | c6lite20#9 |
| 1260020100165 | 座椅振动器连接线 | 线材 | accessories#3 |
| 1260011100208 | AHD Expansion Cable AHD 视频拓展线 | 线材 | c6lite20#15 |
| 1210010100059 | AHD Signal Adapter Cable AHD信号转接线 | 线材 | adplus20#41; gt1prodcmax#72; m1n20#32; m3n#32; f6n#34; avm#16 |
| 1210010100058 | AHD Signal Adapter Cable AHD信号转接线 | 线材 | gt1prodcmax#73; f6n#35 |
| 1260011100152 | Audio-Video Extension Cable 音视频延长线 | 线材 | avm#9 |
| 1260011100153 | Audio-Video Extension Cable 音视频延长线 | 线材 | avm#10 |
| 1260011100154 | Audio-Video Extension Cable 音视频延长线 | 线材 | avm#11 |
| 1260011100155 | Audio-Video Extension Cable 音视频延长线 | 线材 | avm#12 |
| 1261050000056 | Aviation Port Adapter Cable 航空头转接线 | 线材 | gt1prodcmax#74; m1n20#33; m3n#33; f6n#36 |
| 1262010000025 | B2 Power and Adapter Cable 电源及转接线 | 线材 | adplus20#45; gt1prodcmax#55; m1n20#20; m3n#20; avm#19 |
| 1260040100038 | B3 Extension Cable 延长线 | 线材 | adplus20#48 |
| 1260040100052 | BA5 serial extension cable | 线材 | 966c46ipc#25 |
| 1260010000130 | Cascading Mode Adapter Cable 级联模式转接线 | 线材 | avm#8 |
| 1260010100204 | Extension cable 延长线 | 线材 | adplus20#38 |
| 1260010100201 | Extension cable 延长线 | 线材 | adplus20#37 |
| 1260010100216 | Extension cable 延长线 | 线材 | adplus20#39 |
| 1261080100093 | I/O Serial Cable I/O串口线 | 线材 | f6n#11 |
| 1260011000023 | IPC Port to Network Port Cable IPC口转网口线材 | 线材 | f6n#12 |
| 1260040100057 | Microphone Adapter Cable 麦克风转接线 | 线材 | gt1prodcmax#27; m1n20#9; m3n#9 |
| 1261090100044 | Power Breakout Cable 电源散线 | 线材 | adplus20#26 |
| 1261090100061 | Power Breakout Cable 电源散线 | 线材 | adplus20#27 |
| 1260011000026 | Speaker Adapter Cable 喇叭转接线 | 线材 | gt1prodcmax#76; m1n20#35; m3n#35; f6n#38 |
| 1261020100065 | Video Output Cable 视频输出线 | 线材 | adplus20#21 |
| 5190012100075 | DP7S - Streamax 7-inch Screen 锐明7寸屏：DP7S | 屏幕 | adplus20#40; gt1prodcmax#71; m1n20#31; m3n#31; f6n#33; avm#15 |
| 5190012100066 | DP7S Standard Version DP7S 标准版 | 屏幕 | gt1prodcmax#70; f6n#32 |
| 5146026100001 | DP7S-With Streamax Logo | 屏幕 | 966c46ipc#18 |
| 5190012100084 | DP7S-Without Streamax Logo | 屏幕 | 966c46ipc#19 |
| 1130040100051 | Sunshade | 屏幕 | 966c46ipc#20 |
| 5190015100004 | 12V Speaker 喇叭 | 报警与提醒 | gt1prodcmax#75; m1n20#34; m3n#34; f6n#37 |
| 5181001100001 | 座椅振动器 | 报警与提醒 | accessories#2 |
| 5190015100021 | Speaker 喇叭 | 报警与提醒 | gt1prodcmax#78; m1n20#36; m3n#36; f6n#39 |
| 5151029100026 | CA24S | 摄像头 | gt1prodcmax#45 |
| 5151047100025 | CA29P | 摄像头 | f6n#14 |
| 5051043100003 | CA38 | 摄像头 | adplus20#35 |
| 5151021100011 | New Metal Conch 新金属海螺 | 摄像头 | gt1prodcmax#59; f6n#18 |
| 5151021100017 | New Metal Conch 新金属海螺 | 摄像头 | gt1prodcmax#60; f6n#19 |
| 5151022100067 | New Metal Conch 新金属海螺 | 摄像头 | gt1prodcmax#61; f6n#20 |
| 5151022100069 | New Metal Conch 新金属海螺 | 摄像头 | gt1prodcmax#62; m1n20#23; m3n#23; f6n#21 |
| 5151003100126 | Square Camera 方型机 | 摄像头 | gt1prodcmax#57; m1n20#22; m3n#22 |
| 5151072100008 | Square Camera 方型机 | 摄像头 | gt1prodcmax#58 |
| 5190074100007 | Calibration Cloth 标定布 | 维护与标定 | avm#14 |
| 1261050100448 | （名称缺失） | 其他配件 | 966c46ipc#24 |
| 1260040100267 | （名称缺失） | 其他配件 | 966c46ipc#26 |
| 5190121100001 | 酒精测试仪 | 其他配件 | accessories#5 |
| 5190021100004 | Microphone 麦克风 | 其他配件 | gt1prodcmax#26; m1n20#8; m3n#8 |
