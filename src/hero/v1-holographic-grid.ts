// V1: Holographic Grid
// Off: subtle wireframe grid behind text, muted gray balls
// On: neon wireframe pulses with bloom, holographic color cycling
// Broken: grid explodes outward, balls rain down through shattered floor

import {
  THREE, RAPIER, LIGHT, SHINY,
  HeroMode, Ball, layoutBalls, getBirthdaySpecs,
  setupScene, fitCamera, addWalls, createBalls, setupGrabHandlers,
  VFOV, BALL_RADIUS_FACTOR,
} from "./variations";

export function initV1(container: HTMLElement, name: string, dob: string) {
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

  // Grid lines
  const gridGroup = new THREE.Group();
  scene.add(gridGroup);
  const gridMat = new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.15 });
  const vRad = (VFOV * Math.PI) / 180;
  const visH = 2 * camDist * Math.tan(vRad / 2);
  const visW = visH * aspect;
  const gridSpacing = 2;

  for (let x = -visW / 2; x <= visW / 2; x += gridSpacing) {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, -visH / 2, -1),
      new THREE.Vector3(x, visH / 2, -1),
    ]);
    gridGroup.add(new THREE.Line(geo, gridMat.clone()));
  }
  for (let y = -visH / 2; y <= visH / 2; y += gridSpacing) {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-visW / 2, y, -1),
      new THREE.Vector3(visW / 2, y, -1),
    ]);
    gridGroup.add(new THREE.Line(geo, gridMat.clone()));
  }

  // Scan line (horizontal line that sweeps up — visible in "on" mode)
  const scanGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-visW / 2, 0, 0.5),
    new THREE.Vector3(visW / 2, 0, 0.5),
  ]);
  const scanMat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0 });
  const scanLine = new THREE.Line(scanGeo, scanMat);
  scene.add(scanLine);

  let spinAngle = 0;
  const _yAxis = new THREE.Vector3(0, 1, 0);
  const _spinQuat = new THREE.Quaternion();
  const _vec3 = new THREE.Vector3();

  // Drag-to-spin
  let dragging = false;
  let lastX = 0;
  function onPointerDown(e: PointerEvent) { dragging = true; lastX = e.clientX; }
  function onPointerMove(e: PointerEvent) {
    if (!dragging) return;
    spinAngle += (e.clientX - lastX) * 0.01;
    lastX = e.clientX;
  }
  function onPointerUp() { dragging = false; }
  container.addEventListener("pointerdown", onPointerDown);
  container.addEventListener("pointermove", onPointerMove);
  container.addEventListener("pointerup", onPointerUp);

  let visible = true;
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !frame) frame = requestAnimationFrame(animate);
  }, { threshold: 0 });
  observer.observe(container);

  function animate() {
    if (!visible || disposed) { frame = 0; return; }
    const elapsed = (performance.now() - startTime) / 1000;

    // Grab physics
    for (const body of grabbed) {
      const pos = body.translation();
      body.setLinvel({ x: (target.x - pos.x) * 12, y: (target.y - pos.y) * 12, z: 0 }, true);
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    // Anchoring (only when not broken)
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
      // Neon grid pulse
      gridGroup.children.forEach((line, i) => {
        const mat = (line as THREE.Line).material as THREE.LineBasicMaterial;
        mat.color.setHex(0x00ffff);
        mat.opacity = 0.15 + 0.2 * Math.sin(elapsed * 2 + i * 0.1);
      });

      // Ball glow
      for (let i = 0; i < meshes.length; i++) {
        const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = 0.5 + 0.3 * Math.sin(elapsed * 1.5 + phases[i]);
      }

      // Scan line sweep
      scanMat.opacity = 0.6;
      scanLine.position.y = ((elapsed * 3) % visH) - visH / 2;
    }

    if (mode === "broken") {
      // Grid dispersal — push lines outward
      gridGroup.children.forEach((line) => {
        line.position.z -= 0.05;
        const lm = (line as THREE.Line).material as THREE.LineBasicMaterial;
        lm.opacity = Math.max(0, lm.opacity - 0.002);
      });
    }

    composer.render();
    frame = requestAnimationFrame(animate);
  }

  frame = requestAnimationFrame(animate);

  return {
    setMode(newMode: HeroMode) {
      const prev = mode;
      mode = newMode;
      if (newMode === "on") {
        renderer.setClearColor(0x0a0a0f);
        bloomPass.strength = 1.2;
        bloomPass.radius = 0.4;
        bloomPass.threshold = 0.2;
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          const hex = SHINY.hex[colorIndices[i]];
          mat.color.setHex(hex);
          mat.emissive.setHex(hex);
          mat.emissiveIntensity = 0.6;
          mat.roughness = 0.3;
          mat.metalness = 0.2;
          mat.clearcoat = 0;
        }
      } else if (newMode === "off") {
        renderer.setClearColor(0xffffff);
        bloomPass.strength = 0;
        bloomPass.radius = 0;
        bloomPass.threshold = 1;
        scanMat.opacity = 0;
        gridGroup.children.forEach((line) => {
          const mat = (line as THREE.Line).material as THREE.LineBasicMaterial;
          mat.color.setHex(0x333333);
          mat.opacity = 0.15;
        });
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
        world.gravity = { x: 0, y: -80, z: 0 };
        for (const body of bodies) {
          body.wakeUp();
          body.setLinvel({
            x: (Math.random() - 0.5) * 30,
            y: Math.random() * 20 + 10,
            z: (Math.random() - 0.5) * 20,
          }, true);
          body.setAngvel({
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8,
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
