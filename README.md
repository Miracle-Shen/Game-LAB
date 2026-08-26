# FX LAB

一个面向开源特效研究的浏览器案例库。首页进入游戏特效、音乐特效、游戏音效三个 Tab；三类内容均提供实时预览与独立 Hash case。

## 技术方案

- 无框架 SPA：`location.hash` 路由，直接由浏览器运行，无安装依赖。
- 数据层：每个 case 的展示数据与来源信息由自身目录的 `index.js` 提供；`scripts/data.js` 只聚合页面级信息。
- 渲染层：`scripts/effects.js` 只管理 Canvas 生命周期、暂停、高 DPI 适配、强度和 Pointer Events。
- 组件层：`scripts/effects/components/{category}/{id}/` 一张卡片一个完整目录；注册表校验组件、分类与 Hash。
- 页面层：`scripts/app.js` 渲染首页、目录、详情和技术方案，并管理视觉效果与音频播放。
- 音效检索：`scripts/sound-library.js` 提供模糊排序、阈值判定和未命中音效的生成 prompt。
- 推荐音乐链路：歌词时间轴 -> 关键词词典 -> text2vec 语义兜底 -> 特效调度器 -> Canvas / tsParticles / Three.js / Butterchurn。

游戏特效均为根据公开项目能力重新实现的 Canvas 效果，不包含 Unity、Godot 或 AGPL 项目的代码与素材。音乐特效包含 Stims 的 MilkDrop 预设录屏与 Performous libre song pack 的真实歌曲、歌词和音高谱；每项素材及其许可证记录在对应 case 的 `assets/ATTRIBUTION.md`。

## Case List

### 游戏特效

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

1. 晶矿开采：矿石耐久、晶体暴露和战利品飞散
2. 合成进化：单位吸附、融合闪光和等级成长
3. 棋盘横扫：消消乐横纵火箭和清屏道具
4. 跑酷冲刺：跑道偏移、跳跃、金币和速度线
5. 农场丰收：作物成熟波、收获金币和叶片粒子
6. 宝箱喷奖：开盖、金币喷射、闪光和烟尘落地
7. 幸运转盘：加速、减速定格和中奖爆闪
8. 奖励归仓：奖励沿弧线飞入 HUD 计数器

参考来源包括 Three.js、Unity VFX Graph Samples、VfxGraphAssets、WebGL Fluid Simulation、PixiJS Particle Emitter、Matter.js、Godot Demo Projects、Kenney Particle Pack 与 canvas-confetti。奖励反馈使用的粒子贴图及来源记录在对应 case 的 `assets/ATTRIBUTION.md`；Unity 样例仅用于视觉研究，不复用受 Unity Companion License 限制的代码或素材。

## 可插拔特效组件

每个游戏、音乐和音效 case 都是独立、可寻址的组件。以下四个值必须一致：

```text
卡片 id = component 字段 = 组件 id = Hash 最后一段
```

例如 `farm-harvest` 位于 `scripts/effects/components/game/farm-harvest/`，固定链接是 `#/game/farm-harvest`。组件通过统一协议声明：

```js
defineEffectComponent({
  id: "farm-harvest",
  category: "game",
  draw,
  card: { title: "农场丰收", /* ... */ },
  createState: () => ({ harvestCount: 0 }),
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

1. On the Run · Live：真实歌曲、逐音节歌词、麦克风音高、目标音符、准确率与响应式视觉的完整演唱闭环
2. 天净沙 · 秋思：直接展示 Stims 的 MilkDrop 预设画面
3. 雨霖铃 · 逐字：参考 Lyric Wave Player 的歌词时间轴
4. 水调歌头 · 流体：参考 Butterchurn 的 WebGL MilkDrop 管线
5. 将进酒 · 频谱：参考 audioMotion-analyzer 的频谱层级
6. 春江花月夜 · 分镜：参考 Glitchframe 的歌词视频与动态排字流程
7. 春江 · 声景：麦克风响度逐词推进歌词，实时音高驱动水面、月轮、流光和地平线转场

### 游戏音效

音效库现有 70 个可直接使用的 CC0 case：保留 Godot Audio Effects demo 的 7 个 WAV，从 10 套 Kenney 音频包中精选 40 个 OGG，从 Juhani Junkala / SubspaceAudio 的 512 Sound Effects (8-bit style) 中精选 15 个 WAV，并从 OpenGameArt 的自然环境与 rubberduck RPG 音效包中精选 8 个素材。内容覆盖界面、正负反馈、冲击、移动、电子、信号、棋牌、拟音、复古动作、短提示乐、英文语音、自然环境、魔法和怪物角色；每个音效都支持试听、下载、模糊搜索、场景分类与固定链接。

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
