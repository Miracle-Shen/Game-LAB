const TAU = Math.PI * 2;
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const lerp = (start, end, amount) => start + (end - start) * amount;
const hash = (value) => {
  const x = Math.sin(value * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const FACE_ANGLES = {
  front: 0,
  "right-rear": -TAU / 3,
  "left-rear": TAU / 3,
};

const PREVIEW_CHART = {
  id: "porcelain-preview-v2",
  durationMs: 11000,
  sections: [
    { id: "p1", patternGroup: "foundation-rings", workFace: "front", startMs: 0, endMs: 1220, strokes: [{ id: "preview-1", startMs: 0, endMs: 1120, path: [[0.02,0.92],[0.25,0.94],[0.5,0.92],[0.75,0.94],[0.98,0.92]] }] },
    { id: "p2", patternGroup: "neck-ruyi-fret", workFace: "right-rear", startMs: 1220, endMs: 2440, strokes: [{ id: "preview-2", startMs: 1220, endMs: 2340, path: [[0.02,0.82],[0.25,0.78],[0.5,0.82],[0.75,0.78],[0.98,0.82]] }] },
    { id: "p3", patternGroup: "shoulder-cloud-collar", workFace: "left-rear", startMs: 2440, endMs: 3660, strokes: [{ id: "preview-3", startMs: 2440, endMs: 3560, path: [[0.02,0.7],[0.25,0.75],[0.5,0.69],[0.75,0.75],[0.98,0.7]] }] },
    { id: "p4", patternGroup: "peony-vines", workFace: "front", startMs: 3660, endMs: 4880, strokes: [{ id: "preview-4", startMs: 3660, endMs: 4780, path: [[0.35,0.36],[0.42,0.48],[0.5,0.42],[0.57,0.57],[0.65,0.63]] }] },
    { id: "p5", patternGroup: "peony-blooms", workFace: "right-rear", startMs: 4880, endMs: 6100, strokes: [{ id: "preview-5", startMs: 4880, endMs: 6000, path: [[0.69,0.48],[0.76,0.61],[0.84,0.45],[0.9,0.59],[0.98,0.43]] }] },
    { id: "p6", patternGroup: "landscape-wash", workFace: "left-rear", startMs: 6100, endMs: 7320, strokes: [{ id: "preview-6", startMs: 6100, endMs: 7220, path: [[0.04,0.39],[0.1,0.57],[0.17,0.46],[0.23,0.62],[0.29,0.4]] }] },
    { id: "p7", patternGroup: "auspicious-borders", workFace: "front", startMs: 7320, endMs: 8540, strokes: [{ id: "preview-7", startMs: 7320, endMs: 8440, path: [[0.02,0.3],[0.25,0.34],[0.5,0.3],[0.75,0.34],[0.98,0.3]] }] },
    { id: "p8", patternGroup: "lotus-wave-foot", workFace: "right-rear", startMs: 8540, endMs: 9760, strokes: [{ id: "preview-8", startMs: 8540, endMs: 9660, path: [[0.02,0.21],[0.25,0.12],[0.5,0.22],[0.75,0.12],[0.98,0.21]] }] },
    { id: "p9", patternGroup: "calligraphy-seal", workFace: "left-rear", startMs: 9760, endMs: 11000, strokes: [{ id: "preview-9", startMs: 9760, endMs: 10900, path: [[0.24,0.61],[0.26,0.53],[0.28,0.46],[0.3,0.39],[0.32,0.33]] }] },
  ],
};

function samplePath(path, progress) {
  if (!path?.length) return { x: 0.5, y: 0.5 };
  if (path.length === 1) return { x: path[0][0], y: path[0][1] };
  const scaled = clamp(progress) * (path.length - 1);
  const index = Math.min(path.length - 2, Math.floor(scaled));
  const local = scaled - index;
  return {
    x: lerp(path[index][0], path[index + 1][0], local),
    y: lerp(path[index][1], path[index + 1][1], local),
  };
}

function paintPattern(ctx, width, height, onlyGroup = null) {
  ctx.clearRect(0, 0, width, height);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const unit = height / 1024;
  const cobalt = "#1f568a";
  const deepCobalt = "#0c345f";
  const paleCobalt = "rgba(71,126,166,0.26)";
  const groupEnabled = (...groups) => !onlyGroup || groups.includes(onlyGroup);

  const strokeCobalt = (path, lineWidth, alpha = 1, seed = 0) => {
    const variation = 0.92 + hash(seed * 7.37 + lineWidth) * 0.16;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = paleCobalt;
    ctx.lineWidth = lineWidth * 2.15 * variation;
    ctx.stroke(path);
    ctx.globalCompositeOperation = "multiply";
    ctx.strokeStyle = cobalt;
    ctx.lineWidth = lineWidth * 1.08 * variation;
    ctx.stroke(path);
    ctx.strokeStyle = deepCobalt;
    ctx.globalAlpha = alpha * (0.54 + hash(seed * 3.19) * 0.18);
    ctx.lineWidth = lineWidth * 0.34;
    ctx.stroke(path);
    ctx.restore();
  };

  const fillWash = (path, alpha = 0.2, seed = 0) => {
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = hash(seed * 5.71) > 0.45 ? cobalt : deepCobalt;
    ctx.globalAlpha = alpha * (0.84 + hash(seed * 2.63) * 0.28);
    ctx.fill(path);
    ctx.restore();
  };

  const drawWrapped = (x, padding, painter) => {
    painter(x);
    if (x < padding) painter(x + width);
    if (x > width - padding) painter(x - width);
  };

  const drawBand = (ratio, weight = 4) => {
    const y = height * ratio;
    const path = new Path2D();
    path.moveTo(0, y);
    path.lineTo(width, y);
    strokeCobalt(path, weight * unit, 0.92);
  };

  const drawKeyFret = (ratio, cellRatio, amplitudeRatio) => {
    const y = height * ratio;
    const cell = width * cellRatio;
    const amplitude = height * amplitudeRatio;
    for (let x = -cell; x < width + cell; x += cell) {
      const path = new Path2D();
      path.moveTo(x, y + amplitude);
      path.lineTo(x + cell * 0.22, y + amplitude);
      path.lineTo(x + cell * 0.22, y - amplitude);
      path.lineTo(x + cell * 0.72, y - amplitude);
      path.lineTo(x + cell * 0.72, y + amplitude * 0.35);
      path.lineTo(x + cell * 0.46, y + amplitude * 0.35);
      path.lineTo(x + cell * 0.46, y);
      strokeCobalt(path, 2.6 * unit, 0.88);
    }
  };

  const drawRuyi = (x, y, size, flip = 1) => {
    const path = new Path2D();
    path.moveTo(x - size * 0.5, y + size * 0.28 * flip);
    path.bezierCurveTo(x - size * 0.58, y - size * 0.02 * flip, x - size * 0.25, y - size * 0.46 * flip, x, y - size * 0.12 * flip);
    path.bezierCurveTo(x + size * 0.25, y - size * 0.46 * flip, x + size * 0.58, y - size * 0.02 * flip, x + size * 0.5, y + size * 0.28 * flip);
    path.bezierCurveTo(x + size * 0.24, y + size * 0.12 * flip, x + size * 0.12, y + size * 0.42 * flip, x, y + size * 0.5 * flip);
    path.bezierCurveTo(x - size * 0.12, y + size * 0.42 * flip, x - size * 0.24, y + size * 0.12 * flip, x - size * 0.5, y + size * 0.28 * flip);
    fillWash(path, 0.1);
    strokeCobalt(path, 3.6 * unit, 0.92);
    const inner = new Path2D();
    inner.moveTo(x - size * 0.23, y + size * 0.12 * flip);
    inner.quadraticCurveTo(x, y - size * 0.15 * flip, x + size * 0.23, y + size * 0.12 * flip);
    strokeCobalt(inner, 1.9 * unit, 0.72);
  };

  const drawLeaf = (x, y, angle, length, leafWidth) => {
    const path = new Path2D();
    path.moveTo(0, 0);
    path.bezierCurveTo(length * 0.3, -leafWidth, length * 0.76, -leafWidth * 0.75, length, 0);
    path.bezierCurveTo(length * 0.72, leafWidth * 0.7, length * 0.28, leafWidth, 0, 0);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    fillWash(path, 0.18 + hash(x + y) * 0.12);
    strokeCobalt(path, 2.3 * unit, 0.88);
    const vein = new Path2D();
    vein.moveTo(2 * unit, 0);
    vein.lineTo(length * 0.88, 0);
    ctx.strokeStyle = deepCobalt;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.25 * unit;
    ctx.stroke(vein);
    ctx.restore();
  };

  const drawBud = (x, y, angle, size) => {
    const path = new Path2D();
    path.moveTo(0, size * 0.38);
    path.bezierCurveTo(-size * 0.5, size * 0.05, -size * 0.38, -size * 0.55, 0, -size * 0.72);
    path.bezierCurveTo(size * 0.38, -size * 0.55, size * 0.5, size * 0.05, 0, size * 0.38);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    fillWash(path, 0.24);
    strokeCobalt(path, 2.4 * unit, 0.9);
    ctx.restore();
  };

  const drawPeony = (x, y, radius, rotation) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    for (let layer = 0; layer < 3; layer += 1) {
      const petals = 8 + layer * 4;
      const petalLength = radius * (1 - layer * 0.18);
      for (let petal = 0; petal < petals; petal += 1) {
        const angle = (petal / petals) * TAU + layer * 0.18;
        const path = new Path2D();
        path.moveTo(0, 0);
        path.bezierCurveTo(
          petalLength * 0.18,
          -petalLength * 0.18,
          petalLength * 0.32,
          -petalLength * 0.78,
          0,
          -petalLength,
        );
        path.bezierCurveTo(
          -petalLength * 0.32,
          -petalLength * 0.78,
          -petalLength * 0.18,
          -petalLength * 0.18,
          0,
          0,
        );
        ctx.save();
        ctx.rotate(angle);
        fillWash(path, 0.08 + layer * 0.04);
        strokeCobalt(path, (2.2 - layer * 0.3) * unit, 0.84);
        ctx.restore();
      }
    }
    ctx.fillStyle = deepCobalt;
    ctx.globalAlpha = 0.86;
    for (let dot = 0; dot < 9; dot += 1) {
      const angle = (dot / 9) * TAU;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * radius * 0.13, Math.sin(angle) * radius * 0.13, 2.4 * unit, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  };

  const drawLotusPanel = (x, y, widthValue, heightValue) => {
    const outer = new Path2D();
    outer.moveTo(x - widthValue * 0.5, y + heightValue * 0.46);
    outer.bezierCurveTo(x - widthValue * 0.42, y, x - widthValue * 0.18, y - heightValue * 0.35, x, y - heightValue * 0.55);
    outer.bezierCurveTo(x + widthValue * 0.18, y - heightValue * 0.35, x + widthValue * 0.42, y, x + widthValue * 0.5, y + heightValue * 0.46);
    fillWash(outer, 0.12);
    strokeCobalt(outer, 3.1 * unit, 0.92);
    const inner = new Path2D();
    inner.moveTo(x - widthValue * 0.24, y + heightValue * 0.36);
    inner.quadraticCurveTo(x, y - heightValue * 0.18, x + widthValue * 0.24, y + heightValue * 0.36);
    strokeCobalt(inner, 1.8 * unit, 0.74);
  };

  const drawWaveBand = (ratio, amplitudeRatio, cellRatio, seed = 0) => {
    const y = height * ratio;
    const amplitude = height * amplitudeRatio;
    const cell = width * cellRatio;
    for (let x = -cell; x < width + cell; x += cell) {
      const path = new Path2D();
      path.moveTo(x, y);
      path.bezierCurveTo(x + cell * 0.2, y - amplitude, x + cell * 0.34, y - amplitude, x + cell * 0.5, y);
      path.bezierCurveTo(x + cell * 0.66, y + amplitude, x + cell * 0.8, y + amplitude, x + cell, y);
      strokeCobalt(path, 1.55 * unit, 0.76, seed + x);
      const crest = new Path2D();
      crest.moveTo(x + cell * 0.28, y - amplitude * 0.72);
      crest.quadraticCurveTo(x + cell * 0.42, y - amplitude * 1.22, x + cell * 0.52, y - amplitude * 0.16);
      strokeCobalt(crest, 0.78 * unit, 0.52, seed + x + 1);
    }
  };

  const drawCloud = (x, y, size, seed = 0) => {
    const path = new Path2D();
    path.moveTo(x - size * 0.52, y + size * 0.15);
    path.bezierCurveTo(x - size * 0.4, y - size * 0.08, x - size * 0.24, y - size * 0.2, x - size * 0.08, y - size * 0.03);
    path.bezierCurveTo(x - size * 0.04, y - size * 0.34, x + size * 0.26, y - size * 0.36, x + size * 0.3, y - size * 0.08);
    path.bezierCurveTo(x + size * 0.55, y - size * 0.12, x + size * 0.6, y + size * 0.16, x + size * 0.38, y + size * 0.24);
    path.bezierCurveTo(x + size * 0.14, y + size * 0.34, x - size * 0.14, y + size * 0.28, x - size * 0.52, y + size * 0.15);
    fillWash(path, 0.09, seed);
    strokeCobalt(path, 2.1 * unit, 0.84, seed);
    const curl = new Path2D();
    curl.moveTo(x - size * 0.24, y + size * 0.12);
    curl.bezierCurveTo(x - size * 0.02, y - size * 0.04, x + size * 0.2, y + size * 0.04, x + size * 0.08, y + size * 0.16);
    curl.bezierCurveTo(x, y + size * 0.23, x - size * 0.03, y + size * 0.12, x + size * 0.1, y + size * 0.1);
    strokeCobalt(curl, 1.05 * unit, 0.62, seed + 2);
  };

  const drawRock = (x, y, size, seed = 0) => {
    const rock = new Path2D();
    rock.moveTo(x - size * 0.52, y + size * 0.38);
    rock.bezierCurveTo(x - size * 0.46, y + size * 0.03, x - size * 0.22, y - size * 0.08, x - size * 0.15, y - size * 0.45);
    rock.bezierCurveTo(x + size * 0.02, y - size * 0.22, x + size * 0.18, y - size * 0.5, x + size * 0.28, y - size * 0.12);
    rock.bezierCurveTo(x + size * 0.52, y - size * 0.02, x + size * 0.48, y + size * 0.3, x + size * 0.52, y + size * 0.38);
    rock.closePath();
    fillWash(rock, 0.14, seed);
    strokeCobalt(rock, 2 * unit, 0.82, seed);
    for (let line = 0; line < 4; line += 1) {
      const fissure = new Path2D();
      fissure.moveTo(x - size * (0.28 - line * 0.15), y + size * 0.28);
      fissure.quadraticCurveTo(x - size * (0.12 - line * 0.11), y, x - size * (0.06 - line * 0.1), y - size * (0.25 - line * 0.04));
      strokeCobalt(fissure, 0.8 * unit, 0.5, seed + line);
    }
  };

  if (groupEnabled("foundation-rings")) {
    drawBand(0.035, 2.5);
    drawBand(0.065, 1.3);
    drawBand(0.098, 1.8);
    drawBand(0.135, 1.1);
    for (let index = 0; index < 72; index += 1) {
      ctx.fillStyle = deepCobalt;
      ctx.globalAlpha = 0.24 + hash(index * 2.3) * 0.22;
      ctx.beginPath();
      ctx.arc((index + 0.5) * width / 72, height * 0.116, (0.7 + hash(index) * 0.8) * unit, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  if (groupEnabled("neck-ruyi-fret")) {
    drawBand(0.15, 1.5);
    drawKeyFret(0.174, 0.038, 0.011);
    drawBand(0.198, 1.2);
    const ruyiCell = width / 30;
    for (let index = -1; index < 32; index += 1) {
      drawRuyi((index + 0.5) * ruyiCell, height * 0.235, ruyiCell * 0.86, 1);
    }
    drawBand(0.274, 1.6);
  }

  if (groupEnabled("shoulder-cloud-collar")) {
    const cloudCell = width / 22;
    for (let index = -1; index < 24; index += 1) {
      const x = (index + 0.5) * cloudCell;
      drawCloud(x, height * 0.305, cloudCell * 0.92, index);
      const pendant = new Path2D();
      pendant.moveTo(x, height * 0.322);
      pendant.quadraticCurveTo(x - cloudCell * 0.18, height * 0.35, x, height * 0.372);
      pendant.quadraticCurveTo(x + cloudCell * 0.18, height * 0.35, x, height * 0.322);
      fillWash(pendant, 0.08, index + 20);
      strokeCobalt(pendant, 1.2 * unit, 0.68, index + 30);
    }
    drawBand(0.39, 1.8);
  }

  const faceCenters = { front: 0.5, "right-rear": 5 / 6, "left-rear": 1 / 6 };

  if (groupEnabled("peony-vines")) {
    const center = faceCenters.front * width;
    const panelWidth = width * 0.31;
    const stem = new Path2D();
    stem.moveTo(center - panelWidth * 0.47, height * 0.65);
    stem.bezierCurveTo(center - panelWidth * 0.3, height * 0.54, center - panelWidth * 0.16, height * 0.59, center, height * 0.47);
    stem.bezierCurveTo(center + panelWidth * 0.14, height * 0.4, center + panelWidth * 0.31, height * 0.5, center + panelWidth * 0.45, height * 0.405);
    strokeCobalt(stem, 2.6 * unit, 0.86, 201);
    drawRock(center - panelWidth * 0.34, height * 0.62, height * 0.14, 202);
    drawPeony(center - panelWidth * 0.08, height * 0.49, height * 0.078, -0.18);
    drawPeony(center + panelWidth * 0.3, height * 0.405, height * 0.055, 0.34);
    const placements = [
      [-0.3, 0.55, -2.45], [-0.17, 0.49, -2.05], [-0.02, 0.53, -2.55],
      [0.13, 0.44, -0.6], [0.27, 0.5, -0.45], [0.38, 0.415, -0.78],
    ];
    placements.forEach(([xRatio, yRatio, angle], index) => drawLeaf(
      center + panelWidth * xRatio,
      height * yRatio,
      angle,
      height * (0.075 + hash(index) * 0.025),
      height * 0.021,
    ));
    drawBud(center + panelWidth * 0.36, height * 0.39, 0.65, height * 0.062);
    drawBud(center - panelWidth * 0.12, height * 0.46, -0.35, height * 0.054);
  }

  if (groupEnabled("peony-blooms")) {
    const center = faceCenters["right-rear"] * width;
    const panelWidth = width * 0.31;
    drawWrapped(center, panelWidth * 0.6, (wrappedCenter) => {
      drawPeony(wrappedCenter - panelWidth * 0.22, height * 0.49, height * 0.075, 0.18);
      drawPeony(wrappedCenter + panelWidth * 0.12, height * 0.56, height * 0.094, -0.25);
      drawPeony(wrappedCenter + panelWidth * 0.31, height * 0.43, height * 0.064, 0.5);
      const branch = new Path2D();
      branch.moveTo(wrappedCenter - panelWidth * 0.48, height * 0.66);
      branch.bezierCurveTo(wrappedCenter - panelWidth * 0.18, height * 0.58, wrappedCenter + panelWidth * 0.03, height * 0.66, wrappedCenter + panelWidth * 0.45, height * 0.42);
      strokeCobalt(branch, 2.4 * unit, 0.84, 305);
      for (let index = 0; index < 8; index += 1) {
        const t = index / 7;
        drawLeaf(
          wrappedCenter + lerp(-0.38, 0.39, t) * panelWidth,
          height * (0.62 - Math.sin(t * Math.PI) * 0.1),
          index % 2 ? 0.55 : 2.45,
          height * (0.055 + hash(index * 4.1) * 0.024),
          height * 0.018,
        );
      }
    });
  }

  if (groupEnabled("landscape-wash")) {
    const center = faceCenters["left-rear"] * width;
    const panelWidth = width * 0.24;
    drawWrapped(center, panelWidth * 0.6, (wrappedCenter) => {
      for (let layer = 0; layer < 3; layer += 1) {
        const mountain = new Path2D();
        const baseY = height * (0.62 - layer * 0.035);
        mountain.moveTo(wrappedCenter - panelWidth * 0.5, baseY);
        mountain.bezierCurveTo(wrappedCenter - panelWidth * 0.3, height * (0.42 + layer * 0.025), wrappedCenter - panelWidth * 0.17, height * (0.55 - layer * 0.02), wrappedCenter, height * (0.39 + layer * 0.03));
        mountain.bezierCurveTo(wrappedCenter + panelWidth * 0.18, height * (0.5 + layer * 0.018), wrappedCenter + panelWidth * 0.32, height * (0.45 + layer * 0.02), wrappedCenter + panelWidth * 0.5, baseY);
        fillWash(mountain, 0.045 + layer * 0.03, 410 + layer);
        strokeCobalt(mountain, (0.85 + layer * 0.34) * unit, 0.38 + layer * 0.14, 410 + layer);
      }
      const water = new Path2D();
      water.moveTo(wrappedCenter - panelWidth * 0.46, height * 0.65);
      water.bezierCurveTo(wrappedCenter - panelWidth * 0.18, height * 0.63, wrappedCenter + panelWidth * 0.12, height * 0.68, wrappedCenter + panelWidth * 0.46, height * 0.64);
      strokeCobalt(water, 1.25 * unit, 0.56, 420);
      const pavilion = new Path2D();
      pavilion.moveTo(wrappedCenter + panelWidth * 0.1, height * 0.56);
      pavilion.lineTo(wrappedCenter + panelWidth * 0.31, height * 0.56);
      pavilion.moveTo(wrappedCenter + panelWidth * 0.13, height * 0.56);
      pavilion.lineTo(wrappedCenter + panelWidth * 0.13, height * 0.63);
      pavilion.moveTo(wrappedCenter + panelWidth * 0.28, height * 0.56);
      pavilion.lineTo(wrappedCenter + panelWidth * 0.28, height * 0.63);
      pavilion.moveTo(wrappedCenter + panelWidth * 0.07, height * 0.555);
      pavilion.lineTo(wrappedCenter + panelWidth * 0.2, height * 0.525);
      pavilion.lineTo(wrappedCenter + panelWidth * 0.34, height * 0.555);
      strokeCobalt(pavilion, 1.05 * unit, 0.68, 422);

      const pineTrunk = new Path2D();
      pineTrunk.moveTo(wrappedCenter - panelWidth * 0.33, height * 0.63);
      pineTrunk.bezierCurveTo(wrappedCenter - panelWidth * 0.29, height * 0.56, wrappedCenter - panelWidth * 0.38, height * 0.5, wrappedCenter - panelWidth * 0.31, height * 0.43);
      pineTrunk.bezierCurveTo(wrappedCenter - panelWidth * 0.25, height * 0.39, wrappedCenter - panelWidth * 0.2, height * 0.43, wrappedCenter - panelWidth * 0.16, height * 0.39);
      strokeCobalt(pineTrunk, 2.2 * unit, 0.8, 423);
      for (let cluster = 0; cluster < 5; cluster += 1) {
        const cx = wrappedCenter - panelWidth * (0.34 - cluster * 0.045);
        const cy = height * (0.46 - (cluster % 3) * 0.035);
        for (let needle = 0; needle < 7; needle += 1) {
          const spray = new Path2D();
          spray.moveTo(cx, cy);
          spray.quadraticCurveTo(
            cx + panelWidth * (needle - 3) * 0.018,
            cy - height * 0.018,
            cx + panelWidth * (needle - 3) * 0.03,
            cy + height * 0.006,
          );
          strokeCobalt(spray, 0.78 * unit, 0.56, 430 + cluster * 10 + needle);
        }
      }

      const boat = new Path2D();
      boat.moveTo(wrappedCenter - panelWidth * 0.04, height * 0.635);
      boat.quadraticCurveTo(wrappedCenter + panelWidth * 0.08, height * 0.655, wrappedCenter + panelWidth * 0.2, height * 0.635);
      boat.moveTo(wrappedCenter + panelWidth * 0.08, height * 0.64);
      boat.lineTo(wrappedCenter + panelWidth * 0.08, height * 0.59);
      boat.lineTo(wrappedCenter + panelWidth * 0.16, height * 0.625);
      strokeCobalt(boat, 1.05 * unit, 0.62, 470);
      for (let bird = 0; bird < 3; bird += 1) {
        const bx = wrappedCenter + panelWidth * (0.02 + bird * 0.1);
        const by = height * (0.43 + bird * 0.018);
        const goose = new Path2D();
        goose.moveTo(bx - panelWidth * 0.025, by);
        goose.quadraticCurveTo(bx, by - height * 0.012, bx + panelWidth * 0.025, by);
        strokeCobalt(goose, 0.72 * unit, 0.52, 480 + bird);
      }
    });
  }

  if (groupEnabled("auspicious-borders")) {
    drawBand(0.68, 1.8);
    drawKeyFret(0.705, 0.042, 0.011);
    const borderCell = width / 34;
    for (let index = -1; index < 36; index += 1) drawCloud((index + 0.5) * borderCell, height * 0.739, borderCell * 0.7, 500 + index);
    drawBand(0.77, 1.6);
  }

  if (groupEnabled("lotus-wave-foot")) {
    const lotusCell = width / 28;
    for (let index = -1; index < 30; index += 1) drawLotusPanel((index + 0.5) * lotusCell, height * 0.815, lotusCell * 0.92, height * 0.09);
    drawWaveBand(0.875, 0.019, 0.048, 650);
    drawWaveBand(0.91, 0.014, 0.042, 680);
    drawBand(0.945, 1.6);
    drawBand(0.97, 2.3);
  }

  if (groupEnabled("calligraphy-seal")) {
    const center = width * 0.285;
    const panelWidth = width * 0.15;
    drawWrapped(center, panelWidth, (wrappedCenter) => {
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = deepCobalt;
      ctx.globalAlpha = 0.78;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `600 ${Math.round(height * 0.035)}px "Kaiti SC", "STKaiti", "Songti SC", serif`;
      ["一", "曲", "入", "瓷", "青", "花", "自", "成"].forEach((glyph, index) => {
        const column = index < 4 ? -0.05 : 0.04;
        const row = index % 4;
        ctx.fillText(glyph, wrappedCenter + panelWidth * column, height * (0.43 + row * 0.052));
      });
      ctx.restore();
      const branch = new Path2D();
      branch.moveTo(wrappedCenter + panelWidth * 0.15, height * 0.64);
      branch.bezierCurveTo(wrappedCenter + panelWidth * 0.38, height * 0.56, wrappedCenter + panelWidth * 0.22, height * 0.48, wrappedCenter + panelWidth * 0.48, height * 0.405);
      strokeCobalt(branch, 1.65 * unit, 0.74, 710);
      ctx.strokeStyle = "#943b35";
      ctx.fillStyle = "rgba(148,59,53,0.2)";
      ctx.lineWidth = 2.4 * unit;
      const sealSize = height * 0.055;
      const sealX = wrappedCenter;
      const sealY = height * 0.64;
      ctx.strokeRect(sealX - sealSize / 2, sealY - sealSize / 2, sealSize, sealSize);
      ctx.fillRect(sealX - sealSize / 2, sealY - sealSize / 2, sealSize, sealSize);
      ctx.fillStyle = "#943b35";
      ctx.font = `700 ${Math.round(sealSize * 0.56)}px "Songti SC", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("韵", sealX, sealY);
    });
  }

  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = deepCobalt;
  for (let index = 0; index < 520; index += 1) {
    const x = hash(index * 17.31) * width;
    const y = hash(index * 41.73) * height;
    if (y < height * 0.02 || y > height * 0.985) continue;
    ctx.globalAlpha = 0.018 + hash(index * 8.11) * 0.048;
    const radius = (0.35 + hash(index * 3.77) * 0.9) * unit;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

const PATTERN_GROUPS = {
  "foundation-rings": { brush: 7, wrap: true, vMin: 0.82, vMax: 0.995 },
  "neck-ruyi-fret": { brush: 8, wrap: true, vMin: 0.72, vMax: 0.88 },
  "shoulder-cloud-collar": { brush: 11, wrap: true, vMin: 0.6, vMax: 0.79 },
  "peony-vines": { brush: 13, face: "front", halfWidth: 0.165, vMin: 0.33, vMax: 0.68 },
  "peony-blooms": { brush: 16, face: "right-rear", halfWidth: 0.165, vMin: 0.33, vMax: 0.68 },
  "landscape-wash": { brush: 18, face: "left-rear", halfWidth: 0.12, vMin: 0.35, vMax: 0.68 },
  "auspicious-borders": { brush: 8, wrap: true, vMin: 0.23, vMax: 0.35 },
  "lotus-wave-foot": { brush: 11, wrap: true, vMin: 0.02, vMax: 0.3 },
  "calligraphy-seal": { brush: 10, center: 0.285, halfWidth: 0.065, vMin: 0.31, vMax: 0.62 },
};

function makeTextureState(THREE, maxAnisotropy = 4) {
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const mobile = window.matchMedia?.("(max-width: 720px)").matches;
  const capableDesktop = window.innerWidth >= 1180 && memory >= 8 && cores >= 8;
  const width = capableDesktop ? 2048 : mobile || memory <= 4 || cores <= 4 ? 1280 : 1536;
  const height = width / 2;
  const uploadInterval = capableDesktop ? 33 : mobile ? 42 : 36;
  const patternCanvas = document.createElement("canvas");
  const maskCanvas = document.createElement("canvas");
  const completionMaskCanvas = document.createElement("canvas");
  const clippedCanvas = document.createElement("canvas");
  const outputCanvas = document.createElement("canvas");
  [patternCanvas, maskCanvas, completionMaskCanvas, clippedCanvas, outputCanvas].forEach((canvas) => {
    canvas.width = width;
    canvas.height = height;
  });

  const pattern = patternCanvas.getContext("2d");
  const mask = maskCanvas.getContext("2d");
  const completionMask = completionMaskCanvas.getContext("2d");
  const clipped = clippedCanvas.getContext("2d");
  const output = outputCanvas.getContext("2d");
  paintPattern(pattern, width, height);

  const texture = new THREE.CanvasTexture(outputCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(4, maxAnisotropy);
  const paintedProgress = new Map();
  let previousTime = -1;
  let chartId = null;
  let dirty = true;
  let lastComposeAt = 0;

  function compose(force = false) {
    if (!dirty) return;
    const now = performance.now();
    if (!force && now - lastComposeAt < uploadInterval) return;
    lastComposeAt = now;
    const porcelain = output.createLinearGradient(0, 0, width, 0);
    porcelain.addColorStop(0, "#cbdde4");
    porcelain.addColorStop(0.18, "#edf5f5");
    porcelain.addColorStop(0.48, "#fffdf7");
    porcelain.addColorStop(0.72, "#f3f7f3");
    porcelain.addColorStop(1, "#c3d7df");
    output.globalCompositeOperation = "source-over";
    output.fillStyle = porcelain;
    output.fillRect(0, 0, width, height);
    for (let index = 0; index < 36; index += 1) {
      const x = hash(index * 11.73) * width;
      const y = hash(index * 29.17) * height;
      const radius = height * (0.01 + hash(index * 3.9) * 0.025);
      const cloud = output.createRadialGradient(x, y, 0, x, y, radius);
      cloud.addColorStop(0, hash(index * 5.4) > 0.78 ? "rgba(173,132,87,.025)" : "rgba(97,139,153,.02)");
      cloud.addColorStop(1, "rgba(255,255,255,0)");
      output.fillStyle = cloud;
      output.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }

    clipped.clearRect(0, 0, width, height);
    clipped.drawImage(maskCanvas, 0, 0);
    clipped.globalCompositeOperation = "lighter";
    clipped.drawImage(completionMaskCanvas, 0, 0);
    clipped.globalCompositeOperation = "source-in";
    clipped.drawImage(patternCanvas, 0, 0);
    clipped.globalCompositeOperation = "source-over";
    output.drawImage(clippedCanvas, 0, 0);
    texture.needsUpdate = true;
    dirty = false;
  }

  function reset() {
    mask.clearRect(0, 0, width, height);
    completionMask.clearRect(0, 0, width, height);
    paintedProgress.clear();
    previousTime = -1;
    dirty = true;
    compose(true);
  }

  function paintStroke(stroke, fromProgress, toProgress, section) {
    if (toProgress <= fromProgress || !stroke.path?.length) return;
    const scale = height / 640;
    const group = PATTERN_GROUPS[section?.patternGroup] || { brush: 12 };
    const radius = group.brush * scale;
    const samples = Math.max(3, Math.ceil((toProgress - fromProgress) * 150));
    const trace = () => {
      mask.beginPath();
      for (let index = 0; index <= samples; index += 1) {
        const progress = lerp(fromProgress, toProgress, index / samples);
        const point = samplePath(stroke.path, progress);
        const x = point.x * width;
        const y = (1 - point.y) * height;
        if (index === 0) mask.moveTo(x, y);
        else mask.lineTo(x, y);
      }
      mask.stroke();
    };
    mask.save();
    mask.lineCap = "round";
    mask.lineJoin = "round";
    mask.strokeStyle = "rgba(255,255,255,0.28)";
    mask.lineWidth = radius * 3.4;
    trace();
    mask.strokeStyle = "#fff";
    mask.lineWidth = radius * 1.45;
    trace();
    mask.restore();
    dirty = true;
  }

  function paintSectionCompletion(section, amount) {
    if (!section || amount <= 0) return;
    const config = PATTERN_GROUPS[section.patternGroup] || {
      face: section.workFace,
      halfWidth: 0.17,
      vMin: 0.25,
      vMax: 0.75,
    };
    const eased = amount * amount * (3 - 2 * amount);
    const y = (1 - config.vMax) * height;
    const bandHeight = (config.vMax - config.vMin) * height;
    const radius = Math.min(bandHeight * 0.18, width * 0.018);
    const fillSegment = (start, end) => {
      if (end <= start) return;
      completionMask.save();
      completionMask.globalAlpha = eased;
      completionMask.fillStyle = "#fff";
      completionMask.beginPath();
      const x = start * width;
      const segmentWidth = (end - start) * width;
      if (completionMask.roundRect) completionMask.roundRect(x, y, segmentWidth, bandHeight, radius);
      else completionMask.rect(x, y, segmentWidth, bandHeight);
      completionMask.fill();
      completionMask.restore();
    };
    if (config.wrap) {
      fillSegment(0, 1);
      return;
    }
    const centers = { front: 0.5, "right-rear": 5 / 6, "left-rear": 1 / 6 };
    const center = config.center ?? centers[config.face || section.workFace] ?? 0.5;
    const halfWidth = config.halfWidth || 0.17;
    const start = center - halfWidth;
    const end = center + halfWidth;
    if (start < 0) {
      fillSegment(0, end);
      fillSegment(start + 1, 1);
    } else if (end > 1) {
      fillSegment(start, 1);
      fillSegment(0, end - 1);
    } else {
      fillSegment(start, end);
    }
  }

  function rebuild(chart, timeMs) {
    mask.clearRect(0, 0, width, height);
    paintedProgress.clear();
    chart.sections.forEach((section) => {
      section.strokes.forEach((stroke) => {
        const progress = clamp((timeMs - stroke.startMs) / Math.max(1, stroke.endMs - stroke.startMs));
        if (progress > 0) paintStroke(stroke, 0, progress, section);
        paintedProgress.set(stroke.id, progress);
      });
    });
  }

  function update(chart, timeMs, complete = false) {
    if (!chart?.sections?.length) {
      compose();
      return;
    }
    if (chartId !== chart.id) {
      chartId = chart.id;
      reset();
    }
    if (timeMs + 32 < previousTime) rebuild(chart, timeMs);
    chart.sections.forEach((section) => {
      section.strokes.forEach((stroke) => {
        const progress = clamp((timeMs - stroke.startMs) / Math.max(1, stroke.endMs - stroke.startMs));
        const previous = paintedProgress.get(stroke.id) || 0;
        if (progress > previous) paintStroke(stroke, previous, progress, section);
        paintedProgress.set(stroke.id, progress);
      });
    });
    completionMask.clearRect(0, 0, width, height);
    chart.sections.forEach((section) => {
      const duration = Math.max(1, section.endMs - section.startMs);
      const completionStart = section.endMs - duration * 0.16;
      const amount = complete ? 1 : clamp((timeMs - completionStart) / Math.max(1, section.endMs - completionStart));
      paintSectionCompletion(section, amount);
    });
    dirty = true;
    previousTime = timeMs;
    compose();
  }

  reset();
  return { texture, update, reset, outputCanvas };
}

function makeSealTexture(THREE) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 256, 256);
  ctx.strokeStyle = "#9d2826";
  ctx.fillStyle = "#9d2826";
  ctx.lineWidth = 12;
  ctx.strokeRect(28, 28, 200, 200);
  ctx.lineWidth = 5;
  ctx.strokeRect(46, 46, 164, 164);
  ctx.font = '700 112px "Songti SC", "STSong", serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("韵", 128, 133);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeCeramicTexture(THREE) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(256, 256);
  for (let index = 0; index < image.data.length; index += 4) {
    const pixel = index / 4;
    const x = pixel % 256;
    const y = Math.floor(pixel / 256);
    const grain = (hash(x * 0.37 + y * 7.13) - 0.5) * 7;
    const wave = Math.sin(x * 0.055) * 2.2 + Math.sin(y * 0.041) * 1.8;
    const kilnCloud = Math.sin((x + y) * 0.018) * 1.4;
    const value = Math.round(232 + grain + wave + kilnCloud);
    image.data[index] = value;
    image.data[index + 1] = value;
    image.data[index + 2] = value;
    image.data[index + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 2);
  return texture;
}

function makeGlints(THREE) {
  const count = 240;
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * TAU * 7.3;
    const radius = 2.3 + ((index * 47) % 100) / 100 * 3.6;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = -2.2 + ((index * 71) % 100) / 100 * 5.6;
    positions[index * 3 + 2] = Math.sin(angle) * radius;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xa9ddf2,
    size: 0.022,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
  });
  return new THREE.Points(geometry, material);
}

function disposeScene(scene) {
  const materials = new Set();
  const textures = new Set();
  scene.traverse((object) => {
    object.geometry?.dispose?.();
    const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
    objectMaterials.filter(Boolean).forEach((material) => {
      materials.add(material);
      [material.map, material.alphaMap, material.normalMap, material.bumpMap, material.roughnessMap].filter(Boolean).forEach((texture) => textures.add(texture));
    });
  });
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
}

function createWebGLRenderer({ canvas }, THREE) {
  const webgl = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
  });
  webgl.outputColorSpace = THREE.SRGBColorSpace;
  webgl.toneMapping = THREE.ACESFilmicToneMapping;
  webgl.toneMappingExposure = 1.12;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#06141b");
  scene.fog = new THREE.FogExp2("#06141b", 0.075);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  camera.position.set(0, 0.08, 10.5);

  const world = new THREE.Group();
  scene.add(world);
  const vessel = new THREE.Group();
  world.add(vessel);

  const textureState = makeTextureState(THREE, webgl.capabilities.getMaxAnisotropy());
  const profileControls = [
    [0.5, -2.22], [0.62, -2.2], [0.82, -2.12], [1.02, -1.9], [1.16, -1.55],
    [1.25, -1.02], [1.29, -0.38], [1.27, 0.34], [1.2, 0.9], [1.08, 1.3],
    [0.91, 1.53], [0.68, 1.66], [0.5, 1.73], [0.45, 2.06], [0.49, 2.14], [0.58, 2.17],
  ].map(([radius, y]) => new THREE.Vector2(radius, y));
  const profile = new THREE.SplineCurve(profileControls).getPoints(46);
  const bodyGeometry = new THREE.LatheGeometry(profile, 128, Math.PI);
  const bodyPositions = bodyGeometry.getAttribute("position");
  const bodyUvs = bodyGeometry.getAttribute("uv");
  for (let index = 0; index < bodyPositions.count; index += 1) {
    bodyUvs.setY(index, clamp((bodyPositions.getY(index) + 2.22) / 4.4));
  }
  bodyUvs.needsUpdate = true;
  bodyGeometry.computeVertexNormals();
  const ceramicTexture = makeCeramicTexture(THREE);
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: textureState.texture,
    bumpMap: ceramicTexture,
    bumpScale: 0.0045,
    roughness: 0.3,
    metalness: 0,
    clearcoat: 0.84,
    clearcoatRoughness: 0.14,
    specularIntensity: 0.62,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.castShadow = true;
  body.receiveShadow = true;
  vessel.add(body);

  const porcelainMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf0f5f1,
    roughness: 0.29,
    metalness: 0,
    clearcoat: 0.84,
    clearcoatRoughness: 0.14,
  });
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.045, 16, 96), porcelainMaterial);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 2.18;
  vessel.add(rim);
  const innerNeck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.43, 0.45, 0.46, 96, 1, true),
    new THREE.MeshPhysicalMaterial({
      color: 0xc5dce4,
      roughness: 0.3,
      clearcoat: 0.72,
      side: THREE.BackSide,
    }),
  );
  innerNeck.position.y = 1.96;
  vessel.add(innerNeck);
  const mouth = new THREE.Mesh(
    new THREE.CircleGeometry(0.43, 96),
    new THREE.MeshStandardMaterial({ color: 0x18333d, roughness: 0.62, side: THREE.DoubleSide }),
  );
  mouth.rotation.x = -Math.PI / 2;
  mouth.position.y = 2.171;
  vessel.add(mouth);
  const foot = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.055, 14, 96), porcelainMaterial);
  foot.rotation.x = Math.PI / 2;
  foot.position.y = -2.2;
  vessel.add(foot);
  const base = new THREE.Mesh(new THREE.CircleGeometry(0.58, 96), porcelainMaterial);
  base.rotation.x = Math.PI / 2;
  base.position.y = -2.205;
  base.material.side = THREE.DoubleSide;
  vessel.add(base);

  const sealMaterial = new THREE.MeshBasicMaterial({
    map: makeSealTexture(THREE),
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const seal = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.72), sealMaterial);
  seal.rotation.x = Math.PI / 2;
  seal.rotation.z = -0.08;
  seal.position.y = -2.225;
  vessel.add(seal);

  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(1.42, 1.62, 0.14, 96),
    new THREE.MeshStandardMaterial({ color: 0x0b2632, roughness: 0.72, metalness: 0.12 }),
  );
  pedestal.position.y = -2.38;
  pedestal.receiveShadow = true;
  world.add(pedestal);

  const haloMaterial = new THREE.MeshBasicMaterial({
    color: 0x72c4e7,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const halo = new THREE.Mesh(new THREE.TorusGeometry(1.43, 0.012, 8, 160), haloMaterial);
  halo.rotation.x = Math.PI / 2;
  halo.position.y = -2.27;
  world.add(halo);

  const glints = makeGlints(THREE);
  scene.add(glints);
  scene.add(new THREE.HemisphereLight(0xc7e7f2, 0x06131a, 2.2));
  const key = new THREE.DirectionalLight(0xf4fbff, 4.2);
  key.position.set(3.5, 4.5, 5.5);
  key.castShadow = true;
  scene.add(key);
  const blueFill = new THREE.PointLight(0x2a8fc4, 8, 10, 2);
  blueFill.position.set(-3, 0.4, 3);
  scene.add(blueFill);
  const warmRim = new THREE.PointLight(0xe8bd82, 4.5, 9, 2);
  warmRim.position.set(3, -1.5, -2);
  scene.add(warmRim);

  const modelSize = new THREE.Box3().setFromObject(world).getSize(new THREE.Vector3());
  const targetCamera = new THREE.Vector3(0, 0.08, 10.5);
  const lookTarget = new THREE.Vector3(0, 0, 0);
  let currentIntensity = 1;
  let previousElapsed = 0;
  let currentFaceAngle = 0;
  let revealChart = null;
  let normalCameraZ = 10.5;
  let stampCameraZ = 9.4;
  let normalOffsetX = 0;
  let normalOffsetY = 0.08;
  let stampOffsetX = 0;
  let stampOffsetY = -0.9;
  let compactComposition = false;

  function measureGuide(selector, width, height) {
    const canvasRect = canvas.getBoundingClientRect();
    const guide = canvas.closest(".detail-view")?.querySelector(selector);
    const rect = guide?.getBoundingClientRect();
    if (!rect || !canvasRect.width || !canvasRect.height) {
      return { widthRatio: 0.82, heightRatio: 0.78, ndcX: 0, ndcY: 0 };
    }
    return {
      widthRatio: clamp(rect.width / canvasRect.width, 0.2, 1),
      heightRatio: clamp(rect.height / canvasRect.height, 0.2, 1),
      ndcX: ((rect.left + rect.width * 0.5 - canvasRect.left) / canvasRect.width) * 2 - 1,
      ndcY: 1 - ((rect.top + rect.height * 0.5 - canvasRect.top) / canvasRect.height) * 2,
    };
  }

  function fitGuide(guide, objectWidth, objectHeight, extraDistance = 0.8) {
    const verticalFov = THREE.MathUtils.degToRad(camera.fov);
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
    const safeX = Math.max(0.14, guide.widthRatio * 0.9);
    const safeY = Math.max(0.14, guide.heightRatio * 0.9);
    const verticalDistance = objectHeight * 0.5 / Math.max(0.08, Math.tan(verticalFov / 2) * safeY);
    const horizontalDistance = objectWidth * 0.5 / Math.max(0.08, Math.tan(horizontalFov / 2) * safeX);
    const z = clamp(Math.max(verticalDistance, horizontalDistance) + extraDistance, 8.2, 16.5);
    const visibleHeight = 2 * z * Math.tan(verticalFov / 2);
    const visibleWidth = visibleHeight * camera.aspect;
    return {
      z,
      x: -guide.ndcX * visibleWidth * 0.5,
      y: -guide.ndcY * visibleHeight * 0.5,
    };
  }

  function updateComposition(width, height) {
    const portrait = width < 720 && height >= width;
    const shortLandscape = height < 560 && width > height;
    compactComposition = portrait || shortLandscape;
    pedestal.visible = !compactComposition;
    const normalGuide = measureGuide("[data-porcelain-vessel-safe]", width, height);
    const stampGuide = measureGuide("[data-porcelain-stamp-safe]", width, height);
    const normalFit = fitGuide(normalGuide, modelSize.x, modelSize.y, 0.85);
    const tiltedHeight = modelSize.y * 0.66 + modelSize.z * 0.74;
    const stampFit = fitGuide(stampGuide, modelSize.x * 1.12, tiltedHeight, 0.95);
    normalCameraZ = normalFit.z;
    stampCameraZ = stampFit.z;
    normalOffsetX = normalFit.x;
    normalOffsetY = normalFit.y + (portrait ? -0.04 : 0.08);
    stampOffsetX = stampFit.x;
    stampOffsetY = stampFit.y - (shortLandscape ? 0.08 : 0.2);
    world.position.y = 0;
  }

  function clearReveal() {
    revealChart = null;
    textureState.reset();
  }

  return {
    resize({ width, height, dpr }) {
      webgl.setPixelRatio(Math.min(dpr, 1.75));
      webgl.setSize(Math.max(1, width), Math.max(1, height), false);
      camera.aspect = Math.max(1, width) / Math.max(1, height);
      camera.updateProjectionMatrix();
      updateComposition(width, height);
    },
    draw({ elapsed, intensity, state }) {
      const custom = state.custom || {};
      const seconds = elapsed * 0.001;
      const delta = Math.min(0.05, Math.max(0.001, (elapsed - previousElapsed) * 0.001));
      previousElapsed = elapsed;
      currentIntensity = intensity;

      const previewProgress = (seconds % 11) / 11;
      const detailActive = Boolean(custom.detailActive);
      const chart = custom.chart || (!detailActive ? PREVIEW_CHART : null);
      const progress = detailActive ? clamp(custom.progress || 0) : previewProgress;
      const timeMs = detailActive
        ? Math.max(0, custom.currentTimeMs || 0)
        : previewProgress * (chart?.durationMs || 11000);
      if (chart) {
        revealChart = chart;
        textureState.update(chart, timeMs, Boolean(custom.completed || progress >= 0.999));
      } else if (revealChart) {
        clearReveal();
      }

      const previewSectionIndex = chart?.sections?.length
        ? Math.min(chart.sections.length - 1, Math.floor(previewProgress * chart.sections.length))
        : 0;
      const section = chart?.sections?.[detailActive ? (custom.chapterIndex || 0) : previewSectionIndex];
      const desiredFace = FACE_ANGLES[section?.workFace] ?? Math.sin(seconds * 0.18) * 0.28;
      currentFaceAngle += (desiredFace - currentFaceAngle) * Math.min(1, delta * 2.8);
      vessel.rotation.y = currentFaceAngle + (detailActive ? 0 : seconds * 0.12);

      const phase = custom.phase || "idle";
      const showingBase = phase === "stamping";
      const result = phase === "result";
      const desiredTilt = showingBase ? -0.95 : -0.04;
      world.rotation.x += (desiredTilt - world.rotation.x) * Math.min(1, delta * 2.5);
      world.rotation.z = Math.sin(seconds * 0.22) * 0.015;

      targetCamera.set(
        showingBase ? stampOffsetX : normalOffsetX,
        showingBase ? stampOffsetY : normalOffsetY,
        showingBase ? stampCameraZ : normalCameraZ,
      );
      lookTarget.set(
        showingBase ? stampOffsetX : normalOffsetX,
        (showingBase ? stampOffsetY : normalOffsetY) - (showingBase ? 0.2 : 0.08),
        0,
      );
      camera.position.lerp(targetCamera, Math.min(1, delta * 2.4));
      camera.lookAt(lookTarget);

      const beatPulse = clamp(custom.beatPulse || 0);
      const musicLevel = detailActive ? clamp(custom.musicLevel || 0) : 0.25 + Math.sin(seconds * 2.2) * 0.08;
      const treble = detailActive ? clamp(custom.treble || 0) : 0.25;
      const breathing = 1 + Math.sin(seconds * 1.7) * 0.006 + beatPulse * 0.012;
      vessel.scale.setScalar(breathing);
      bodyMaterial.clearcoat = clamp(0.8 + progress * 0.06, 0.8, 0.87);
      bodyMaterial.clearcoatRoughness = clamp(0.16 - progress * 0.025, 0.125, 0.16);
      bodyMaterial.emissive.setRGB(0.003, 0.006, 0.008);
      bodyMaterial.emissiveIntensity = 0.04;
      halo.scale.setScalar(0.86 + progress * 0.2 + beatPulse * 0.16);
      halo.material.opacity = (0.08 + musicLevel * 0.2 + beatPulse * 0.28) * currentIntensity;
      halo.rotation.z += delta * (0.12 + musicLevel * 0.22);
      glints.rotation.y += delta * (0.012 + treble * 0.025);
      glints.material.opacity = (0.18 + treble * 0.44 + (result ? 0.16 : 0)) * Math.min(1.3, currentIntensity);
      seal.material.opacity += ((custom.stamped ? 1 : 0) - seal.material.opacity) * Math.min(1, delta * 5.5);
      seal.scale.setScalar(1 + beatPulse * 0.04);
      webgl.toneMappingExposure = 0.98 + currentIntensity * 0.14 + musicLevel * 0.08;
      webgl.render(scene, camera);
    },
    setIntensity(value) {
      currentIntensity = value;
    },
    replay() {
      previousElapsed = 0;
      currentFaceAngle = 0;
      clearReveal();
    },
    destroy() {
      disposeScene(scene);
      textureState.texture.dispose();
      webgl.dispose();
      webgl.forceContextLoss();
    },
  };
}

function createCanvasFallback(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const patternCanvas = document.createElement("canvas");
  patternCanvas.width = 1024;
  patternCanvas.height = 512;
  paintPattern(patternCanvas.getContext("2d"), patternCanvas.width, patternCanvas.height);
  let dpr = 1;
  return {
    resize({ width, height, dpr: nextDpr }) {
      dpr = nextDpr;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },
    draw({ elapsed, width, height, state }) {
      const custom = state.custom || {};
      const progress = custom.detailActive ? clamp(custom.progress || 0) : (elapsed % 11000) / 11000;
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      ctx.fillStyle = "#06141b";
      ctx.fillRect(0, 0, width, height);
      const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(width, height) * 0.55);
      glow.addColorStop(0, "rgba(66,145,181,.24)");
      glow.addColorStop(1, "rgba(6,20,27,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      ctx.translate(centerX, centerY - 10);
      const scale = Math.min(width, height) / 620;
      ctx.scale(scale, scale);
      ctx.beginPath();
      ctx.moveTo(-70, -210);
      ctx.bezierCurveTo(-66, -130, -155, -115, -155, 30);
      ctx.bezierCurveTo(-155, 170, -110, 225, 0, 230);
      ctx.bezierCurveTo(110, 225, 155, 170, 155, 30);
      ctx.bezierCurveTo(155, -115, 66, -130, 70, -210);
      ctx.closePath();
      const porcelain = ctx.createLinearGradient(-155, 0, 155, 0);
      porcelain.addColorStop(0, "#b9d4df");
      porcelain.addColorStop(0.42, "#f7fbfc");
      porcelain.addColorStop(1, "#aac9d6");
      ctx.fillStyle = porcelain;
      ctx.fill();
      ctx.clip();
      ctx.globalAlpha = clamp(progress * 1.22);
      ctx.drawImage(patternCanvas, 0, 0, patternCanvas.width, patternCanvas.height, -178, -220, 356, 452);
      const glaze = ctx.createLinearGradient(-155, 0, 155, 0);
      glaze.addColorStop(0, "rgba(255,255,255,0)");
      glaze.addColorStop(0.46, "rgba(255,255,255,0.28)");
      glaze.addColorStop(0.62, "rgba(255,255,255,0.04)");
      glaze.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = glaze;
      ctx.fillRect(-155, -220, 310, 450);
      ctx.restore();
    },
    replay() {},
    destroy() {},
  };
}

export function createRenderer(options) {
  let delegate = null;
  let latestResize = null;
  let latestFrame = null;
  let latestIntensity = options.intensity || 1;
  let replayPending = false;
  let destroyed = false;

  import("three")
    .then((THREE) => {
      if (destroyed) return;
      delegate = createWebGLRenderer(options, THREE);
      if (latestResize) delegate.resize?.(latestResize);
      delegate.setIntensity?.(latestIntensity);
      if (replayPending) delegate.replay?.();
      if (latestFrame) delegate.draw?.(latestFrame);
    })
    .catch((error) => {
      console.error("Unable to load the porcelain-song-reveal WebGL renderer.", error);
      if (destroyed) return;
      delegate = createCanvasFallback(options.canvas);
      if (latestResize) delegate?.resize?.(latestResize);
      if (latestFrame) delegate?.draw?.(latestFrame);
    });

  return {
    resize(args) {
      latestResize = args;
      delegate?.resize?.(args);
    },
    draw(args) {
      latestFrame = args;
      delegate?.draw?.(args);
    },
    setIntensity(value) {
      latestIntensity = value;
      delegate?.setIntensity?.(value);
    },
    replay(args) {
      replayPending = true;
      delegate?.replay?.(args);
    },
    destroy() {
      destroyed = true;
      delegate?.destroy?.();
      delegate = null;
    },
  };
}

export function draw(ctx, width, height, elapsed, intensity, state) {
  const fallback = createCanvasFallback(ctx.canvas);
  fallback?.resize({ width, height, dpr: 1 });
  fallback?.draw({ elapsed, width, height, intensity, state });
}
