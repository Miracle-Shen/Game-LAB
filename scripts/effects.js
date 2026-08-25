import { effectComponents } from "./effects/components/index.js";
import { effectComponentRegistry } from "./effects/component-registry.js";

const TAU = Math.PI * 2;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const fract = (value) => value - Math.floor(value);
const hash = (value) => fract(Math.sin(value * 127.1) * 43758.5453);

function drawGrid(ctx, width, height, alpha = 0.08) {
  ctx.save();
  ctx.strokeStyle = `rgba(240,240,250,${alpha})`;
  ctx.lineWidth = 1;
  const step = Math.max(32, Math.min(width, height) / 8);
  for (let x = step / 2; x < width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = step / 2; y < height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawDissolve(ctx, w, h, t, intensity) {
  const cx = w * 0.5;
  const cy = h * 0.48;
  const r = Math.min(w, h) * 0.2;
  const phase = (t * 0.12) % 1;
  ctx.fillStyle = "#030709";
  ctx.fillRect(0, 0, w, h);
  drawGrid(ctx, w, h, 0.05);

  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.6);
  glow.addColorStop(0, `rgba(62, 255, 188, ${0.17 * intensity})`);
  glow.addColorStop(0.5, "rgba(31, 108, 93, 0.07)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(t * 0.00012);
  ctx.lineWidth = Math.max(2, r * 0.025);
  for (let ring = 0; ring < 4; ring++) {
    const rr = r * (0.65 + ring * 0.22);
    ctx.strokeStyle = `rgba(${95 + ring * 25}, 255, 202, ${0.82 - ring * 0.13})`;
    ctx.setLineDash([rr * 0.18, rr * 0.09]);
    ctx.lineDashOffset = -t * (0.012 + ring * 0.004);
    ctx.beginPath();
    ctx.arc(0, 0, rr, phase * TAU + ring, phase * TAU + Math.PI * 1.55 + ring);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.rotate(-t * 0.00022);
  ctx.fillStyle = "rgba(8, 18, 18, 0.86)";
  ctx.strokeStyle = "rgba(171, 255, 227, 0.6)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI / 2 + (i / 6) * TAU;
    const x = Math.cos(a) * r * 0.62;
    const y = Math.sin(a) * r * 0.62;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  for (let i = 0; i < Math.floor(70 * intensity); i++) {
    const seed = hash(i * 9.7);
    const a = seed * TAU + t * 0.0002 * (i % 2 ? 1 : -1);
    const life = fract(seed + t * 0.00018);
    const rr = r * (0.85 + life * 1.5);
    ctx.fillStyle = `rgba(105,255,206,${(1 - life) * 0.75})`;
    ctx.fillRect(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 1.5 + seed * 2, 1.5 + seed * 2);
  }
}

function drawBurst(ctx, w, h, t, intensity) {
  ctx.fillStyle = "#06080b";
  ctx.fillRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2;
  const cycle = (t * 0.00036) % 1;
  const burst = Math.sin(Math.min(cycle * 1.4, 1) * Math.PI);
  const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.5);
  halo.addColorStop(0, `rgba(255,245,211,${0.95 * burst})`);
  halo.addColorStop(0.08, `rgba(255,164,45,${0.82 * burst})`);
  halo.addColorStop(0.32, `rgba(229,57,27,${0.22 * burst})`);
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, w, h);

  const count = Math.floor(90 * intensity);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.lineCap = "round";
  for (let i = 0; i < count; i++) {
    const a = hash(i * 4.31) * TAU;
    const speed = 0.45 + hash(i * 7.11) * 1.2;
    const distance = Math.pow(cycle, 0.68) * Math.min(w, h) * speed;
    const len = (18 + hash(i * 11.2) * 58) * (1 - cycle);
    ctx.strokeStyle = i % 4 === 0
      ? `rgba(255,246,194,${1 - cycle})`
      : `rgba(255,92,35,${0.85 * (1 - cycle)})`;
    ctx.lineWidth = 0.8 + hash(i) * 2.2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * Math.max(0, distance - len), Math.sin(a) * Math.max(0, distance - len));
    ctx.lineTo(Math.cos(a) * distance, Math.sin(a) * distance);
    ctx.stroke();
  }
  ctx.strokeStyle = `rgba(255,174,61,${(1 - cycle) * 0.7})`;
  ctx.lineWidth = Math.max(1, 5 * (1 - cycle));
  ctx.beginPath();
  ctx.arc(0, 0, cycle * Math.min(w, h) * 0.46, 0, TAU);
  ctx.stroke();
  ctx.restore();
}

function drawLaser(ctx, w, h, t, intensity) {
  ctx.fillStyle = "#030408";
  ctx.fillRect(0, 0, w, h);
  drawGrid(ctx, w, h, 0.045);
  const y = h * 0.5;
  const phase = (t * 0.00022) % 1;
  const charge = clamp(phase / 0.4, 0, 1);
  const fire = phase > 0.4 && phase < 0.82 ? Math.sin(((phase - 0.4) / 0.42) * Math.PI) : 0;
  const sourceX = w * 0.16;
  const glow = ctx.createRadialGradient(sourceX, y, 0, sourceX, y, h * 0.38);
  glow.addColorStop(0, `rgba(114,163,255,${0.5 * Math.max(charge, fire)})`);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < Math.floor(34 * intensity); i++) {
    const a = hash(i * 8.2) * TAU + t * 0.001;
    const rr = (1 - charge) * h * 0.25 + hash(i) * h * 0.2;
    const px = sourceX + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    ctx.fillStyle = `rgba(128,196,255,${charge * 0.85})`;
    ctx.fillRect(px, py, 2, 2);
  }
  if (fire > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = `rgba(62,116,255,${0.26 * fire})`;
    ctx.lineWidth = 30 * fire * intensity;
    ctx.beginPath();
    ctx.moveTo(sourceX, y);
    ctx.lineTo(w * 1.05, y + Math.sin(t * 0.03) * 2);
    ctx.stroke();
    ctx.strokeStyle = `rgba(159,219,255,${0.8 * fire})`;
    ctx.lineWidth = 8 * fire * intensity;
    ctx.stroke();
    ctx.strokeStyle = `rgba(255,255,255,${fire})`;
    ctx.lineWidth = 2.5 * fire;
    ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = "#d9efff";
  ctx.beginPath();
  ctx.arc(sourceX, y, 5 + charge * 14, 0, TAU);
  ctx.fill();
}

function drawTrail(ctx, w, h, t, intensity) {
  ctx.fillStyle = "#07060b";
  ctx.fillRect(0, 0, w, h);
  const count = Math.floor(14 * intensity);
  for (let i = count; i >= 0; i--) {
    const delay = i * 55;
    const p = (t - delay) * 0.001;
    const x = w * 0.5 + Math.sin(p * 1.7) * w * 0.28;
    const y = h * 0.5 + Math.sin(p * 3.4) * h * 0.12;
    const alpha = i === 0 ? 1 : (1 - i / (count + 1)) * 0.34;
    const scale = 1 - i / (count * 3.2);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.cos(p * 1.7) * 0.6);
    ctx.scale(scale, scale);
    ctx.fillStyle = i === 0 ? "#f1f0fa" : `rgba(233,66,255,${alpha})`;
    ctx.beginPath();
    ctx.moveTo(22, 0);
    ctx.lineTo(-14, -13);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-14, 13);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.strokeStyle = "rgba(238,88,255,0.16)";
  ctx.lineWidth = 1;
  for (let y = h * 0.25; y < h * 0.8; y += h * 0.16) {
    const shift = ((t * 0.18 + y * 2) % (w * 0.5));
    ctx.beginPath();
    ctx.moveTo(shift - w * 0.5, y);
    ctx.lineTo(shift, y);
    ctx.stroke();
  }
}

function drawPortal(ctx, w, h, t, intensity) {
  ctx.fillStyle = "#02050a";
  ctx.fillRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.24;
  const aura = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius * 2.2);
  aura.addColorStop(0, "rgba(3,5,11,0.98)");
  aura.addColorStop(0.42, "rgba(19,63,105,0.7)");
  aura.addColorStop(0.58, "rgba(55,174,239,0.2)");
  aura.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalCompositeOperation = "lighter";
  const count = Math.floor(170 * intensity);
  for (let i = 0; i < count; i++) {
    const seed = hash(i * 3.93);
    const phase = fract(seed + t * (0.00005 + hash(i * 2.1) * 0.00012));
    const a = hash(i * 7.4) * TAU + t * 0.00018 * (i % 2 ? 1 : -1);
    const rr = radius * (0.78 + phase * 0.55);
    const x = Math.cos(a) * rr;
    const y = Math.sin(a) * rr * 0.82;
    ctx.fillStyle = `rgba(${50 + seed * 70},${145 + seed * 95},255,${1 - phase})`;
    ctx.beginPath();
    ctx.arc(x, y, 0.7 + seed * 2.2, 0, TAU);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(144,225,255,0.75)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius, radius * 0.82, 0, 0, TAU);
  ctx.stroke();
  ctx.restore();
}

function drawStarfield(ctx, w, h, t, intensity) {
  ctx.fillStyle = "#000106";
  ctx.fillRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h * 0.46;
  const speed = 0.00014 * intensity;
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < 180; i++) {
    const seed = hash(i * 7.17);
    const angle = hash(i * 3.88) * TAU;
    const z = fract(seed + t * speed * (0.45 + hash(i * 11.3)));
    const radius = Math.pow(z, 2.1) * Math.max(w, h) * 0.82;
    const prev = Math.max(0, radius - 6 - z * 38 * intensity);
    ctx.strokeStyle = `rgba(${180 + seed * 70},${205 + seed * 35},255,${z})`;
    ctx.lineWidth = 0.5 + z * 1.7;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * prev, Math.sin(angle) * prev * 0.65);
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.65);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSound(ctx, w, h, t) {
  ctx.fillStyle = "#020203";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(240,240,250,0.28)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 4) {
    const envelope = Math.sin((x / w) * Math.PI);
    const y = h / 2 + Math.sin(x * 0.045 + t * 0.0015) * envelope * h * 0.1;
    x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke();
}

effectComponents.forEach((component) => effectComponentRegistry.register(component));

class EffectCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.effect = canvas.dataset.component || canvas.dataset.effect || "starfield";
    this.component = effectComponentRegistry.get(this.effect);
    this.intensity = Number(canvas.dataset.intensity || 1);
    this.visible = true;
    this.paused = false;
    this.start = performance.now();
    this.pauseTime = 0;
    this.interaction = this.createInteractionState();
    this.boundPointerMove = (event) => this.handlePointerMove(event);
    this.boundPointerDown = (event) => this.handlePointerDown(event);
    this.boundPointerUp = (event) => this.handlePointerUp(event);
    this.boundPointerLeave = () => {
      if (!this.interaction.pointer.down) this.interaction.pointer.active = false;
    };
    canvas.addEventListener("pointermove", this.boundPointerMove);
    canvas.addEventListener("pointerdown", this.boundPointerDown);
    canvas.addEventListener("pointerup", this.boundPointerUp);
    canvas.addEventListener("pointercancel", this.boundPointerUp);
    canvas.addEventListener("pointerleave", this.boundPointerLeave);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
    }, { rootMargin: "120px" });
    this.intersectionObserver.observe(canvas);
    this.resize();
  }

  createInteractionState() {
    return {
      now: performance.now(),
      mediaLayer: this.canvas.dataset.mediaLayer === "true",
      pointer: { x: 0, y: 0, dx: 0, dy: 0, active: false, down: false },
      impulses: [],
      trail: [],
      custom: { combo: 8, lastCombo: 0, ...(this.component?.createState?.() || {}) },
    };
  }

  pointerPosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: clamp(event.clientX - rect.left, 0, rect.width),
      y: clamp(event.clientY - rect.top, 0, rect.height),
    };
  }

  handlePointerMove(event) {
    const next = this.pointerPosition(event);
    const pointer = this.interaction.pointer;
    pointer.dx = next.x - pointer.x;
    pointer.dy = next.y - pointer.y;
    pointer.x = next.x;
    pointer.y = next.y;
    pointer.active = true;
    if (pointer.down) {
      const previous = this.interaction.trail.at(-1);
      if (!previous || Math.hypot(previous.x - next.x, previous.y - next.y) > 5) {
        this.interaction.trail.push({ ...next, time: performance.now() });
      }
    }
    this.component?.onPointerMove?.({ event, point: next, state: this.interaction, instance: this });
  }

  handlePointerDown(event) {
    const next = this.pointerPosition(event);
    const now = performance.now();
    Object.assign(this.interaction.pointer, next, { active: true, down: true, dx: 0, dy: 0 });
    this.interaction.impulses.push({ ...next, time: now });
    this.interaction.trail.push({ ...next, time: now });
    this.component?.onPointerDown?.({ event, point: next, now, state: this.interaction, instance: this });
    this.canvas.setPointerCapture?.(event.pointerId);
  }

  handlePointerUp(event) {
    this.interaction.pointer.down = false;
    this.component?.onPointerUp?.({ event, state: this.interaction, instance: this });
    if (event?.pointerId !== undefined && this.canvas.hasPointerCapture?.(event.pointerId)) {
      this.canvas.releasePointerCapture(event.pointerId);
    }
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.width = rect.width;
      this.height = rect.height;
    }
  }

  draw(now) {
    if (!this.visible || this.paused || !this.width || !this.height) return;
    const drawer = this.component?.draw || drawSound;
    this.interaction.now = now;
    this.interaction.impulses = this.interaction.impulses.filter((event) => now - event.time < 3200);
    this.interaction.trail = this.interaction.trail.filter((point) => now - point.time < 1900).slice(-90);
    drawer(this.ctx, this.width, this.height, now - this.start, this.intensity, this.interaction);
  }

  setIntensity(value) {
    this.intensity = Number(value);
  }

  toggle() {
    this.paused = !this.paused;
    return this.paused;
  }

  replay() {
    this.start = performance.now();
    this.paused = false;
    this.interaction = this.createInteractionState();
  }

  destroy() {
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.canvas.removeEventListener("pointermove", this.boundPointerMove);
    this.canvas.removeEventListener("pointerdown", this.boundPointerDown);
    this.canvas.removeEventListener("pointerup", this.boundPointerUp);
    this.canvas.removeEventListener("pointercancel", this.boundPointerUp);
    this.canvas.removeEventListener("pointerleave", this.boundPointerLeave);
  }
}

let instances = [];
let frameId = 0;

function frame(now) {
  frameId = requestAnimationFrame(frame);
  instances.forEach((instance) => instance.draw(now));
}

export function mountEffects(root = document) {
  destroyEffects();
  instances = [...root.querySelectorAll("canvas[data-effect], canvas[data-component]")].map((canvas) => new EffectCanvas(canvas));
  if (!frameId) frameId = requestAnimationFrame(frame);
  return instances;
}

export function getEffectInstance(canvas) {
  return instances.find((instance) => instance.canvas === canvas);
}

export function hasEffectComponent(id) {
  return effectComponentRegistry.has(id);
}

export function getEffectComponent(id) {
  return effectComponentRegistry.get(id);
}

export function getRegisteredEffectComponents() {
  return effectComponentRegistry.list();
}

export function destroyEffects() {
  instances.forEach((instance) => instance.destroy());
  instances = [];
}
