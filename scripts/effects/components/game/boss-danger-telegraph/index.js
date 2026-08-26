import { defineEffectComponent } from "../../../component-registry.js";
import { draw } from "./renderer.js";

export default defineEffectComponent({
  id: "boss-danger-telegraph", category: "game", draw,
  createState: () => ({
    playerX: 0.5, playerY: 0.58, previousX: 0.5, previousY: 0.58,
    lastDodge: 0, roundStartedAt: 0, attackIndex: 0, resolved: false,
    hp: 3, bossHp: 6, streak: 0, result: "", resultAt: 0, outcome: "",
  }),
  onPointerDown: ({ point, state, now, instance }) => {
    const game = state.custom;
    if (game.outcome) {
      Object.assign(game, {
        playerX: 0.5, playerY: 0.58, previousX: 0.5, previousY: 0.58,
        lastDodge: now, roundStartedAt: now, attackIndex: 0, resolved: false,
        hp: 3, bossHp: 6, streak: 0, result: "", resultAt: 0, outcome: "",
      });
      return;
    }
    game.previousX = game.playerX;
    game.previousY = game.playerY;
    game.playerX = point.x / instance.width;
    game.playerY = point.y / instance.height;
    state.custom.lastDodge = now;
  },
  card: {
    index: "G-30", track: "COMBAT TELEGRAPH", tags: ["战斗", "Boss", "预警"],
    interaction: "观察红色预警，在倒计时结束前点击青色安全区闪避；连续六次成功反击即可击败首领",
    title: "首领危险预警", subtitle: "BOSS / ATTACK TELEGRAPH",
    summary: "可游玩的四招 Boss 战：识别扇形、陨石、光束与环形预警，移动到安全区完成闪避和反击。",
    sourceName: "GameCraft-Bench · Void Harvest", sourceUrl: "https://github.com/FreedomIntelligence/gamecraft-bench/tree/main/tasks/roguelike-action-void-harvest",
    license: "Apache-2.0", status: "DANGER TELEGRAPH",
    notes: "依据 GameCraft-Bench 战斗任务对攻击前摇、危险区和闪避窗口的要求重新实现；包含生命、韧性、连胜、命中判定和胜负重开。",
  },
});
