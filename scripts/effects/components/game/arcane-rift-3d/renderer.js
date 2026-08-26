function makeParticleTexture(THREE) {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 64;
  textureCanvas.height = 64;
  const ctx = textureCanvas.getContext("2d");
  const glow = ctx.createRadialGradient(32, 32, 0, 32, 32, 31);
  glow.addColorStop(0, "rgba(255,255,255,1)");
  glow.addColorStop(0.16, "rgba(194,248,255,0.95)");
  glow.addColorStop(0.48, "rgba(92,198,255,0.42)");
  glow.addColorStop(1, "rgba(34,101,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeStarField(THREE, cyan, violet) {
  const count = 420;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = 3.6 + Math.random() * 9;
    const angle = Math.random() * Math.PI * 2;
    const elevation = (Math.random() - 0.5) * Math.PI;
    positions[i * 3] = Math.cos(angle) * Math.cos(elevation) * radius;
    positions[i * 3 + 1] = Math.sin(elevation) * radius * 0.65;
    positions[i * 3 + 2] = Math.sin(angle) * Math.cos(elevation) * radius;
    const color = cyan.clone().lerp(violet, Math.random());
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return new THREE.Points(geometry, new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.022,
    vertexColors: true,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
  }));
}

function makeParticleSystem(THREE, Quarks, { texture, burst = false }) {
  const {
    Bezier,
    ColorRange,
    ConstantValue,
    IntervalValue,
    OrbitOverLife,
    ParticleSystem,
    PiecewiseBezier,
    RenderMode,
    SizeOverLife,
    SphereEmitter,
  } = Quarks;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0xffffff,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const color = burst
    ? new ColorRange(new THREE.Vector4(0.78, 0.95, 1, 1), new THREE.Vector4(0.68, 0.25, 1, 1))
    : new ColorRange(new THREE.Vector4(0.2, 0.82, 1, 0.9), new THREE.Vector4(0.62, 0.28, 1, 0.82));
  const behaviors = [
    new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.92, 0.35, 0.04), 0]])),
  ];
  if (!burst) behaviors.push(new OrbitOverLife(new ConstantValue(1.55), new THREE.Vector3(0, 0, 1)));

  return new ParticleSystem({
    duration: burst ? 0.72 : 4,
    looping: !burst,
    startLife: new IntervalValue(burst ? 0.65 : 1.4, burst ? 1.4 : 2.8),
    startSpeed: new IntervalValue(burst ? 1.4 : 0.18, burst ? 3.8 : 0.58),
    startSize: new IntervalValue(burst ? 0.07 : 0.06, burst ? 0.2 : 0.17),
    startColor: color,
    emissionOverTime: new ConstantValue(burst ? 0 : 62),
    emissionBursts: burst ? [{ time: 0, count: new ConstantValue(150), cycle: 1, interval: 0, probability: 1 }] : [],
    shape: new SphereEmitter({ radius: burst ? 0.12 : 1.25, thickness: burst ? 1 : 0.3 }),
    material,
    renderMode: RenderMode.BillBoard,
    behaviors,
    worldSpace: true,
  });
}

function disposeScene(scene) {
  const materials = new Set();
  const textures = new Set();
  scene.traverse((object) => {
    object.geometry?.dispose?.();
    const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
    objectMaterials.filter(Boolean).forEach((material) => {
      materials.add(material);
      if (material.map) textures.add(material.map);
    });
  });
  materials.forEach((material) => material.dispose());
  textures.forEach((texture) => texture.dispose());
}

function createWebGLRenderer({ canvas }, THREE, Quarks) {
  const { BatchedRenderer } = Quarks;
  const cyan = new THREE.Color("#62efff");
  const violet = new THREE.Color("#ad6bff");
  const webgl = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  webgl.outputColorSpace = THREE.SRGBColorSpace;
  webgl.toneMapping = THREE.ACESFilmicToneMapping;
  webgl.toneMappingExposure = 1.24;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#010207");
  scene.fog = new THREE.FogExp2("#030510", 0.105);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
  camera.position.set(0, 0.15, 6.4);

  const world = new THREE.Group();
  world.rotation.x = -0.12;
  scene.add(world);

  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: "#091122",
    emissive: "#18bfe8",
    emissiveIntensity: 1.35,
    roughness: 0.24,
    metalness: 0.48,
    clearcoat: 1,
    clearcoatRoughness: 0.16,
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.58, 2), coreMaterial);
  world.add(core);

  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.78, 2),
    new THREE.MeshBasicMaterial({ color: "#91f6ff", wireframe: true, transparent: true, opacity: 0.2 }),
  );
  world.add(shell);

  const ringMaterials = ["#69e9ff", "#9a6dff", "#d5faff"].map((color, index) => new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.4 - index * 0.07,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  const rings = ringMaterials.map((material, index) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.12 + index * 0.34, 0.018 + index * 0.006, 8, 120), material);
    ring.rotation.set(0.58 + index * 0.42, index * 0.68, index * 0.27);
    world.add(ring);
    return ring;
  });

  const grid = new THREE.GridHelper(14, 28, 0x21465c, 0x10212c);
  grid.position.y = -2.15;
  grid.material.transparent = true;
  grid.material.opacity = 0.32;
  world.add(grid);

  const stars = makeStarField(THREE, cyan, violet);
  scene.add(stars);
  scene.add(new THREE.AmbientLight(0x6ea7c4, 0.65));
  const keyLight = new THREE.PointLight(0x86eeff, 9, 12, 2);
  keyLight.position.set(2.5, 3, 4);
  scene.add(keyLight);
  const fillLight = new THREE.PointLight(0xa54dff, 7, 10, 2);
  fillLight.position.set(-3, -1.5, 2);
  scene.add(fillLight);

  const batch = new BatchedRenderer();
  scene.add(batch);
  const particleTexture = makeParticleTexture(THREE);
  const orbitParticles = makeParticleSystem(THREE, Quarks, { texture: particleTexture });
  const burstParticles = makeParticleSystem(THREE, Quarks, { texture: particleTexture, burst: true });
  world.add(orbitParticles.emitter);
  world.add(burstParticles.emitter);
  batch.addSystem(orbitParticles);
  batch.addSystem(burstParticles);

  const pulseMaterial = new THREE.MeshBasicMaterial({
    color: "#8eeeff",
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const pulse = new THREE.Mesh(new THREE.RingGeometry(0.72, 0.77, 96), pulseMaterial);
  pulse.visible = false;
  world.add(pulse);

  const targetRotation = new THREE.Vector2();
  let previousElapsed = 0;
  let pulseStartedAt = -1;
  let currentIntensity = 1;

  function triggerBurst(x = 0, y = 0, elapsed = previousElapsed) {
    burstParticles.emitter.position.set(x, y, 0.12);
    burstParticles.restart();
    pulse.position.copy(burstParticles.emitter.position);
    pulse.scale.setScalar(0.25);
    pulse.material.opacity = 0.88;
    pulse.visible = true;
    pulseStartedAt = elapsed;
  }

  triggerBurst();

  return {
    resize({ width, height, dpr }) {
      webgl.setPixelRatio(Math.min(dpr, 1.75));
      webgl.setSize(Math.max(1, width), Math.max(1, height), false);
      camera.aspect = Math.max(1, width) / Math.max(1, height);
      camera.updateProjectionMatrix();
    },
    draw({ elapsed, intensity, state }) {
      const seconds = elapsed * 0.001;
      const delta = Math.min(0.05, Math.max(0.001, (elapsed - previousElapsed) * 0.001));
      previousElapsed = elapsed;
      currentIntensity = intensity;

      const pointerX = state.pointer.active ? state.pointer.x / Math.max(1, canvas.clientWidth) * 2 - 1 : Math.sin(seconds * 0.31) * 0.18;
      const pointerY = state.pointer.active ? state.pointer.y / Math.max(1, canvas.clientHeight) * 2 - 1 : Math.cos(seconds * 0.27) * 0.12;
      targetRotation.set(pointerY * 0.22, pointerX * 0.34);
      world.rotation.x += (-0.12 + targetRotation.x - world.rotation.x) * 0.045;
      world.rotation.y += (targetRotation.y - world.rotation.y) * 0.045;
      world.rotation.z = Math.sin(seconds * 0.2) * 0.045;

      core.rotation.x = seconds * 0.32;
      core.rotation.y = seconds * 0.48;
      const coreScale = 1 + Math.sin(seconds * 2.6) * 0.055 * intensity;
      core.scale.setScalar(coreScale);
      shell.rotation.x = -seconds * 0.25;
      shell.rotation.y = seconds * 0.38;
      rings.forEach((ring, index) => {
        ring.rotation.z += delta * (0.18 + index * 0.12) * (index % 2 ? -1 : 1);
        ring.material.opacity = (0.28 + Math.sin(seconds * (1.2 + index * 0.16) + index) * 0.11) * Math.min(1.2, intensity);
      });
      stars.rotation.y = seconds * 0.018;
      stars.rotation.z = -seconds * 0.012;

      if (pulse.visible) {
        const age = Math.max(0, (elapsed - pulseStartedAt) / 1000);
        pulse.scale.setScalar(0.25 + age * (3.2 + currentIntensity));
        pulse.material.opacity = Math.max(0, 0.86 * (1 - age / 0.95));
        if (age > 0.95) pulse.visible = false;
      }

      batch.update(delta * Math.min(1.6, 0.7 + intensity * 0.3));
      webgl.render(scene, camera);
    },
    onPointerDown({ point }) {
      const x = (point.x / Math.max(1, canvas.clientWidth) * 2 - 1) * 1.9;
      const y = -(point.y / Math.max(1, canvas.clientHeight) * 2 - 1) * 1.15;
      triggerBurst(x, y);
    },
    setIntensity(value) {
      currentIntensity = value;
      webgl.toneMappingExposure = 0.95 + value * 0.29;
    },
    replay() {
      previousElapsed = 0;
      orbitParticles.restart();
      triggerBurst(0, 0, 0);
    },
    destroy() {
      orbitParticles.dispose();
      burstParticles.dispose();
      disposeScene(scene);
      webgl.dispose();
      webgl.forceContextLoss();
    },
  };
}

function createCanvasFallback(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  let dpr = 1;
  return {
    resize({ width, height, dpr: nextDpr }) {
      dpr = nextDpr;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },
    draw({ elapsed, width, height, intensity, state }) {
      draw(ctx, width, height, elapsed, intensity, state);
    },
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

  Promise.all([import("three"), import("three.quarks")])
    .then(([THREE, Quarks]) => {
      if (destroyed) return;
      delegate = createWebGLRenderer(options, THREE, Quarks);
      if (latestResize) delegate.resize?.(latestResize);
      delegate.setIntensity?.(latestIntensity);
      if (replayPending) delegate.replay?.();
      if (latestFrame) delegate.draw?.(latestFrame);
    })
    .catch((error) => {
      console.error("Unable to load the arcane-rift-3d WebGL renderer.", error);
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
    onPointerMove(args) {
      delegate?.onPointerMove?.(args);
    },
    onPointerDown(args) {
      delegate?.onPointerDown?.(args);
    },
    onPointerUp(args) {
      delegate?.onPointerUp?.(args);
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

export function draw(ctx, w, h, t, intensity, state) {
  ctx.fillStyle = "#010207";
  ctx.fillRect(0, 0, w, h);
  const x = state.pointer.active ? state.pointer.x : w * 0.5;
  const y = state.pointer.active ? state.pointer.y : h * 0.5;
  const radius = Math.min(w, h) * (0.14 + Math.sin(t * 0.002) * 0.012);
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
  glow.addColorStop(0, `rgba(225,250,255,${0.9 * intensity})`);
  glow.addColorStop(0.18, "rgba(74,221,255,0.52)");
  glow.addColorStop(0.48, "rgba(153,83,255,0.2)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(126,232,255,0.72)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(x, y, radius * (1 + i * 0.48), radius * (0.42 + i * 0.16), t * 0.0002 + i, 0, Math.PI * 2);
    ctx.stroke();
  }
}
