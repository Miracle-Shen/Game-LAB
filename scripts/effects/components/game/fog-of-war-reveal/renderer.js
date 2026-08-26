import { clamp, hash, TAU } from "../../../shared/canvas.js";

// Adapted from GameCraft-Bench's Apache-2.0 Open-World Cartographer task.
const GRID_WIDTH = 14;
const GRID_HEIGHT = 9;
const TOWN = { x: 10, y: 4 };

const TERRAIN = {
  g: { id: "grass", label: "草地", food: 1 },
  f: { id: "forest", label: "森林", food: 1 },
  m: { id: "mountain", label: "山地", food: 1, rope: 1 },
  r: { id: "river", label: "河流", food: 1 },
  s: { id: "swamp", label: "沼泽", food: 2 },
  u: { id: "ruin", label: "遗迹", food: 1, landmark: "古代遗迹" },
  p: { id: "predator", label: "兽域", food: 1, danger: 1, landmark: "猛兽领地" },
  c: { id: "cave", label: "洞穴", food: 1, landmark: "洞穴入口" },
  t: { id: "town", label: "营地", food: 0 },
};

const WORLD = [
  "ffggmmggffrrgg",
  "fgggmmggfrrugg",
  "gggffmgggruggg",
  "grrffggggrgggg",
  "ggrggssssgtfgg",
  "ggggsspsggffgg",
  "ggmggssggggmgg",
  "ggggggrrgggggg",
  "ggggggrrggcggg",
].map((row) => [...row]);

const EXTRA_LANDMARKS = new Map([
  ["11,3", "山顶哨塔"],
  ["9,4", "巨树"],
  ["10,5", "古林神木"],
]);

const cellKey = (x, y) => `${x},${y}`;
const terrainAt = (x, y) => TERRAIN[WORLD[y]?.[x]] || TERRAIN.g;
const landmarkAt = (x, y) => EXTRA_LANDMARKS.get(cellKey(x, y)) || terrainAt(x, y).landmark || "";

function mapLayout(width, height) {
  const availableWidth = width * 0.74;
  const availableHeight = height * 0.58;
  const cell = Math.max(18, Math.min(availableWidth / GRID_WIDTH, availableHeight / GRID_HEIGHT));
  const mapWidth = cell * GRID_WIDTH;
  const mapHeight = cell * GRID_HEIGHT;
  return { x: (width - mapWidth) / 2, y: height * 0.27, cell, width: mapWidth, height: mapHeight };
}

function pointToCell(point, width, height) {
  const layout = mapLayout(width, height);
  const x = Math.floor((point.x - layout.x) / layout.cell);
  const y = Math.floor((point.y - layout.y) / layout.cell);
  if (x < 0 || y < 0 || x >= GRID_WIDTH || y >= GRID_HEIGHT) return null;
  return { x, y };
}

function revealAround(revealed, center, radius) {
  const cells = new Set(revealed);
  for (let y = center.y - radius; y <= center.y + radius; y += 1) {
    for (let x = center.x - radius; x <= center.x + radius; x += 1) {
      if (x >= 0 && y >= 0 && x < GRID_WIDTH && y < GRID_HEIGHT && Math.hypot(x - center.x, y - center.y) <= radius + 0.45) cells.add(cellKey(x, y));
    }
  }
  return [...cells];
}

function buildPath(from, to) {
  const path = [];
  let x = from.x;
  let y = from.y;
  while (x !== to.x || y !== to.y) {
    const dx = to.x - x;
    const dy = to.y - y;
    if (Math.abs(dx) >= Math.abs(dy) && dx) x += Math.sign(dx);
    else if (dy) y += Math.sign(dy);
    else x += Math.sign(dx);
    path.push({ x, y });
  }
  return path;
}

export function createCartographerState() {
  return {
    player: { ...TOWN }, path: [], revealed: revealAround([], TOWN, 1), discovered: [], annotated: [], clearedHazards: [],
    food: 14, maxFood: 14, ink: 4, rope: 3, hearts: 3, credits: 0, tripSteps: 0,
    soldRevealCount: 0, soldAnnotationCount: 0, expeditions: 0,
    upgrades: { boots: false, compass: false, pack: false },
    lastMoveAt: 0, lastRevealAt: 0, lastActionAt: 0, status: "选择地图位置开始勘测", outcome: "",
  };
}

function resetCartographerState(game) {
  Object.assign(game, createCartographerState());
}

export function chooseDestination(point, state, now, width, height) {
  const game = state.custom;
  if (game.outcome) {
    resetCartographerState(game);
    game.lastActionAt = now;
    return;
  }
  const cell = pointToCell(point, width, height);
  if (!cell) return;
  const key = cellKey(cell.x, cell.y);
  if (cell.x === game.player.x && cell.y === game.player.y && landmarkAt(cell.x, cell.y)) {
    if (game.annotated.includes(key)) game.status = "该地标已经完成注记";
    else if (game.ink <= 0) game.status = "墨水不足，返回营地补给";
    else {
      game.annotated.push(key);
      game.ink -= 1;
      game.status = `已注记：${landmarkAt(cell.x, cell.y)}  +5 价值`;
      game.lastActionAt = now;
    }
    return;
  }
  game.path = buildPath(game.player, cell);
  game.lastMoveAt = now - 300;
  game.status = `路线已规划：${game.path.length} 格`;
}

const COLORS = { grass: "#78965d", forest: "#315f46", mountain: "#766d66", river: "#3f7896", swamp: "#506d58", ruin: "#8a7358", predator: "#724f50", cave: "#5b5962", town: "#b58b59" };

function unlockUpgrade(game) {
  if (game.expeditions === 1 && !game.upgrades.boots) { game.upgrades.boots = true; game.status = "售图完成：获得轻便靴，移动速度提升"; }
  else if (game.expeditions === 2 && !game.upgrades.compass) { game.upgrades.compass = true; game.status = "售图完成：获得罗盘，揭示范围提升"; }
  else if (game.expeditions === 3 && !game.upgrades.pack) { game.upgrades.pack = true; game.maxFood += 4; game.status = "售图完成：获得坚固背包，食物上限提升"; }
}

function settleAtTown(game, now) {
  const newCells = Math.max(0, game.revealed.length - game.soldRevealCount);
  const newNotes = Math.max(0, game.annotated.length - game.soldAnnotationCount);
  const value = newCells * 2 + newNotes * 5;
  game.credits += value; game.soldRevealCount = game.revealed.length; game.soldAnnotationCount = game.annotated.length;
  game.expeditions += 1; game.tripSteps = 0; game.food = game.maxFood; game.ink = game.upgrades.pack ? 6 : 4; game.rope = game.upgrades.pack ? 4 : 3; game.lastActionAt = now;
  game.status = `地图售出 +${value} 金币，补给已装满`; unlockUpgrade(game);
  if (game.annotated.length >= 4) game.outcome = "victory";
}

function advanceJourney(game, now) {
  if (game.outcome || !game.path.length) return;
  if (now - game.lastMoveAt < (game.upgrades.boots ? 135 : 220)) return;
  const next = game.path[0]; const terrain = terrainAt(next.x, next.y);
  if (terrain.rope && game.rope < terrain.rope) { game.path = []; game.status = "山地需要绳索，先规划其他路线"; game.lastActionAt = now; return; }
  game.path.shift(); game.lastMoveAt = now; game.player = next; game.tripSteps += 1; game.food -= terrain.food;
  if (terrain.rope) game.rope -= terrain.rope;
  const key = cellKey(next.x, next.y);
  if (terrain.danger && !game.clearedHazards.includes(key)) { game.clearedHazards.push(key); game.hearts -= terrain.danger; game.status = "遭遇猛兽：生命 -1"; game.lastActionAt = now; }
  const before = game.revealed.length; game.revealed = revealAround(game.revealed, next, game.upgrades.compass ? 2 : 1);
  if (game.revealed.length > before) game.lastRevealAt = now;
  const landmark = landmarkAt(next.x, next.y);
  if (landmark && !game.discovered.includes(key)) { game.discovered.push(key); game.status = `发现 ${landmark}：再次点击当前位置进行注记`; game.lastActionAt = now; game.path = []; }
  if (next.x === TOWN.x && next.y === TOWN.y && game.tripSteps > 1) settleAtTown(game, now);
  else if (game.food <= 0 || game.hearts <= 0) { game.path = []; game.outcome = "lost"; game.status = game.hearts <= 0 ? "伤势过重，勘测失败" : "食物耗尽，勘测失败"; game.lastActionAt = now; }
}

const cellCenter = (layout, x, y) => ({ x: layout.x + (x + 0.5) * layout.cell, y: layout.y + (y + 0.5) * layout.cell });

function drawTerrainIcon(ctx, terrain, cx, cy, cell) {
  const unit = cell * 0.22;
  ctx.save(); ctx.translate(cx, cy); ctx.lineWidth = Math.max(1, cell * 0.045); ctx.lineCap = "round"; ctx.lineJoin = "round";
  if (terrain.id === "forest") { ctx.fillStyle = "rgba(19,62,40,.85)"; ctx.beginPath();ctx.moveTo(0,-unit*1.4);ctx.lineTo(unit,unit);ctx.lineTo(-unit,unit);ctx.closePath();ctx.fill();ctx.fillRect(-unit*.12,unit*.65,unit*.24,unit*.75); }
  else if (terrain.id === "mountain") { ctx.fillStyle = "rgba(63,57,55,.78)";ctx.beginPath();ctx.moveTo(-unit*1.35,unit);ctx.lineTo(0,-unit*1.35);ctx.lineTo(unit*1.35,unit);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(241,235,216,.68)";ctx.beginPath();ctx.moveTo(-unit*.38,-unit*.68);ctx.lineTo(0,-unit*1.35);ctx.lineTo(unit*.42,-unit*.62);ctx.stroke(); }
  else if (terrain.id === "river") { ctx.strokeStyle="rgba(206,239,255,.75)";for(let i=-1;i<=1;i+=1){ctx.beginPath();ctx.arc(i*unit*.9,0,unit*.75,0,Math.PI);ctx.stroke();} }
  else if (terrain.id === "swamp") { ctx.strokeStyle="rgba(196,221,174,.55)";ctx.beginPath();ctx.ellipse(0,unit*.3,unit*1.3,unit*.62,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(-unit*.8,-unit);ctx.lineTo(-unit*.65,unit*.15);ctx.moveTo(0,-unit*.8);ctx.lineTo(unit*.08,unit*.2);ctx.stroke(); }
  else if (terrain.id === "ruin") { ctx.strokeStyle="#ead195";ctx.strokeRect(-unit,-unit*.8,unit*2,unit*1.6);ctx.beginPath();ctx.moveTo(-unit*1.25,-unit*.8);ctx.lineTo(0,-unit*1.45);ctx.lineTo(unit*1.25,-unit*.8);ctx.stroke(); }
  else if (terrain.id === "predator") { ctx.fillStyle="#f2b1a3";ctx.beginPath();ctx.arc(0,unit*.3,unit*.65,0,TAU);ctx.fill();for(let i=-1;i<=1;i+=1){ctx.beginPath();ctx.arc(i*unit*.7,-unit*.65+Math.abs(i)*unit*.15,unit*.28,0,TAU);ctx.fill();} }
  else if (terrain.id === "cave") { ctx.fillStyle="#282632";ctx.beginPath();ctx.arc(0,unit*.2,unit*1.15,Math.PI,TAU);ctx.lineTo(unit*1.15,unit);ctx.lineTo(-unit*1.15,unit);ctx.closePath();ctx.fill();ctx.strokeStyle="#d0c6a5";ctx.stroke(); }
  else if (terrain.id === "town") { ctx.fillStyle="#694330";ctx.fillRect(-unit,-unit*.55,unit*2,unit*1.45);ctx.fillStyle="#d66d4e";ctx.beginPath();ctx.moveTo(-unit*1.3,-unit*.55);ctx.lineTo(0,-unit*1.5);ctx.lineTo(unit*1.3,-unit*.55);ctx.closePath();ctx.fill(); }
  else { ctx.fillStyle="rgba(240,224,154,.42)";ctx.beginPath();ctx.arc(-unit*.45,0,unit*.12,0,TAU);ctx.arc(unit*.35,-unit*.35,unit*.1,0,TAU);ctx.fill(); }
  ctx.restore();
}

function drawMap(ctx, w, h, t, game, now) {
  const layout = mapLayout(w, h); const revealed = new Set(game.revealed); const annotated = new Set(game.annotated);
  ctx.save();ctx.shadowColor="rgba(0,0,0,.5)";ctx.shadowBlur=24;ctx.fillStyle="#b7a47e";ctx.fillRect(layout.x-10,layout.y-10,layout.width+20,layout.height+20);ctx.shadowBlur=0;
  for(let y=0;y<GRID_HEIGHT;y+=1){for(let x=0;x<GRID_WIDTH;x+=1){const key=cellKey(x,y),rx=layout.x+x*layout.cell,ry=layout.y+y*layout.cell,known=revealed.has(key),terrain=terrainAt(x,y);ctx.fillStyle=known?COLORS[terrain.id]:"#11151a";ctx.fillRect(rx,ry,layout.cell+1,layout.cell+1);ctx.strokeStyle=known?"rgba(239,224,181,.17)":"rgba(104,119,124,.12)";ctx.strokeRect(rx+.5,ry+.5,layout.cell-1,layout.cell-1);if(known)drawTerrainIcon(ctx,terrain,rx+layout.cell/2,ry+layout.cell/2,layout.cell);else{const noise=hash(x*19+y*37);ctx.fillStyle=`rgba(145,157,157,${.035+noise*.055})`;ctx.fillRect(rx+layout.cell*.18,ry+layout.cell*.2,layout.cell*.12,layout.cell*.12);}if(known&&landmarkAt(x,y)){ctx.strokeStyle=annotated.has(key)?"#ffe27c":"rgba(255,231,149,.72)";ctx.lineWidth=annotated.has(key)?3:1.5;ctx.beginPath();ctx.arc(rx+layout.cell/2,ry+layout.cell/2,layout.cell*.36,0,TAU);ctx.stroke();if(annotated.has(key)){ctx.fillStyle="#ffe27c";ctx.fillRect(rx+layout.cell*.74,ry+layout.cell*.12,layout.cell*.12,layout.cell*.12);}}}}
  if(game.path.length){ctx.strokeStyle="rgba(255,236,160,.72)";ctx.lineWidth=Math.max(2,layout.cell*.07);ctx.setLineDash([layout.cell*.14,layout.cell*.12]);ctx.beginPath();let start=cellCenter(layout,game.player.x,game.player.y);ctx.moveTo(start.x,start.y);game.path.forEach(cell=>{const point=cellCenter(layout,cell.x,cell.y);ctx.lineTo(point.x,point.y);});ctx.stroke();ctx.setLineDash([]);}
  const player=cellCenter(layout,game.player.x,game.player.y),pulse=.5+Math.sin(t*.008)*.5;ctx.shadowColor="#fff1b2";ctx.shadowBlur=12;ctx.fillStyle="#fff0b8";ctx.beginPath();ctx.moveTo(player.x,player.y-layout.cell*.34);ctx.lineTo(player.x+layout.cell*.24,player.y+layout.cell*.26);ctx.lineTo(player.x,player.y+layout.cell*.12);ctx.lineTo(player.x-layout.cell*.24,player.y+layout.cell*.26);ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=`rgba(104,235,213,${.55+pulse*.4})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(player.x,player.y,layout.cell*(.42+pulse*.08),0,TAU);ctx.stroke();
  if(game.lastRevealAt&&now-game.lastRevealAt<700){const p=clamp((now-game.lastRevealAt)/700,0,1);ctx.strokeStyle=`rgba(255,237,160,${1-p})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(player.x,player.y,layout.cell*(.5+p*1.8),0,TAU);ctx.stroke();}
  ctx.restore();
}

function drawHud(ctx,w,h,size,game){
  const explored=Math.round(game.revealed.length/(GRID_WIDTH*GRID_HEIGHT)*100);ctx.textAlign="center";ctx.fillStyle="#f6e6bd";ctx.font=`900 ${Math.max(14,size*.038)}px system-ui`;ctx.fillText(`地图完成度 ${explored}%`,w*.5,h*.095);ctx.fillStyle="rgba(9,12,12,.72)";ctx.fillRect(w*.38,h*.112,w*.24,size*.022);ctx.fillStyle="#79d4a3";ctx.fillRect(w*.38,h*.112,w*.24*explored/100,size*.022);
  ctx.textAlign="left";ctx.fillStyle="rgba(239,227,199,.68)";ctx.font=`700 ${Math.max(9,size*.021)}px system-ui`;ctx.fillText("远征补给",size*.08,h*.19);ctx.font=`800 ${Math.max(10,size*.027)}px system-ui`;ctx.fillStyle="#f0bf70";ctx.fillText(`食物 ${game.food}/${game.maxFood}`,size*.08,h*.235);ctx.fillStyle="#7ebde0";ctx.fillText(`墨水 ${game.ink}`,size*.08,h*.275);ctx.fillStyle="#be9b6b";ctx.fillText(`绳索 ${game.rope}`,size*.08,h*.315);ctx.fillStyle="#e98078";ctx.fillText(`生命 ${"●".repeat(game.hearts)}${"○".repeat(3-game.hearts)}`,size*.08,h*.355);
  ctx.textAlign="right";ctx.fillStyle="#f4d678";ctx.font=`900 ${Math.max(12,size*.034)}px system-ui`;ctx.fillText(`${game.credits} 金币`,w-size*.08,h*.22);ctx.fillStyle="rgba(238,229,204,.72)";ctx.font=`700 ${Math.max(9,size*.022)}px system-ui`;ctx.fillText(`地标 ${game.annotated.length}/4`,w-size*.08,h*.26);ctx.fillText(`远征 ${game.expeditions}`,w-size*.08,h*.3);const upgrades=[game.upgrades.boots&&"轻便靴",game.upgrades.compass&&"罗盘",game.upgrades.pack&&"背包"].filter(Boolean);ctx.fillStyle="#88dbc1";ctx.fillText(upgrades.length?upgrades.join(" · "):"首张地图可解锁装备",w-size*.08,h*.34);
  ctx.textAlign="center";ctx.fillStyle="rgba(8,11,12,.76)";ctx.fillRect(w*.28,h*.175,w*.44,size*.055);ctx.fillStyle="#ecdfbc";ctx.font=`700 ${Math.max(9,size*.022)}px system-ui`;ctx.fillText(game.status,w*.5,h*.21);
}

function drawLegend(ctx,w,h,size){
  const items=[["#315f46","森林"],["#766d66","山地"],["#3f7896","河流"],["#506d58","沼泽"],["#8a7358","地标"]];const start=w*.34,gap=w*.075;ctx.font=`700 ${Math.max(8,size*.017)}px system-ui`;ctx.textAlign="left";items.forEach(([color,label],i)=>{const x=start+i*gap;ctx.fillStyle=color;ctx.fillRect(x,h*.86,size*.015,size*.015);ctx.fillStyle="rgba(232,224,202,.58)";ctx.fillText(label,x+size*.022,h*.875);});
}

export function draw(ctx,w,h,t,intensity,state){
  const game=state.custom;advanceJourney(game,state.now);const size=Math.min(w,h);const bg=ctx.createRadialGradient(w*.5,h*.5,0,w*.5,h*.5,w*.75);bg.addColorStop(0,"#283128");bg.addColorStop(1,"#0a1010");ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);ctx.strokeStyle="rgba(223,207,161,.055)";for(let i=0;i<18;i+=1){const y=hash(i*3.7)*h;ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(w*.3,y+20,w*.7,y-25,w,y+8);ctx.stroke();}
  drawMap(ctx,w,h,t,game,state.now);drawHud(ctx,w,h,size,game);drawLegend(ctx,w,h,size);
  if(game.outcome){ctx.fillStyle="rgba(6,9,9,.84)";ctx.fillRect(0,0,w,h);ctx.textAlign="center";ctx.fillStyle=game.outcome==="victory"?"#9af0b7":"#e77a72";ctx.font=`900 ${Math.max(28,size*.09)}px system-ui`;ctx.fillText(game.outcome==="victory"?"地图集完成":"远征失败",w*.5,h*.34);ctx.fillStyle="#f1e6cc";ctx.font=`700 ${Math.max(11,size*.028)}px system-ui`;ctx.fillText(game.outcome==="victory"?`已注记 ${game.annotated.length} 个地标，累计 ${game.credits} 金币`:game.status,w*.5,h*.41);ctx.fillText("点击地图重新开始",w*.5,h*.47);}
}
