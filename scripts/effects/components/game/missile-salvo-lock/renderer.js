import { clamp, TAU } from "../../../shared/canvas.js";

export function draw(ctx, w, h, t, intensity, state) {
  const s = Math.min(w,h); const tx = state.custom.x || w*.72; const ty = state.custom.y || h*.45; const age = state.custom.lastLaunch ? state.now-state.custom.lastLaunch : t%3200;
  ctx.fillStyle="#07101d"; ctx.fillRect(0,0,w,h); ctx.strokeStyle="rgba(78,189,221,.11)";
  for(let x=0;x<w;x+=s*.12){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();} for(let y=0;y<h;y+=s*.12){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  const spin=t*.003; ctx.save(); ctx.translate(tx,ty); ctx.rotate(spin); ctx.strokeStyle="#65e4ff"; ctx.lineWidth=2; ctx.setLineDash([s*.035,s*.025]); ctx.beginPath();ctx.arc(0,0,s*.12,0,TAU);ctx.stroke();ctx.setLineDash([]); for(let i=0;i<4;i+=1){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.moveTo(s*.14,0);ctx.lineTo(s*.2,0);ctx.stroke();}ctx.restore();
  ctx.fillStyle="#183a4c";ctx.fillRect(w*.08,h*.5,s*.16,s*.11);ctx.fillStyle="#8cecff";ctx.fillRect(w*.2,h*.525,s*.08,s*.02);
  for(let i=0;i<5;i+=1){const p=clamp((age-i*110)/900,0,1);const eased=1-(1-p)*(1-p);const sx=w*.24,sy=h*.54+(i-2)*s*.026;const cx=w*.46,cy=sy-s*(.2+i*.025);const x=(1-eased)*(1-eased)*sx+2*(1-eased)*eased*cx+eased*eased*tx;const y=(1-eased)*(1-eased)*sy+2*(1-eased)*eased*cy+eased*eased*ty;ctx.strokeStyle=`rgba(86,216,255,${.18+(.8-p)*.35})`;ctx.lineWidth=2+i%2;ctx.beginPath();ctx.moveTo(sx,sy);ctx.quadraticCurveTo(cx,cy,x,y);ctx.stroke();ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(ty-y,tx-x));ctx.fillStyle="#fff1b6";ctx.beginPath();ctx.moveTo(s*.025,0);ctx.lineTo(-s*.018,-s*.012);ctx.lineTo(-s*.018,s*.012);ctx.closePath();ctx.fill();ctx.restore();if(p>.93){ctx.strokeStyle=`rgba(255,146,70,${(1-p)*12})`;ctx.beginPath();ctx.arc(tx,ty,s*(p-.9)*1.5,0,TAU);ctx.stroke();}}
  ctx.fillStyle="rgba(184,235,245,.8)";ctx.font=`700 ${Math.max(10,s*.03)}px system-ui`;ctx.fillText("SALVO 05  /  LOCK",s*.06,s*.09);
}
