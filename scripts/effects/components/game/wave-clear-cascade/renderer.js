import { clamp, hash, TAU } from "../../../shared/canvas.js";

export function draw(ctx,w,h,t,intensity,state){
  const s=Math.min(w,h),age=state.custom.clearedAt?state.now-state.custom.clearedAt:t%3600,p=clamp(age/1700,0,1),fade=1-clamp((age-1900)/700,0,1);
  ctx.fillStyle="#071715";ctx.fillRect(0,0,w,h);ctx.strokeStyle="rgba(77,210,159,.16)";ctx.lineWidth=s*.045;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-s*.1,h*.7);ctx.bezierCurveTo(w*.25,h*.4,w*.58,h*.82,w*1.1,h*.38);ctx.stroke();
  for(let i=0;i<9;i+=1){const q=clamp((p-i*.055)/.55,0,1),x=w*(.14+i*.09),y=h*(.61+Math.sin(i*1.7)*.13);ctx.globalAlpha=1-q;ctx.fillStyle="#e46d62";ctx.beginPath();ctx.arc(x,y,s*.025*(1-q*.4),0,TAU);ctx.fill();for(let j=0;j<4;j+=1){const a=hash(i*8+j)*TAU;ctx.fillStyle="#ffbd79";ctx.fillRect(x+Math.cos(a)*q*s*.09,y+Math.sin(a)*q*s*.07,2,2);}}ctx.globalAlpha=1;
  for(let i=0;i<26*intensity;i+=1){const q=clamp((p-hash(i)*.3)/.7,0,1),x=w*.5+Math.cos(hash(i+8)*TAU)*s*q*.42,y=h*.55+Math.sin(hash(i+3)*TAU)*s*q*.28;ctx.fillStyle=`rgba(255,218,102,${(1-q)*fade})`;ctx.fillRect(x,y,3,3);}
  ctx.globalAlpha=fade;ctx.fillStyle="rgba(5,20,17,.8)";ctx.fillRect(w*.18,h*.27,w*.64,h*.2);ctx.strokeStyle="#78edb7";ctx.lineWidth=2;ctx.strokeRect(w*.18,h*.27,w*.64,h*.2);ctx.fillStyle="#f0fff7";ctx.font=`900 ${Math.max(20,s*.072)}px system-ui`;ctx.textAlign="center";ctx.fillText(`WAVE ${state.custom.wave||1} CLEAR`,w*.5,h*.39);ctx.globalAlpha=1;
}
