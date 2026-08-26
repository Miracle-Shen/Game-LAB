import { clamp, hash, TAU } from "../../../shared/canvas.js";

function marker(ctx,x,y,age,s){const fresh=1-clamp(age/900,0,1);ctx.save();ctx.translate(x,y);ctx.strokeStyle=`rgba(255,89,103,${.36+fresh*.6})`;ctx.lineWidth=2+fresh*4;ctx.beginPath();ctx.arc(0,0,s*(.035+fresh*.08),0,TAU);ctx.stroke();ctx.rotate(.35);ctx.fillStyle=`rgba(190,49,72,${.24+fresh*.32})`;ctx.fillRect(-s*.05,-s*.012,s*.1,s*.024);ctx.rotate(Math.PI/2);ctx.fillRect(-s*.05,-s*.012,s*.1,s*.024);for(let i=0;i<5;i+=1){const a=hash(i+x)*TAU;ctx.fillStyle=`rgba(255,108,119,${fresh})`;ctx.fillRect(Math.cos(a)*s*.08,Math.sin(a)*s*.035,3,3);}ctx.restore();}
export function draw(ctx,w,h,t,intensity,state){
  const s=Math.min(w,h);ctx.fillStyle="#101b1b";ctx.fillRect(0,0,w,h);ctx.fillStyle="#19312a";ctx.fillRect(0,h*.22,w,h*.78);ctx.strokeStyle="rgba(210,231,219,.11)";ctx.lineWidth=2;for(let y=h*.28;y<h;y+=s*.11){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  const defaults=[{x:w*.3,y:h*.54,time:state.now-6200},{x:w*.68,y:h*.7,time:state.now-3100}];const marks=[...defaults,...state.custom.markers];marks.forEach(m=>marker(ctx,m.x,m.y,state.now-m.time,s));
  ctx.fillStyle="rgba(237,244,238,.76)";ctx.font=`700 ${Math.max(10,s*.029)}px system-ui`;ctx.fillText(`FIELD MARKERS  ${marks.length}`,s*.06,s*.09);ctx.fillStyle="rgba(255,103,117,.7)";ctx.fillText("PERSISTENT THIS ROUND",s*.06,s*.14);
}
