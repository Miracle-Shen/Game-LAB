import { clamp, hash, TAU } from "../../../shared/canvas.js";

const ROUND_DURATION = 3600;
const IMPACT_AT = 2300;
const RECOVERY_AT = 2850;

const ATTACKS = [
  { type: "cone", name: "扇形挥砍", code: "ARC CLEAVE", hint: "离开红色扇区" },
  { type: "circles", name: "陨星落点", code: "METEOR MARKS", hint: "避开三个落点" },
  { type: "lanes", name: "裂地光束", code: "RIFT BEAMS", hint: "进入青色通道" },
  { type: "ring", name: "冲击波环", code: "SHOCK RING", hint: "进入内圈" },
];

function playerPosition(state, w, h) {
  return {
    x: clamp(state.custom.playerX, 0.06, 0.94) * w,
    y: clamp(state.custom.playerY, 0.2, 0.92) * h,
  };
}

function attackGeometry(type, attackIndex, w, h, size) {
  const boss = { x: w * 0.5, y: h * 0.31 };
  if (type === "cone") {
    return { boss, angle: Math.PI / 2 + (attackIndex % 2 ? 0.34 : -0.34), spread: 0.46, range: size * 0.86, safe: { x: w * (attackIndex % 2 ? 0.16 : 0.84), y: h * 0.48 } };
  }
  if (type === "circles") {
    return { boss, radius: size * 0.145, points: [{ x: w * 0.28, y: h * 0.46 }, { x: w * 0.54, y: h * 0.61 }, { x: w * 0.77, y: h * 0.44 }], safe: { x: w * 0.14, y: h * 0.5 } };
  }
  if (type === "lanes") {
    const safeLane = attackIndex % 3;
    return { boss, safeLane, laneWidth: w / 3, safe: { x: (safeLane + 0.5) * w / 3, y: h * 0.5 } };
  }
  return { boss, center: { x: w * 0.5, y: h * 0.55 }, inner: size * 0.12, outer: size * 0.34, safe: { x: w * 0.5, y: h * 0.55 } };
}

function isDanger(type, geometry, player) {
  if (type === "cone") {
    const dx = player.x - geometry.boss.x;
    const dy = player.y - geometry.boss.y;
    const delta = Math.atan2(Math.sin(Math.atan2(dy, dx) - geometry.angle), Math.cos(Math.atan2(dy, dx) - geometry.angle));
    return Math.hypot(dx, dy) < geometry.range && Math.abs(delta) < geometry.spread;
  }
  if (type === "circles") return geometry.points.some((point) => Math.hypot(player.x - point.x, player.y - point.y) < geometry.radius);
  if (type === "lanes") return Math.floor(clamp(player.x / geometry.laneWidth, 0, 2.999)) !== geometry.safeLane;
  const distance = Math.hypot(player.x - geometry.center.x, player.y - geometry.center.y);
  return distance > geometry.inner && distance < geometry.outer;
}

function updateGame(state, w, h, size) {
  const game = state.custom;
  if (!game.roundStartedAt) game.roundStartedAt = state.now;
  if (game.outcome) return { elapsed: RECOVERY_AT, attack: ATTACKS[game.attackIndex % ATTACKS.length] };
  let elapsed = state.now - game.roundStartedAt;
  if (elapsed >= ROUND_DURATION) {
    game.attackIndex += 1;
    game.roundStartedAt = state.now;
    game.resolved = false;
    game.result = "";
    elapsed = 0;
  }
  const attack = ATTACKS[game.attackIndex % ATTACKS.length];
  if (!game.resolved && elapsed >= IMPACT_AT) {
    const hit = isDanger(attack.type, attackGeometry(attack.type, game.attackIndex, w, h, size), playerPosition(state, w, h));
    game.resolved = true;
    game.resultAt = state.now;
    if (hit) {
      game.hp -= 1;
      game.streak = 0;
      game.result = "hit";
      if (game.hp <= 0) game.outcome = "defeat";
    } else {
      game.bossHp -= 1;
      game.streak += 1;
      game.result = "dodge";
      if (game.bossHp <= 0) game.outcome = "victory";
    }
  }
  return { elapsed, attack };
}

function drawArena(ctx, w, h, size) {
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.42, 0, w * 0.5, h * 0.48, Math.max(w, h) * 0.72);
  bg.addColorStop(0, "#25203a"); bg.addColorStop(0.5, "#121220"); bg.addColorStop(1, "#07080e");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(164,175,213,0.1)"; ctx.lineWidth = 1;
  for (let radius = size * 0.12; radius < size * 0.75; radius += size * 0.1) { ctx.beginPath(); ctx.ellipse(w * 0.5, h * 0.55, radius, radius * 0.52, 0, 0, TAU); ctx.stroke(); }
  for (let i = 0; i < 12; i += 1) { const angle = i / 12 * TAU; ctx.beginPath(); ctx.moveTo(w * 0.5, h * 0.55); ctx.lineTo(w * 0.5 + Math.cos(angle) * size * 0.72, h * 0.55 + Math.sin(angle) * size * 0.38); ctx.stroke(); }
}

function drawBoss(ctx, x, y, size, charge, impact) {
  ctx.save(); ctx.translate(x, y + (impact ? Math.sin(Date.now() * 0.08) * 3 : 0));
  ctx.shadowColor = impact ? "#ffffff" : "#ff4265"; ctx.shadowBlur = 18 + charge * 28;
  ctx.fillStyle = impact ? "#fff3e7" : "#9d294a"; ctx.beginPath(); ctx.arc(0, 0, size * 0.075, 0, TAU); ctx.fill();
  ctx.fillStyle = "#210c19"; ctx.beginPath(); ctx.moveTo(-size*.055,-size*.045);ctx.lineTo(-size*.11,-size*.12);ctx.lineTo(-size*.025,-size*.08);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(size*.055,-size*.045);ctx.lineTo(size*.11,-size*.12);ctx.lineTo(size*.025,-size*.08);ctx.closePath();ctx.fill();
  ctx.shadowBlur = 0; ctx.fillStyle = "#fff0c8"; ctx.beginPath(); ctx.arc(-size*.025,-size*.008,size*.009,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(size*.025,-size*.008,size*.009,0,TAU);ctx.fill();
  ctx.restore();
}

function drawSafeMarker(ctx, point, size, pulse) {
  ctx.save(); ctx.translate(point.x, point.y); ctx.strokeStyle = `rgba(91,239,208,${0.55 + pulse * 0.3})`; ctx.lineWidth = 2; ctx.setLineDash([size*.018,size*.012]); ctx.lineDashOffset = -pulse * size*.1; ctx.beginPath(); ctx.arc(0,0,size*(.055+pulse*.012),0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="rgba(91,239,208,.13)";ctx.beginPath();ctx.arc(0,0,size*.047,0,TAU);ctx.fill();ctx.fillStyle="#a9ffea";ctx.font=`800 ${Math.max(8,size*.019)}px system-ui`;ctx.textAlign="center";ctx.fillText("SAFE",0,size*.005);ctx.restore();
}

function drawTelegraph(ctx, type, geometry, size, charge, impact, t) {
  const alpha = impact ? 0.8 : 0.1 + charge * 0.28;
  ctx.save(); ctx.fillStyle = `rgba(255,48,73,${alpha})`; ctx.strokeStyle = impact ? "#fff4e9" : `rgba(255,101,107,${0.5 + charge * 0.5})`; ctx.lineWidth = 2 + charge * 5;
  if (type === "cone") { ctx.beginPath();ctx.moveTo(geometry.boss.x,geometry.boss.y);ctx.arc(geometry.boss.x,geometry.boss.y,geometry.range,geometry.angle-geometry.spread,geometry.angle+geometry.spread);ctx.closePath();ctx.fill();ctx.stroke(); }
  if (type === "circles") geometry.points.forEach((point,index)=>{ctx.beginPath();ctx.arc(point.x,point.y,geometry.radius*(.88+charge*.12),0,TAU);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(point.x-geometry.radius,point.y);ctx.lineTo(point.x+geometry.radius,point.y);ctx.moveTo(point.x,point.y-geometry.radius);ctx.lineTo(point.x,point.y+geometry.radius);ctx.stroke();ctx.fillStyle="rgba(255,242,204,.82)";ctx.font=`800 ${Math.max(9,size*.023)}px system-ui`;ctx.textAlign="center";ctx.fillText(String(index+1),point.x,point.y+4);});
  if (type === "lanes") { for(let lane=0;lane<3;lane+=1){const x=lane*geometry.laneWidth;if(lane===geometry.safeLane){ctx.fillStyle="rgba(79,224,199,.13)";ctx.strokeStyle="rgba(95,245,219,.7)";}else{ctx.fillStyle=`rgba(255,48,73,${alpha})`;ctx.strokeStyle=impact?"#fff4e9":`rgba(255,101,107,${.5+charge*.5})`;}ctx.fillRect(x+5,0,geometry.laneWidth-10,ctx.canvas.clientHeight||ctx.canvas.height);ctx.strokeRect(x+5,0,geometry.laneWidth-10,ctx.canvas.clientHeight||ctx.canvas.height);}}
  if (type === "ring") { ctx.beginPath();ctx.arc(geometry.center.x,geometry.center.y,geometry.outer,0,TAU);ctx.arc(geometry.center.x,geometry.center.y,geometry.inner,0,TAU,true);ctx.fill("evenodd");ctx.beginPath();ctx.arc(geometry.center.x,geometry.center.y,geometry.outer,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(geometry.center.x,geometry.center.y,geometry.inner,0,TAU);ctx.stroke(); }
  if (impact) {ctx.globalCompositeOperation="lighter";for(let i=0;i<30;i+=1){const angle=hash(i*5.7)*TAU,distance=size*(.08+hash(i+7)*.42),x=geometry.boss.x+Math.cos(angle)*distance,y=geometry.boss.y+Math.sin(angle)*distance;ctx.fillStyle=`rgba(255,193,112,${1-hash(i)})`;ctx.fillRect(x,y,2+hash(i)*4,2+hash(i)*4);}}
  ctx.restore();
}

function drawPlayer(ctx, game, player, size, now) {
  const dodgeAge = now - game.lastDodge;
  if (dodgeAge < 320) { const p=clamp(dodgeAge/320,0,1);const fromX=game.previousX*ctx.canvas.clientWidth,fromY=game.previousY*ctx.canvas.clientHeight;ctx.strokeStyle=`rgba(93,236,255,${1-p})`;ctx.lineWidth=size*.018*(1-p);ctx.beginPath();ctx.moveTo(fromX,fromY);ctx.lineTo(player.x,player.y);ctx.stroke(); }
  const hitFlash=game.result==="hit"?1-clamp((now-game.resultAt)/420,0,1):0;ctx.save();ctx.translate(player.x,player.y);ctx.shadowColor=hitFlash?"#ff4963":"#58dcff";ctx.shadowBlur=14+hitFlash*18;ctx.fillStyle=hitFlash?"#ff6b78":"#b8f7ff";ctx.beginPath();ctx.arc(0,0,size*.028,0,TAU);ctx.fill();ctx.fillStyle="#183347";ctx.beginPath();ctx.moveTo(0,-size*.018);ctx.lineTo(size*.018,size*.012);ctx.lineTo(0,size*.027);ctx.lineTo(-size*.018,size*.012);ctx.closePath();ctx.fill();ctx.restore();
}

function drawHud(ctx,w,h,size,game,attack,elapsed){
  ctx.textAlign="left";ctx.fillStyle="rgba(236,242,255,.72)";ctx.font=`700 ${Math.max(9,size*.022)}px system-ui`;ctx.fillText("PLAYER",size*.08,h*.22);for(let i=0;i<3;i+=1){ctx.fillStyle=i<game.hp?"#66e6ff":"rgba(255,255,255,.12)";ctx.beginPath();ctx.arc(size*.105+i*size*.052,h*.262,size*.018,0,TAU);ctx.fill();}
  const barW=Math.min(w*.38,size*.48),barX=w*.5-barW/2;ctx.fillStyle="rgba(4,4,10,.72)";ctx.fillRect(barX,h*.125,barW,size*.026);ctx.fillStyle="#ff4e70";ctx.fillRect(barX,h*.125,barW*(game.bossHp/6),size*.026);ctx.strokeStyle="rgba(255,255,255,.28)";ctx.strokeRect(barX,h*.125,barW,size*.026);ctx.textAlign="center";ctx.fillStyle="#fff0ea";ctx.font=`800 ${Math.max(9,size*.021)}px system-ui`;ctx.fillText("RIFT WARDEN",w*.5,h*.108);
  ctx.textAlign="right";ctx.fillStyle="#ffdf8b";ctx.font=`900 ${Math.max(12,size*.036)}px system-ui`;ctx.fillText(`STREAK ${game.streak}`,w-size*.08,h*.235);
  const remaining=Math.max(0,(IMPACT_AT-elapsed)/1000),phase=elapsed<IMPACT_AT?"预警":elapsed<RECOVERY_AT?"冲击":"结算";ctx.textAlign="center";ctx.fillStyle=elapsed<IMPACT_AT?"#ffd27a":"#fff";ctx.font=`900 ${Math.max(16,size*.052)}px system-ui`;ctx.fillText(`${attack.name}  ${elapsed<IMPACT_AT?remaining.toFixed(1):phase}`,w*.5,h*.205);ctx.fillStyle="rgba(234,238,251,.68)";ctx.font=`700 ${Math.max(9,size*.024)}px system-ui`;ctx.fillText(`${attack.code}  /  ${attack.hint}`,w*.5,h*.25);
}

function drawResult(ctx,w,h,size,game){
  if(!game.result)return;const age=game.outcome?0:clamp((game.resultAt?performance.now()-game.resultAt:0)/900,0,1);ctx.textAlign="center";ctx.font=`900 ${Math.max(20,size*.065)}px system-ui`;ctx.fillStyle=game.result==="dodge"?`rgba(112,255,205,${1-age*.55})`:`rgba(255,91,108,${1-age*.55})`;ctx.fillText(game.result==="dodge"?"闪避成功  ·  反击 -1":"受到伤害  ·  HP -1",w*.5,h*.48);
}

export function draw(ctx,w,h,t,intensity,state){
  const size=Math.min(w,h);const {elapsed,attack}=updateGame(state,w,h,size);const game=state.custom;const charge=clamp(elapsed/IMPACT_AT,0,1),impact=elapsed>=IMPACT_AT&&elapsed<RECOVERY_AT;const geometry=attackGeometry(attack.type,game.attackIndex,w,h,size);const player=playerPosition(state,w,h);
  drawArena(ctx,w,h,size);drawTelegraph(ctx,attack.type,geometry,size,charge,impact,t);if(elapsed<IMPACT_AT)drawSafeMarker(ctx,geometry.safe,size,.5+Math.sin(t*.007)*.5);drawBoss(ctx,geometry.boss.x,geometry.boss.y,size,charge,impact);drawPlayer(ctx,game,player,size,state.now);drawHud(ctx,w,h,size,game,attack,elapsed);drawResult(ctx,w,h,size,game);
  if(impact){const flash=clamp(1-(elapsed-IMPACT_AT)/260,0,1);ctx.fillStyle=`rgba(255,255,255,${flash*.2*intensity})`;ctx.fillRect(0,0,w,h);}
  if(game.outcome){ctx.fillStyle="rgba(4,5,10,.82)";ctx.fillRect(0,0,w,h);ctx.textAlign="center";ctx.fillStyle=game.outcome==="victory"?"#86ffd2":"#ff7186";ctx.font=`900 ${Math.max(30,size*.1)}px system-ui`;ctx.fillText(game.outcome==="victory"?"BOSS DEFEATED":"MISSION FAILED",w*.5,h*.34);ctx.fillStyle="#eef5ff";ctx.font=`700 ${Math.max(11,size*.03)}px system-ui`;ctx.fillText("点击战场重新开始",w*.5,h*.41);}
}
