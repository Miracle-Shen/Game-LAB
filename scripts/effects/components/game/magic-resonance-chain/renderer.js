import { clamp, TAU } from "../../../shared/canvas.js";

export function draw(ctx,w,h,t,intensity,state){
  const s=Math.min(w,h),combo=state.custom.combo||3,age=state.custom.lastCast?state.now-state.custom.lastCast:t%2500,p=clamp(age/700,0,1);
  const bg=ctx.createRadialGradient(w*.5,h*.45,0,w*.5,h*.5,w*.7);bg.addColorStop(0,"#33235c");bg.addColorStop(1,"#0c0917");ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  const points=[];for(let i=0;i<combo;i+=1){const a=t*.0006+i/combo*TAU;points.push({x:w*.5+Math.cos(a)*s*.27,y:h*.5+Math.sin(a)*s*.16});}
  ctx.save();ctx.globalCompositeOperation="lighter";ctx.strokeStyle="rgba(200,157,255,.45)";ctx.lineWidth=2;ctx.beginPath();points.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));if(points.length>2)ctx.closePath();ctx.stroke();
  points.forEach((q,i)=>{ctx.save();ctx.translate(q.x,q.y);ctx.rotate(t*.001+i);ctx.fillStyle="rgba(23,14,45,.9)";ctx.strokeStyle=i===combo-1?"#ffe78c":"#c79cff";ctx.lineWidth=2;ctx.fillRect(-s*.055,-s*.075,s*.11,s*.15);ctx.strokeRect(-s*.055,-s*.075,s*.11,s*.15);ctx.beginPath();ctx.arc(0,0,s*.023,0,TAU);ctx.stroke();ctx.restore();});
  ctx.strokeStyle=`rgba(255,231,137,${1-p})`;ctx.lineWidth=s*.012;ctx.beginPath();ctx.arc(w*.5,h*.5,s*(.05+p*.25),0,TAU);ctx.stroke();ctx.restore();
  ctx.fillStyle="#f6eaff";ctx.font=`800 ${Math.max(24,s*.09)}px system-ui`;ctx.textAlign="center";ctx.fillText(`x${combo}`,w*.5,h*.53);ctx.font=`700 ${Math.max(9,s*.026)}px system-ui`;ctx.fillStyle="rgba(226,205,255,.72)";ctx.fillText("RESONANCE CHAIN",w*.5,h*.61);
}
