# FX LAB

FX LAB 是一个面向游戏原型与交互 Demo 的可复用特效案例库。它把难以用自然语言准确描述的视觉和听觉效果整理成可预览、可寻址、可直接接入代码的案例，减少反复搜索 Skill、模板和调试表现的时间成本。

## 项目简介

1. **游戏特效模板**：游戏制作知识会直接影响最终表现，因此项目收集并复现了常见游戏特效，希望逐步沉淀为可组合的原子化模板。当前案例的粒度仍在持续收敛，目标是在需要时能够直接插入游戏代码，而不必重新用自然语言描述效果。
2. **游戏音效库**：整理了约 90 个常见的交互反馈音、环境音、战斗音效、人声语音和背景音乐。简单交互场景可以直接试听、下载和复用，复杂场景再按具体需求定制生成。
3. **音乐特效探索**：围绕歌曲、演唱与时间谱面提供三种表达方式。Case 1 将演唱音高绘制成心形轨迹；Case 2 让歌词、响度与音高共同推动水面、月轮、流光等元素变化；Case 3 以歌曲为唯一时钟，在 3D 瓷瓶上自动揭示完整青花长卷。

首页提供游戏特效、音乐特效、游戏音效三个 Tab；三类内容均支持实时预览与独立 Hash case。

## 技术方案

- 无框架 SPA：`location.hash` 路由，直接由浏览器运行，无安装依赖。
- 数据层：每个 case 的展示数据与来源信息由自身目录的 `index.js` 提供；`scripts/data.js` 只聚合页面级信息。
- 渲染层：`scripts/effects.js` 只管理 Canvas 生命周期、暂停、高 DPI 适配、强度和 Pointer Events。
- 组件层：`scripts/effects/components/{category}/{id}/` 一张卡片一个完整目录；注册表校验组件、分类与 Hash。
- 页面层：`scripts/app.js` 渲染首页、目录、详情和技术方案，并管理视觉效果与音频播放。
- 音效检索：`scripts/sound-library.js` 提供模糊排序、阈值判定和未命中音效的生成 prompt。
- 特效检索：`scripts/game-library.js` 按标题、机制、来源与标签进行模糊排序，并支持一级标签组合筛选。
- 推荐音乐链路：歌词时间轴 -> 关键词词典 -> text2vec 语义兜底 -> 特效调度器 -> Canvas / tsParticles / Three.js / Butterchurn。

游戏特效均为根据公开项目能力重新实现的 Canvas 效果，不包含 Unity、Godot 或 AGPL 项目的代码与素材。音乐特效包含 Stims 的 MilkDrop 预设录屏与 Performous libre song pack 的真实歌曲、歌词和音高谱；每项素材及其许可证记录在对应 case 的 `assets/ATTRIBUTION.md`。

## Case List

### 游戏特效

目录页支持 `科技、战斗、休闲、奖励、策略、探索、节奏` 七类标签筛选；搜索会同时匹配中文标题、英文副标题、机制摘要、来源和每张卡片的细分标签。

```js
window.__FX_LAB__.gameLibrary.search("迷雾");
window.__FX_LAB__.gameLibrary.search("pary", { limit: 3, threshold: 0.22 });
```

高科技交互：

1. 磁场粒子核心：移动指针改变轨道，按住切换引力极性
2. 全息扫描舱：拖动扫描线，点击注入信号故障
3. 反应式能量盾：点击任意位置叠加冲击波和网格裂纹
4. 等离子流体：按住拖动向流场注入颜色与速度

休闲小游戏：

1. 连消瀑布：点击宝石触发爆破、连锁和补位反馈
2. 泡泡连锁：点击产生传播冲击波，引爆邻近泡泡
3. 切割冲刺：滑动生成切口、果汁粒子与速度轨迹
4. 连击庆典：连续点击累积 Combo 和全屏彩纸反馈

经典玩法：

1. 棋盘横扫：消消乐横纵火箭和清屏道具
2. 跑酷冲刺：跑道偏移、跳跃、金币和速度线
3. 宝箱喷奖：开盖、金币喷射、闪光和烟尘落地
4. 幸运转盘：加速、减速定格和中奖爆闪
5. 奖励归仓：奖励沿弧线飞入 HUD 计数器

战斗与策略反馈：

1. 临界弹反：时机窗口、格挡闪光与连胜计数
2. 连锁闪电：多目标选取、分叉电弧与命中反馈
3. 蓄力重击：按压聚能、目标跟随与分级冲击
4. 命中停顿：短暂停帧、白闪、震屏与伤害跳字
5. 冲刺残影：延迟姿态、染色叠影与弧线位移
6. 目标漩涡：向心粒子、锁定刻度与核心坍缩
7. 部署脉冲：范围预览、塔体落地与升级光柱
8. KO 终结定格：终结命中、画面抽色与胜方聚光

GameCraft-Bench 扩展反馈：

1. 时序幽灵回放：倒带扫描、历史轨迹与多轮行动分身
2. 潜行警戒锥：巡逻视野、遮挡空间与分级侦测警报
3. 节奏分级判定：四轨音符、判定线、连击与 Miss 碎裂
4. 弹道预测轨迹：抛物线预览、移动目标与落点冲击
5. 战争迷雾揭示：拖动探索、柔边视野与永久地图填充
6. Boss 危险预警：扇形、圆形和直线攻击区的蓄力倒计时
7. 捕获轨迹反馈：投掷弧线、三段摇晃、成功与挣脱结果
8. 理智值扭曲：色差、重影、闪烁、噪线与视野收缩
9. 结构连锁坍塌：承重失效、裂纹、粉尘与砖块分层下落
10. 近失冲突警告：预测航线、接近环、最短距离与改道
11. 连击断裂：倍率弹跳、颜色升阶与文字切片解体
12. 轨道冲突信号：占用区、道岔、红绿信号与碰撞倒计时

OpenGame 扩展反馈：

1. 地面冲击波：同心震荡环、裂纹和碎屑抛射
2. 导弹齐射锁定：旋转准星、弧形尾迹和错峰命中
3. 终极光束扫射：蓄力核心、宽光束与方向余辉
4. 魔法共鸣连锁：卡牌光边、旋转符文与倍率递增
5. 法术失效烟雾：断裂符文、灰紫烟雾与坠落火星
6. 答题攻击反噬：正确答案进攻、错误答案自身反冲
7. 红绿灯扫描：状态色块、扫描线与冻结剪影
8. 淘汰痕迹留存：短时冲击结束后保留弱化场地标记
9. 可破坏障碍：耐久分段、裂纹扩散与地块解锁
10. 波次清场级联：敌群顺序消散、奖励回流与阶段横幅
11. 弹丸命中连锁：飞行尾迹、命中环和连击倍率
12. 掩体遮挡淡化：角色进入前景建筑后的透明化与描边

参考来源包括 Three.js、Unity VFX Graph Samples、VfxGraphAssets、WebGL Fluid Simulation、PixiJS Particle Emitter、Matter.js、Godot Demo Projects、OpenGame、GameCraft-Bench、Kenney Particle Pack 与 canvas-confetti。奖励反馈使用的粒子贴图及来源记录在对应 case 的 `assets/ATTRIBUTION.md`；Unity、OpenGame 与 GameCraft-Bench 样例仅用于机制研究，不复制品牌角色、参考解答代码或受限媒体。

## 可插拔特效组件

每个游戏、音乐和音效 case 都是独立、可寻址的组件。以下四个值必须一致：

```text
卡片 id = component 字段 = 组件 id = Hash 最后一段
```

例如 `runner-boost` 位于 `scripts/effects/components/game/runner-boost/`，固定链接是 `#/game/runner-boost`。组件通过统一协议声明：

```js
defineEffectComponent({
  id: "runner-boost",
  category: "game",
  draw,
  card: { title: "跑酷冲刺", /* ... */ },
  createState: () => ({ coinCount: 0 }),
  onPointerDown({ state, point, now }) {},
  onPointerMove({ state, point, event }) {},
  onPointerUp({ state, event }) {},
});
```

每个目录至少包含 `index.js` 和 `renderer.js`；有本地素材时只能放在该目录的 `assets/` 下。`defineEffectComponent` 自动生成 canonical Hash，组件目录拥有卡片元数据、视觉实现、状态、事件与素材，公共运行时不保存任何 case 专属代码。

仓库级规范写在 `AGENTS.md`，后续修改都必须遵守。可运行以下命令验证所有卡片均有一一对应的组件与 Hash：

```bash
node scripts/validate-components.mjs
```

### 音乐特效

1. On the Run · Live：真实歌曲、逐音节歌词、麦克风音高、目标音符、准确率与响应式视觉的完整演唱闭环；详情页可随时返回“原唱试听 / 开始演唱”模式选择
2. 春江 · 声景：麦克风响度逐词推进歌词，实时音高驱动水面、月轮、流光和地平线转场
3. 瓷韵绘音：歌曲时间驱动 JSON 路径谱面、程序化旋转体瓷瓶、CanvasTexture 青花揭示与章节自动转面；曲终保留瓶底落印并可导出作品卡

### 游戏音效

音频库现有约 90 个可直接使用的 case，覆盖交互反馈、环境氛围、战斗动作、人声语音与 BGM。原文件保持 WAV 或 MP3 编码，不去重、不重编码。每个音频都支持试听、下载、模糊搜索、场景分类与固定链接，逐项来源记录位于自身目录的 `assets/ATTRIBUTION.md`。

其他项目可以直接导入 `scripts/sound-library.js`，或在页面运行后使用：

```js
window.__FX_LAB__.soundLibrary.search("金币奖励");
window.__FX_LAB__.soundLibrary.match([
  { id: "coin-pickup", description: "金币落入背包的奖励提示" },
  { id: "mech-land", description: "巨型机甲落地的低频冲击" },
], { threshold: 0.62 });
```

高于阈值的音效点返回 `decision: "reuse"` 和对应 card；低于阈值则返回 `decision: "generate"` 与独立生成 prompt。默认阈值为 `0.62`，调用方可按项目调节。

## 本地运行

```bash
python3 -m http.server 4173
```

打开 `http://127.0.0.1:4173/`。
