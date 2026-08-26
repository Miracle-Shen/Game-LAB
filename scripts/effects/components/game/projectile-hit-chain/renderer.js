import { clamp, TAU } from "../../../shared/canvas.js";

export function draw(ctx,w,h,t,intensity,state){
  const s=Math.min(w,h),age=state.custom.firedAt?state.now-state.custom.firedAt:t%2300,combo=state.custom.combo||4;ctx.fillStyle="#0b171d";ctx.fillRect(0,0,w,h);
  const tower={x:w*.17,y:h*.62};ctx.fillStyle="#174155";ctx.fillRect(tower.x-s*.055,tower.y-s*.12,s*.11,s*.13);ctx.fillStyle="#89edff";ctx.beginPath();ctx.arc(tower.x,tower.y-s*.13,s*.035,0,TAU);ctx.fill();
  const targets=[{x:w*.48,y:h*.4},{x:w*.67,y:h*.68},{x:w*.84,y:h*.36}];targets.forEach((q,i)=>{ctx.fillStyle="#c95b67";ctx.beginPath();ctx.arc(q.x,q.y,s*.037,0,TAU);ctx.fill();const p=clamp((age-i*170)/620,0,1),sx=i?targets[i-1].x:tower.x,sy=i?targets[i-1].y:tower.y-s*.13,cx=(sx+q.x)/2,cy=Math.min(sy,q.y)-s*.17,x=(1-p)*(1-p)*sx+2*(1-p)*p*cx+p*p*q.x,y=(1-p)*(1-p)*sy+2*(1-p)*p*cy+p*p*q.y;ctx.strokeStyle=`rgba(82,224,255,${.25+(1-p)*.5})`;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sx,sy);ctx.quadraticCurveTo(cx,cy,x,y);ctx.stroke();ctx.fillStyle="#fff2ac";ctx.beginPath();ctx.arc(x,y,s*.014,0,TAU);ctx.fill();if(p>.85){ctx.strokeStyle=`rgba(255,196,88,${(1-p)*6})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(q.x,q.y,s*(p-.82)*.45,0,TAU);ctx.stroke();ctx.fillStyle="#fff";ctx.font=`800 ${Math.max(9,s*.026)}px system-ui`;ctx.fillText(`${12+i*7}`,q.x+s*.04,q.y-s*.04);}});
  ctx.fillStyle="#ffe58c";ctx.font=`900 ${Math.max(20,s*.075)}px system-ui`;ctx.fillText(`x${combo}`,w*.07,h*.16);ctx.font=`700 ${Math.max(9,s*.026)}px system-ui`;ctx.fillStyle="rgba(211,240,244,.7)";ctx.fillText("HIT CHAIN",w*.07,h*.21);
}
