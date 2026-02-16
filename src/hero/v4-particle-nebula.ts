// V4: Particle Nebula
// Off: sparse cosmic dust, solid muted text
// On: dense nebula cloud, text emits glowing particles, deep space backdrop
// Broken: supernova explosion, text disintegrates into expanding dust cloud

import {
  THREE, RAPIER, LIGHT, SHINY,
  HeroMode, layoutBalls, getBirthdaySpecs,
  setupScene, fitCamera, addWalls, createBalls, setupGrabHandlers,
  VFOV, BALL_RADIUS_FACTOR,
} from "./variations";

const NEBULA_PARTICLE_COUNT = 200;

export function initV4(container: HTMLElement, name: string, dob: string) {
  let disposed = false;
  let mode: HeroMode = "off";
  let frame = 0;
  const startTime = performance.now();

  const { scene, camera, renderer, composer, bloomPass, w, h } = setupScene(container);
  renderer.setClearColor(0xfafafa);

  const world = new RAPIER.World({ x: 0, y: 0, z: 0 });
  const specs = getBirthdaySpecs(name, dob);
  const { balls, maxW, totalH } = layoutBalls(specs);
  const { bodies, meshes } = createBalls(balls, world, scene);
  const aspect = w / h;
  const camDist = fitCamera(camera, maxW, totalH, aspect);
  addWalls(world, camera, aspect);
  const { grabbed, target, cleanup: grabCleanup } = setupGrabHandlers(renderer.domElement, camera, bodies, w, h);

  const colorIndices = balls.map(b => b.colorIndex);
  const origins = bodies.map(b => {
    const t = b.translation();
    return { x: t.x, y: t.y, z: t.z };
  });
  const phases = new Float32Array(meshes.length);
  for (let i = 0; i < phases.length; i++) phases[i] = Math.random() * Math.PI * 2;

  const vRad = (VFOV * Math.PI) / 180;
  const visH = 2 * camDist * Math.tan(vRad / 2);
  const visW = visH * aspect;

  // Nebula particles
  const nebulaPositions = new Float32Array(NEBULA_PARTICLE_COUNT * 3);
  const nebulaVelocities = new Float32Array(NEBULA_PARTICLE_COUNT * 3);
  const nebulaColors = new Float32Array(NEBULA_PARTICLE_COUNT * 3);
  const nebulaSizes = new Float32Array(NEBULA_PARTICLE_COUNT);

  for (let i = 0; i < NEBULA_PARTICLE_COUNT; i++) {
    nebulaPositions[i * 3] = (Math.random() - 0.5) * visW * 1.2;
    nebulaPositions[i * 3 + 1] = (Math.random() - 0.5) * visH * 1.2;
    nebulaPositions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    nebulaVelocities[i * 3] = (Math.random() - 0.5) * 0.01;
    nebulaVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
    nebulaVelocities[i * 3 + 2] = 0;
    // Soft pastel colors for off mode
    nebulaColors[i * 3] = 0.5 + Math.random() * 0.2;
    nebulaColors[i * 3 + 1] = 0.5 + Math.random() * 0.2;
    nebulaColors[i * 3 + 2] = 0.6 + Math.random() * 0.2;
    nebulaSizes[i] = 0.1 + Math.random() * 0.2;
  }

  const nebulaGeo = new THREE.BufferGeometry();
  nebulaGeo.setAttribute("position", new THREE.BufferAttribute(nebulaPositions, 3));
  nebulaGeo.setAttribute("color", new THREE.BufferAttribute(nebulaColors, 3));

  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.2, "rgba(255,255,255,0.8)");
  grad.addColorStop(0.5, "rgba(255,255,255,0.3)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const particleTexture = new THREE.CanvasTexture(canvas);

  const nebulaMat = new THREE.PointsMaterial({
    size: 0.2,
    map: particleTexture,
    transparent: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.15,
  });
  const nebulaPoints = new THREE.Points(nebulaGeo, nebulaMat);
  scene.add(nebulaPoints);

  // Star field (tiny white dots in background)
  const STAR_COUNT = 100;
  const starPositions = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * visW * 1.5;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * visH * 1.5;
    starPositions[i * 3 + 2] = -3 - Math.random() * 3;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({ size: 0.06, color: 0x888888, transparent: true, opacity: 0.2, depthWrite: false });
  const starPoints = new THREE.Points(starGeo, starMat);
  scene.add(starPoints);

  let spinAngle = 0;
  const _yAxis = new THREE.Vector3(0, 1, 0);
  const _spinQuat = new THREE.Quaternion();
  const _vec3 = new THREE.Vector3();

  let dragActive = false;
  let lastX = 0;
  function onPointerDown(e: PointerEvent) { dragActive = true; lastX = e.clientX; }
  function onPointerMove(e: PointerEvent) {
    if (!dragActive) return;
    spinAngle += (e.clientX - lastX) * 0.01;
    lastX = e.clientX;
  }
  function onPointerUp() { dragActive = false; }
  container.addEventListener("pointerdown", onPointerDown);
  container.addEventListener("pointermove", onPointerMove);
  container.addEventListener("pointerup", onPointerUp);

  let visible = true;
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !frame) frame = requestAnimationFrame(animate);
  }, { threshold: 0 });
  observer.observe(container);

  let explosionTime = 0;

  function animate() {
    if (!visible || disposed) { frame = 0; return; }
    const elapsed = (performance.now() - startTime) / 1000;

    for (const body of grabbed) {
      const pos = body.translation();
      body.setLinvel({ x: (target.x - pos.x) * 12, y: (target.y - pos.y) * 12, z: 0 }, true);
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    if (mode !== "broken" && grabbed.length === 0) {
      for (let i = 0; i < bodies.length; i++) {
        const pos = bodies[i].translation();
        const orig = origins[i];
        bodies[i].setLinvel({ x: (orig.x - pos.x) * 20, y: (orig.y - pos.y) * 20, z: -pos.z * 20 }, true);
      }
    }

    world.step();
    _spinQuat.setFromAxisAngle(_yAxis, spinAngle);
    for (let i = 0; i < bodies.length; i++) {
      const pos = bodies[i].translation();
      _vec3.set(pos.x, pos.y, pos.z).applyQuaternion(_spinQuat);
      meshes[i].position.copy(_vec3);
    }

    // Animate nebula particles
    const posAttr = nebulaGeo.getAttribute("position") as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;
    const speedMult = mode === "on" ? 3 : mode === "broken" ? 8 : 1;

    for (let i = 0; i < NEBULA_PARTICLE_COUNT; i++) {
      pos[i * 3] += nebulaVelocities[i * 3] * speedMult;
      pos[i * 3 + 1] += nebulaVelocities[i * 3 + 1] * speedMult;

      // Wrap around
      if (Math.abs(pos[i * 3]) > visW) pos[i * 3] *= -0.9;
      if (Math.abs(pos[i * 3 + 1]) > visH) pos[i * 3 + 1] *= -0.9;

      if (mode === "broken") {
        // Expand outward from center
        const dx = pos[i * 3];
        const dy = pos[i * 3 + 1];
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
        pos[i * 3] += (dx / dist) * 0.1;
        pos[i * 3 + 1] += (dy / dist) * 0.1;
      }
    }
    posAttr.needsUpdate = true;

    if (mode === "on") {
      nebulaMat.opacity = 0.5 + 0.15 * Math.sin(elapsed * 0.5);
      for (let i = 0; i < meshes.length; i++) {
        const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = 0.4 + 0.3 * Math.sin(elapsed * 1.2 + phases[i]);
      }
      starMat.opacity = 0.6 + 0.2 * Math.sin(elapsed * 0.3);
    }

    if (mode === "broken") {
      // Pulsing bloom
      const t = elapsed - explosionTime;
      bloomPass.strength = Math.max(0.3, 2.0 - t * 0.3);
      nebulaMat.opacity = Math.min(1, 0.7 + t * 0.1);
    }

    composer.render();
    frame = requestAnimationFrame(animate);
  }

  frame = requestAnimationFrame(animate);

  return {
    setMode(newMode: HeroMode) {
      mode = newMode;
      if (newMode === "on") {
        renderer.setClearColor(0x050510);
        bloomPass.strength = 0.8;
        bloomPass.radius = 0.5;
        bloomPass.threshold = 0.2;
        // Cosmic palette
        const COSMIC = [0xaa66ff, 0xff66aa, 0x66aaff, 0xff88cc, 0x88ccff, 0xcc88ff, 0xff99bb, 0x77bbff, 0xbb77ff, 0xff77aa];
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          const hex = COSMIC[colorIndices[i]];
          mat.color.setHex(hex);
          mat.emissive.setHex(hex);
          mat.emissiveIntensity = 0.4;
          mat.roughness = 0.2;
          mat.metalness = 0.5;
          mat.clearcoat = 0.8;
        }
        // Nebula colors go cosmic
        const colAttr = nebulaGeo.getAttribute("color") as THREE.BufferAttribute;
        const cols = colAttr.array as Float32Array;
        for (let i = 0; i < NEBULA_PARTICLE_COUNT; i++) {
          const r = Math.random();
          if (r > 0.6) { cols[i*3]=0.7; cols[i*3+1]=0.3; cols[i*3+2]=1; }
          else if (r > 0.3) { cols[i*3]=1; cols[i*3+1]=0.4; cols[i*3+2]=0.7; }
          else { cols[i*3]=0.4; cols[i*3+1]=0.6; cols[i*3+2]=1; }
        }
        colAttr.needsUpdate = true;
        nebulaMat.size = 0.4;
        starMat.opacity = 0.6;
        starMat.color.setHex(0xffffff);
      } else if (newMode === "off") {
        renderer.setClearColor(0xfafafa);
        bloomPass.strength = 0;
        nebulaMat.opacity = 0.15;
        nebulaMat.size = 0.2;
        starMat.opacity = 0.2;
        starMat.color.setHex(0x888888);
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          mat.color.setHex(LIGHT.hex[colorIndices[i]]);
          mat.emissive.setHex(0x000000);
          mat.emissiveIntensity = 0;
          mat.roughness = 0.4;
          mat.metalness = 0.15;
          mat.clearcoat = 0.3;
        }
      } else if (newMode === "broken") {
        explosionTime = (performance.now() - startTime) / 1000;
        renderer.setClearColor(0x0a0008);
        bloomPass.strength = 2.0;
        bloomPass.radius = 0.8;
        bloomPass.threshold = 0.1;
        // Supernova: hot white/orange/red
        const NOVA = [0xffffff, 0xffaa44, 0xff6622, 0xffcc66, 0xff4411, 0xffdd88, 0xff8833, 0xffee99, 0xff5522, 0xffbb55];
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          const hex = NOVA[colorIndices[i]];
          mat.color.setHex(hex);
          mat.emissive.setHex(hex);
          mat.emissiveIntensity = 1.2;
        }
        // Explosion physics
        world.gravity = { x: 0, y: 0, z: 0 }; // Zero-g supernova
        for (const body of bodies) {
          body.wakeUp();
          const pos = body.translation();
          const dx = pos.x, dy = pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
          body.setLinvel({
            x: (dx / dist) * 40 + (Math.random() - 0.5) * 10,
            y: (dy / dist) * 40 + (Math.random() - 0.5) * 10,
            z: (Math.random() - 0.5) * 20,
          }, true);
          body.setAngvel({
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 10,
            z: (Math.random() - 0.5) * 10,
          }, true);
        }
        // Boost nebula velocities outward
        for (let i = 0; i < NEBULA_PARTICLE_COUNT; i++) {
          nebulaVelocities[i * 3] = (Math.random() - 0.5) * 0.1;
          nebulaVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
        }
      }
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      grabCleanup();
      observer.disconnect();
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) container.removeChild(renderer.domElement);
      world.free();
    },
  };
}
