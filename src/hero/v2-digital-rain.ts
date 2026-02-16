// V2: Digital Rain
// Off: clean solid text, very faint falling digits in background
// On: full matrix rain, text glows green/cyan, scanline sweep
// Broken: rain corrupts to random chars, text glitches & dissolves

import {
  THREE, RAPIER, LIGHT, SHINY,
  HeroMode, layoutBalls, getBirthdaySpecs,
  setupScene, fitCamera, addWalls, createBalls, setupGrabHandlers,
  VFOV, BALL_RADIUS_FACTOR,
} from "./variations";

export function initV2(container: HTMLElement, name: string, dob: string) {
  let disposed = false;
  let mode: HeroMode = "off";
  let frame = 0;
  const startTime = performance.now();

  const { scene, camera, renderer, composer, bloomPass, w, h } = setupScene(container);
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

  // Rain columns — canvas texture rendered onto plane behind text
  const vRad = (VFOV * Math.PI) / 180;
  const visH = 2 * camDist * Math.tan(vRad / 2);
  const visW = visH * aspect;

  const rainCanvas = document.createElement("canvas");
  const RAIN_RES = 512;
  rainCanvas.width = RAIN_RES;
  rainCanvas.height = RAIN_RES;
  const rctx = rainCanvas.getContext("2d")!;
  const rainTexture = new THREE.CanvasTexture(rainCanvas);
  rainTexture.minFilter = THREE.LinearFilter;

  const rainPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(visW * 1.2, visH * 1.2),
    new THREE.MeshBasicMaterial({ map: rainTexture, transparent: true, opacity: 0.15, depthWrite: false }),
  );
  rainPlane.position.z = -2;
  scene.add(rainPlane);

  // Rain state
  const COLS = 40;
  const COL_W = RAIN_RES / COLS;
  const rainDrops = new Float32Array(COLS);
  const rainSpeeds = new Float32Array(COLS);
  const CHARS = "01アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF";
  for (let i = 0; i < COLS; i++) {
    rainDrops[i] = Math.random() * RAIN_RES;
    rainSpeeds[i] = 2 + Math.random() * 4;
  }

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

  let glitchTimer = 0;
  let glitchActive = false;

  function drawRain(elapsed: number) {
    const isOn = mode === "on";
    const isBroken = mode === "broken";

    rctx.fillStyle = isOn || isBroken ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.12)";
    rctx.fillRect(0, 0, RAIN_RES, RAIN_RES);

    const fontSize = Math.floor(COL_W * 0.8);
    rctx.font = `${fontSize}px "Space Mono", monospace`;

    for (let i = 0; i < COLS; i++) {
      rainDrops[i] += rainSpeeds[i] * (isBroken ? 3 : 1);
      if (rainDrops[i] > RAIN_RES) {
        rainDrops[i] = 0;
        rainSpeeds[i] = 2 + Math.random() * 4;
      }

      const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
      const x = i * COL_W;
      const y = rainDrops[i];

      if (isBroken) {
        // Glitchy red/yellow corruption
        const r = Math.random();
        rctx.fillStyle = r > 0.5 ? `rgba(255, 50, 50, ${0.6 + Math.random() * 0.4})` : `rgba(255, 200, 0, ${0.4 + Math.random() * 0.4})`;
      } else if (isOn) {
        rctx.fillStyle = `rgba(0, 255, 100, ${0.6 + Math.random() * 0.4})`;
      } else {
        rctx.fillStyle = `rgba(100, 100, 100, ${0.15 + Math.random() * 0.1})`;
      }
      rctx.fillText(ch, x, y);
    }
    rainTexture.needsUpdate = true;
  }

  function animate() {
    if (!visible || disposed) { frame = 0; return; }
    const elapsed = (performance.now() - startTime) / 1000;

    drawRain(elapsed);

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

    if (mode === "on") {
      rainPlane.material.opacity = 0.7;
      for (let i = 0; i < meshes.length; i++) {
        const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = 0.4 + 0.3 * Math.sin(elapsed * 2 + phases[i]);
      }
    }

    if (mode === "broken") {
      rainPlane.material.opacity = 0.9;
      // Periodic glitch: randomly teleport some balls
      glitchTimer += 1;
      if (glitchTimer % 15 === 0) {
        const idx = Math.floor(Math.random() * bodies.length);
        const body = bodies[idx];
        const mat = meshes[idx].material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = 2;
        setTimeout(() => { mat.emissiveIntensity = 0.3; }, 100);
        body.setLinvel({
          x: (Math.random() - 0.5) * 20,
          y: (Math.random() - 0.5) * 20,
          z: (Math.random() - 0.5) * 5,
        }, true);
      }
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
        bloomPass.radius = 0.3;
        bloomPass.threshold = 0.3;
        const MATRIX_GREEN = [0x00ff88, 0x00ffaa, 0x00ff66, 0x33ff99, 0x00ffcc, 0x22ff77, 0x00ff55, 0x11ff88, 0x00ffbb, 0x44ff88];
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          const hex = MATRIX_GREEN[colorIndices[i]];
          mat.color.setHex(hex);
          mat.emissive.setHex(hex);
          mat.emissiveIntensity = 0.4;
          mat.roughness = 0.2;
          mat.metalness = 0.3;
          mat.clearcoat = 0;
        }
      } else if (newMode === "off") {
        renderer.setClearColor(0xffffff);
        bloomPass.strength = 0;
        rainPlane.material.opacity = 0.15;
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
        // Keep current shiny state but corrupt
        bloomPass.strength = 1.5;
        bloomPass.threshold = 0.1;
        const CORRUPT = [0xff3333, 0xff6600, 0xffcc00, 0xff0066, 0xff4400, 0xdd2200, 0xff8800, 0xff1111, 0xff5500, 0xffaa00];
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          const hex = CORRUPT[colorIndices[i]];
          mat.color.setHex(hex);
          mat.emissive.setHex(hex);
          mat.emissiveIntensity = 0.8;
        }
        world.gravity = { x: 0, y: -40, z: 0 };
        for (const body of bodies) {
          body.wakeUp();
          body.setLinvel({
            x: (Math.random() - 0.5) * 15,
            y: (Math.random() - 0.5) * 15,
            z: (Math.random() - 0.5) * 8,
          }, true);
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
