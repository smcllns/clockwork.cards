// V3: Blueprint Builder
// Off: technical blueprint aesthetic, dimension lines, muted blue-gray text
// On: blueprint comes alive, measurements glow, construction animation
// Broken: blueprint tears apart, pieces scatter like torn paper

import {
  THREE, RAPIER, LIGHT, SHINY,
  HeroMode, layoutBalls, getBirthdaySpecs,
  setupScene, fitCamera, addWalls, createBalls, setupGrabHandlers,
  VFOV, BALL_RADIUS_FACTOR,
} from "./variations";

export function initV3(container: HTMLElement, name: string, dob: string) {
  let disposed = false;
  let mode: HeroMode = "off";
  let frame = 0;
  const startTime = performance.now();

  const { scene, camera, renderer, composer, bloomPass, w, h, dirLight } = setupScene(container);
  renderer.setClearColor(0xf0f4f8); // Blueprint paper color

  const world = new RAPIER.World({ x: 0, y: 0, z: 0 });
  const specs = getBirthdaySpecs(name, dob);
  const { balls, maxW, totalH } = layoutBalls(specs);

  // Blueprint blue-gray palette for "off" mode
  const BLUEPRINT_BLUE = [0x2c4a6e, 0x345882, 0x3d6696, 0x1e3a5c, 0x264a72, 0x2f547a, 0x385e88, 0x1a3350, 0x304e78, 0x3b6290];
  const modifiedBalls = balls.map(b => ({ ...b }));

  const { bodies, meshes } = createBalls(modifiedBalls, world, scene, { hex: BLUEPRINT_BLUE } as any, {
    roughness: 0.6,
    metalness: 0.05,
    clearcoat: 0.1,
  });
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

  // Blueprint grid (blue dotted lines)
  const gridGroup = new THREE.Group();
  scene.add(gridGroup);
  const vRad = (VFOV * Math.PI) / 180;
  const visH = 2 * camDist * Math.tan(vRad / 2);
  const visW = visH * aspect;

  // Fine grid
  const fineGridMat = new THREE.LineDashedMaterial({ color: 0x6699cc, transparent: true, opacity: 0.12, dashSize: 0.3, gapSize: 0.3 });
  const gridSpacing = 1.5;
  for (let x = -visW / 2; x <= visW / 2; x += gridSpacing) {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, -visH / 2, -1),
      new THREE.Vector3(x, visH / 2, -1),
    ]);
    const line = new THREE.Line(geo, fineGridMat.clone());
    line.computeLineDistances();
    gridGroup.add(line);
  }
  for (let y = -visH / 2; y <= visH / 2; y += gridSpacing) {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-visW / 2, y, -1),
      new THREE.Vector3(visW / 2, y, -1),
    ]);
    const line = new THREE.Line(geo, fineGridMat.clone());
    line.computeLineDistances();
    gridGroup.add(line);
  }

  // Dimension lines around text bounds
  const dimGroup = new THREE.Group();
  scene.add(dimGroup);
  const dimMat = new THREE.LineBasicMaterial({ color: 0x2255aa, transparent: true, opacity: 0.4 });

  // Horizontal dimension
  const hDimY = totalH / 2 + 2;
  const hDim = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-maxW / 2, hDimY, -0.5),
    new THREE.Vector3(maxW / 2, hDimY, -0.5),
  ]);
  dimGroup.add(new THREE.Line(hDim, dimMat));
  // End ticks
  for (const xEnd of [-maxW / 2, maxW / 2]) {
    const tick = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(xEnd, hDimY - 0.5, -0.5),
      new THREE.Vector3(xEnd, hDimY + 0.5, -0.5),
    ]);
    dimGroup.add(new THREE.Line(tick, dimMat));
  }

  // Vertical dimension
  const vDimX = maxW / 2 + 2;
  const vDim = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(vDimX, -totalH / 2, -0.5),
    new THREE.Vector3(vDimX, totalH / 2, -0.5),
  ]);
  dimGroup.add(new THREE.Line(vDim, dimMat));
  for (const yEnd of [-totalH / 2, totalH / 2]) {
    const tick = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(vDimX - 0.5, yEnd, -0.5),
      new THREE.Vector3(vDimX + 0.5, yEnd, -0.5),
    ]);
    dimGroup.add(new THREE.Line(tick, dimMat));
  }

  // Corner marks (crosshairs at corners)
  const cornerSize = 1.5;
  const corners = [
    [-maxW / 2, totalH / 2],
    [maxW / 2, totalH / 2],
    [-maxW / 2, -totalH / 2],
    [maxW / 2, -totalH / 2],
  ];
  const cornerMat = new THREE.LineBasicMaterial({ color: 0xcc4444, transparent: true, opacity: 0.4 });
  for (const [cx, cy] of corners) {
    const hLine = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(cx - cornerSize, cy, -0.5),
      new THREE.Vector3(cx + cornerSize, cy, -0.5),
    ]);
    dimGroup.add(new THREE.Line(hLine, cornerMat.clone()));
    const vLine = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(cx, cy - cornerSize, -0.5),
      new THREE.Vector3(cx, cy + cornerSize, -0.5),
    ]);
    dimGroup.add(new THREE.Line(vLine, cornerMat.clone()));
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

  // Construction reveal progress (0-1) for "on" mode
  let buildProgress = 0;

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

    if (mode === "on") {
      // Animate dimension lines glowing
      dimGroup.children.forEach((line, i) => {
        const mat = (line as THREE.Line).material as THREE.LineBasicMaterial;
        mat.opacity = 0.5 + 0.3 * Math.sin(elapsed * 1.5 + i * 0.3);
        mat.color.setHex(0x00ccff);
      });
      // Corner marks pulse
      cornerMat.opacity = 0.6 + 0.3 * Math.sin(elapsed * 3);

      // Ball emissive pulse
      for (let i = 0; i < meshes.length; i++) {
        const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = 0.3 + 0.2 * Math.sin(elapsed * 1.5 + phases[i]);
      }

      // Grid pulse
      gridGroup.children.forEach((line, i) => {
        const mat = (line as THREE.Line).material as THREE.LineBasicMaterial;
        mat.opacity = 0.15 + 0.1 * Math.sin(elapsed * 2 + i * 0.05);
        mat.color.setHex(0x00aaff);
      });
    }

    if (mode === "broken") {
      // Dimension lines scatter outward
      dimGroup.children.forEach((child, i) => {
        child.position.x += (Math.sin(i * 2.7) * 0.15);
        child.position.y += (Math.cos(i * 1.3) * 0.15);
        child.rotation.z += 0.01 * (i % 2 === 0 ? 1 : -1);
        const mat = (child as THREE.Line).material as THREE.LineBasicMaterial;
        mat.opacity = Math.max(0, mat.opacity - 0.003);
      });
      // Grid tears
      gridGroup.children.forEach((child, i) => {
        child.position.z -= 0.03;
        const mat = (child as THREE.Line).material as THREE.LineBasicMaterial;
        mat.opacity = Math.max(0, mat.opacity - 0.001);
      });
    }

    composer.render();
    frame = requestAnimationFrame(animate);
  }

  frame = requestAnimationFrame(animate);

  return {
    setMode(newMode: HeroMode) {
      mode = newMode;
      if (newMode === "on") {
        renderer.setClearColor(0x0a1628); // Dark blueprint
        bloomPass.strength = 0.6;
        bloomPass.radius = 0.3;
        bloomPass.threshold = 0.3;
        const NEON_BLUE = [0x00ccff, 0x0099ff, 0x33bbff, 0x0088ee, 0x22aaff, 0x00bbff, 0x1199ee, 0x00aaff, 0x44ccff, 0x0077dd];
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          const hex = NEON_BLUE[colorIndices[i]];
          mat.color.setHex(hex);
          mat.emissive.setHex(hex);
          mat.emissiveIntensity = 0.3;
          mat.roughness = 0.2;
          mat.metalness = 0.4;
          mat.clearcoat = 0.8;
        }
      } else if (newMode === "off") {
        renderer.setClearColor(0xf0f4f8);
        bloomPass.strength = 0;
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          mat.color.setHex(BLUEPRINT_BLUE[colorIndices[i]]);
          mat.emissive.setHex(0x000000);
          mat.emissiveIntensity = 0;
          mat.roughness = 0.6;
          mat.metalness = 0.05;
          mat.clearcoat = 0.1;
        }
        dimGroup.children.forEach((line) => {
          const mat = (line as THREE.Line).material as THREE.LineBasicMaterial;
          mat.color.setHex(0x2255aa);
          mat.opacity = 0.4;
        });
        gridGroup.children.forEach((line) => {
          const mat = (line as THREE.Line).material as THREE.LineBasicMaterial;
          mat.color.setHex(0x6699cc);
          mat.opacity = 0.12;
        });
      } else if (newMode === "broken") {
        bloomPass.strength = 1.0;
        bloomPass.threshold = 0.15;
        renderer.setClearColor(0x08101c);
        const WARN_RED = [0xff4444, 0xff2222, 0xee3333, 0xff5555, 0xdd1111, 0xff3333, 0xee4444, 0xff6666, 0xcc2222, 0xff1111];
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          const hex = WARN_RED[colorIndices[i]];
          mat.color.setHex(hex);
          mat.emissive.setHex(hex);
          mat.emissiveIntensity = 0.6;
        }
        world.gravity = { x: 0, y: -60, z: 0 };
        for (const body of bodies) {
          body.wakeUp();
          body.setLinvel({
            x: (Math.random() - 0.5) * 25,
            y: Math.random() * 15,
            z: (Math.random() - 0.5) * 15,
          }, true);
          body.setAngvel({
            x: (Math.random() - 0.5) * 6,
            y: (Math.random() - 0.5) * 6,
            z: (Math.random() - 0.5) * 6,
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
