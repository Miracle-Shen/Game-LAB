import { clamp, hash, TAU } from "../../../shared/canvas.js";

export function draw(ctx,w,h,t,intensity,state){
  const s=Math.min(w,h),cx=w*.5,cy=h*.58,age=state.custom.lastCast?state.now-state.custom.lastCast:t%2600,p=clamp(age/1200,0,1),fade=1-p;
  ctx.fillStyle="#120f1d";ctx.fillRect(0,0,w,h);ctx.fillStyle="rgba(86,64,112,.22)";ctx.beginPath();ctx.ellipse(cx,cy+s*.16,s*.34,s*.08,0,0,TAU);ctx.fill();
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-.45+Math.sin(t*.018)*.025*fade);ctx.fillStyle="#5b3a29";ctx.fillRect(-s*.018,-s*.19,s*.036,s*.38);ctx.fillStyle="#bd8aff";ctx.beginPath();ctx.arc(0,-s*.2,s*.035,0,TAU);ctx.fill();ctx.restore();
  ctx.save();ctx.globalCompositeOperation="lighter";for(let i=0;i<18*intensity;i+=1){const a=hash(i*3.2)*TAU,d=s*(.03+p*(.08+hash(i+3)*.2));const r=s*(.02+hash(i+7)*.045)*(1-p*.5);ctx.fillStyle=`rgba(${110+hash(i)*70},${86+hash(i+1)*40},${140+hash(i+2)*60},${fade*.38})`;ctx.beginPath();ctx.arc(cx+Math.cos(a)*d,cy-s*.12+Math.sin(a)*d-p*s*.1,r,0,TAU);ctx.fill();}
  ctx.strokeStyle=`rgba(221,146,255,${fade})`;ctx.lineWidth=2;for(let i=0;i<7;i+=1){const a=i/7*TAU;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*s*.04,cy-s*.18+Math.sin(a)*s*.04);ctx.lineTo(cx+Math.cos(a+.25)*s*(.09+p*.12),cy-s*.18+Math.sin(a+.25)*s*(.09+p*.12));ctx.stroke();}ctx.restore();
  ctx.fillStyle="rgba(230,215,241,.75)";ctx.font=`800 ${Math.max(11,s*.04)}px system-ui`;ctx.textAlign="center";ctx.fillText("SPELL FIZZLED",cx,h*.17);
}
