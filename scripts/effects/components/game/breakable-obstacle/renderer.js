import { clamp, hash, TAU } from "../../../shared/canvas.js";

const obstacleUrls = [
  new URL("./assets/obstacle_box.png", import.meta.url).href,
  new URL("./assets/obstacle_shoe.png", import.meta.url).href,
];
const obstacleImages = [];

function getObstacleImage(index) {
  if (typeof Image === "undefined") return null;
  if (!obstacleImages[index]) {
    const image = new Image();
    image.src = obstacleUrls[index];
    obstacleImages[index] = image;
  }
  return obstacleImages[index];
}

export function draw(ctx,w,h,t,intensity,state){
  const s=Math.min(w,h),cx=w*.5,cy=h*.57,d=state.custom.durability,age=state.custom.lastHit?state.now-state.custom.lastHit:t%2800,p=clamp(age/700,0,1),fade=1-p;
  ctx.fillStyle="#0d1d19";ctx.fillRect(0,0,w,h);ctx.strokeStyle="rgba(96,203,161,.11)";for(let x=0;x<w;x+=s*.13){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}for(let y=0;y<h;y+=s*.13){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  const image=getObstacleImage(state.custom.variant||0),objectSize=s*.42,hitShake=d>0?Math.sin(age*.09)*fade*s*.012:0;
  ctx.fillStyle="rgba(53,125,91,.35)";ctx.strokeStyle=d>0?"rgba(185,229,195,.34)":"#58d699";ctx.lineWidth=2;ctx.fillRect(cx-s*.2,cy+s*.1,s*.4,s*.08);ctx.strokeRect(cx-s*.2,cy+s*.1,s*.4,s*.08);
  if(d>0&&image?.complete&&image.naturalWidth){ctx.save();ctx.translate(cx+hitShake,cy);ctx.globalAlpha=.58+d*.14;ctx.shadowColor="rgba(0,0,0,.55)";ctx.shadowBlur=s*.045;ctx.drawImage(image,-objectSize/2,-objectSize*.62,objectSize,objectSize);ctx.restore();}
  else if(d>0){ctx.fillStyle="#6f5842";ctx.strokeStyle="#b99562";ctx.lineWidth=3;ctx.fillRect(cx-s*.16,cy-s*.15,s*.32,s*.3);ctx.strokeRect(cx-s*.16,cy-s*.15,s*.32,s*.3);}
  if(d>0){ctx.strokeStyle="#30251e";ctx.lineWidth=2;for(let i=0;i<3-d+1;i+=1){ctx.beginPath();ctx.moveTo(cx,cy-s*.12);ctx.lineTo(cx+(i-1)*s*.07,cy-s*.015);ctx.lineTo(cx+(i-.5)*s*.09,cy+s*.12);ctx.stroke();}}
  for(let i=0;i<18*intensity;i+=1){const a=hash(i*4.1)*TAU,dist=s*p*(.05+hash(i+2)*.25);ctx.save();ctx.translate(cx+Math.cos(a)*dist,cy+Math.sin(a)*dist);ctx.rotate(a+t*.002);ctx.fillStyle=`rgba(188,143,88,${fade})`;ctx.fillRect(-s*.014,-s*.009,s*.028,s*.018);ctx.restore();}
  ctx.fillStyle="#eff8f1";ctx.font=`800 ${Math.max(12,s*.04)}px system-ui`;ctx.textAlign="center";ctx.fillText(d>0?`DURABILITY  ${d} / 3`:"PATH UNLOCKED",cx,h*.19);ctx.font=`700 ${Math.max(9,s*.023)}px system-ui`;ctx.fillStyle="rgba(196,231,216,.65)";ctx.fillText((state.custom.variant||0)?"SHOE PILE / ORIGINAL ASSET":"CARDBOARD BOX / ORIGINAL ASSET",cx,h*.24);
}
