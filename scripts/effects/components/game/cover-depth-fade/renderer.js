import { clamp, TAU } from "../../../shared/canvas.js";

export function draw(ctx,w,h,t,intensity,state){
  const s=Math.min(w,h),px=state.custom.x||w*.48,py=state.custom.y||h*.6;ctx.fillStyle="#09171c";ctx.fillRect(0,0,w,h);ctx.strokeStyle="rgba(87,186,205,.1)";for(let x=0;x<w;x+=s*.11){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}for(let y=0;y<h;y+=s*.11){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  const covers=[{x:w*.18,y:h*.38,ww:w*.28,hh:h*.38},{x:w*.58,y:h*.25,ww:w*.27,hh:h*.3}];covers.forEach((r,i)=>{const inside=px>r.x&&px<r.x+r.ww&&py>r.y&&py<r.y+r.hh,alpha=inside?.28:.92;ctx.globalAlpha=alpha;ctx.fillStyle=i?"#293b46":"#273a32";ctx.fillRect(r.x,r.y,r.ww,r.hh);ctx.strokeStyle=inside?"#7aeaff":"rgba(174,206,201,.35)";ctx.lineWidth=inside?3:1;ctx.strokeRect(r.x,r.y,r.ww,r.hh);ctx.globalAlpha=1;});
  ctx.save();ctx.translate(px,py);ctx.shadowColor="#79e8ff";ctx.shadowBlur=18;ctx.fillStyle="#e8fbff";ctx.beginPath();ctx.arc(0,-s*.03,s*.025,0,TAU);ctx.fill();ctx.fillRect(-s*.016,0,s*.032,s*.07);ctx.strokeStyle="#66d9f2";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,s*.03,s*.07,0,TAU);ctx.stroke();ctx.restore();
  const covered=covers.some(r=>px>r.x&&px<r.x+r.ww&&py>r.y&&py<r.y+r.hh);ctx.fillStyle=covered?"#78e8ff":"rgba(204,230,231,.7)";ctx.font=`800 ${Math.max(10,s*.03)}px system-ui`;ctx.fillText(covered?"COVER FADED / PLAYER VISIBLE":"MOVE INTO COVER",s*.06,s*.09);
}
