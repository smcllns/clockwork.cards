// V5: Neon Circuits
// Off: faint circuit board traces behind text, subtle PCB aesthetic
// On: circuits light up sequentially, current flows, power indicators
// Broken: short circuit, sparks, everything flickers and goes dark

import {
  THREE, RAPIER, LIGHT, SHINY,
  HeroMode, layoutBalls, getBirthdaySpecs,
  setupScene, fitCamera, addWalls, createBalls, setupGrabHandlers,
  VFOV,
} from "./variations";

// Generate circuit paths procedurally
function createCircuitPaths(visW: number, visH: number, scene: THREE.Scene) {
  const group = new THREE.Group();
  const pathCount = 20;

  for (let i = 0; i < pathCount; i++) {
    const points: THREE.Vector3[] = [];
    let x = (Math.random() - 0.5) * visW;
    let y = (Math.random() - 0.5) * visH;

    points.push(new THREE.Vector3(x, y, -1));
    const segments = 3 + Math.floor(Math.random() * 5);
    for (let s = 0; s < segments; s++) {
      // Circuit paths go horizontal or vertical (90-degree turns)
      if (Math.random() > 0.5) {
        x += (Math.random() - 0.5) * 8;
      } else {
        y += (Math.random() - 0.5) * 8;
      }
      x = Math.max(-visW / 2, Math.min(visW / 2, x));
      y = Math.max(-visH / 2, Math.min(visH / 2, y));
      points.push(new THREE.Vector3(x, y, -1));
    }

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: 0x334444,
      transparent: true,
      opacity: 0.12,
    });
    const line = new THREE.Line(geo, mat);
    group.add(line);

    // Add node dots at endpoints
    for (const pt of [points[0], points[points.length - 1]]) {
      const dotGeo = new THREE.CircleGeometry(0.15, 8);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0x446666, transparent: true, opacity: 0.2 });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pt);
      dot.position.z = -0.9;
      group.add(dot);
    }
  }

  // Add some IC chip rectangles
  for (let i = 0; i < 6; i++) {
    const chipW = 1 + Math.random() * 2;
    const chipH = 0.5 + Math.random();
    const chipGeo = new THREE.PlaneGeometry(chipW, chipH);
    const chipMat = new THREE.MeshBasicMaterial({ color: 0x223333, transparent: true, opacity: 0.1 });
    const chip = new THREE.Mesh(chipGeo, chipMat);
    chip.position.set((Math.random() - 0.5) * visW * 0.8, (Math.random() - 0.5) * visH * 0.8, -0.8);
    group.add(chip);
  }

  scene.add(group);
  return group;
}

// Power flow dots that travel along circuit paths
function createFlowDots(circuitGroup: THREE.Group, scene: THREE.Scene) {
  const dots: { mesh: THREE.Mesh; path: THREE.Vector3[]; progress: number; speed: number }[] = [];
  const dotGeo = new THREE.SphereGeometry(0.08, 8, 8);

  circuitGroup.children.forEach((child) => {
    if (!(child instanceof THREE.Line)) return;
    if (Math.random() > 0.5) return; // Only some paths get flow dots

    const positions = (child.geometry.getAttribute("position") as THREE.BufferAttribute).array;
    const path: THREE.Vector3[] = [];
    for (let i = 0; i < positions.length; i += 3) {
      path.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2] + 0.1));
    }

    const dotMat = new THREE.MeshBasicMaterial({ color: 0x00ffaa, transparent: true, opacity: 0 });
    const mesh = new THREE.Mesh(dotGeo, dotMat);
    mesh.position.copy(path[0]);
    scene.add(mesh);
    dots.push({ mesh, path, progress: Math.random(), speed: 0.003 + Math.random() * 0.005 });
  });

  return dots;
}

export function initV5(container: HTMLElement, name: string, dob: string) {
  let disposed = false;
  let mode: HeroMode = "off";
  let frame = 0;
  const startTime = performance.now();

  const { scene, camera, renderer, composer, bloomPass, w, h } = setupScene(container);
  renderer.setClearColor(0xf5f5f0);

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

  const circuitGroup = createCircuitPaths(visW, visH, scene);
  const flowDots = createFlowDots(circuitGroup, scene);

  // Power indicator LEDs
  const leds: THREE.Mesh[] = [];
  for (let i = 0; i < 5; i++) {
    const ledGeo = new THREE.CircleGeometry(0.12, 16);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.3 });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(-visW / 2 + 1.5, visH / 2 - 1 - i * 0.5, 0.5);
    scene.add(led);
    leds.push(led);
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

  let shortCircuitTime = 0;

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
      // Circuit traces glow
      circuitGroup.children.forEach((child, i) => {
        if (child instanceof THREE.Line) {
          const mat = child.material as THREE.LineBasicMaterial;
          mat.color.setHex(0x00ffaa);
          mat.opacity = 0.3 + 0.2 * Math.sin(elapsed * 2 + i * 0.5);
        } else if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshBasicMaterial;
          mat.color.setHex(0x00ffcc);
          mat.opacity = 0.4 + 0.2 * Math.sin(elapsed * 3 + i);
        }
      });

      // Flow dots move along paths
      for (const dot of flowDots) {
        dot.progress += dot.speed;
        if (dot.progress >= 1) dot.progress = 0;
        const pathLen = dot.path.length - 1;
        const idx = Math.min(Math.floor(dot.progress * pathLen), pathLen - 1);
        const t = (dot.progress * pathLen) - idx;
        dot.mesh.position.lerpVectors(dot.path[idx], dot.path[idx + 1], t);
        (dot.mesh.material as THREE.MeshBasicMaterial).opacity = 0.8;
      }

      // LED indicators
      leds.forEach((led, i) => {
        const mat = led.material as THREE.MeshBasicMaterial;
        mat.color.setHex(0x00ff88);
        mat.opacity = 0.6 + 0.3 * Math.sin(elapsed * 4 + i * 1.2);
      });

      // Ball glow
      for (let i = 0; i < meshes.length; i++) {
        const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = 0.4 + 0.2 * Math.sin(elapsed * 1.5 + phases[i]);
      }
    }

    if (mode === "broken") {
      const t = elapsed - shortCircuitTime;

      // Flickering circuits
      circuitGroup.children.forEach((child, i) => {
        if (child instanceof THREE.Line) {
          const mat = child.material as THREE.LineBasicMaterial;
          const flicker = Math.random() > 0.7 ? 0.8 : 0;
          mat.color.setHex(Math.random() > 0.5 ? 0xff4400 : 0xffaa00);
          mat.opacity = flicker * Math.max(0, 1 - t * 0.15);
        }
      });

      // Flow dots spark
      for (const dot of flowDots) {
        const mat = dot.mesh.material as THREE.MeshBasicMaterial;
        mat.color.setHex(0xff4400);
        mat.opacity = Math.random() > 0.6 ? 1 : 0;
      }

      // LEDs die one by one
      leds.forEach((led, i) => {
        const mat = led.material as THREE.MeshBasicMaterial;
        if (t > i * 0.4) {
          mat.color.setHex(0xff0000);
          mat.opacity = t > i * 0.4 + 0.5 ? 0.1 : 0.8;
        }
      });

      // Bloom flicker
      bloomPass.strength = Math.random() > 0.8 ? 2 : 0.3;
    }

    composer.render();
    frame = requestAnimationFrame(animate);
  }

  frame = requestAnimationFrame(animate);

  return {
    setMode(newMode: HeroMode) {
      mode = newMode;
      if (newMode === "on") {
        renderer.setClearColor(0x080c10);
        bloomPass.strength = 0.7;
        bloomPass.radius = 0.3;
        bloomPass.threshold = 0.25;
        const CIRCUIT_GREEN = [0x00ffaa, 0x00ff88, 0x22ffbb, 0x00ffcc, 0x33ff99, 0x00ff77, 0x11ffaa, 0x00ffdd, 0x44ff88, 0x00ff66];
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          const hex = CIRCUIT_GREEN[colorIndices[i]];
          mat.color.setHex(hex);
          mat.emissive.setHex(hex);
          mat.emissiveIntensity = 0.4;
          mat.roughness = 0.2;
          mat.metalness = 0.6;
          mat.clearcoat = 0.5;
        }
      } else if (newMode === "off") {
        renderer.setClearColor(0xf5f5f0);
        bloomPass.strength = 0;
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          mat.color.setHex(LIGHT.hex[colorIndices[i]]);
          mat.emissive.setHex(0x000000);
          mat.emissiveIntensity = 0;
          mat.roughness = 0.4;
          mat.metalness = 0.15;
          mat.clearcoat = 0.3;
        }
        circuitGroup.children.forEach((child) => {
          if (child instanceof THREE.Line) {
            const mat = child.material as THREE.LineBasicMaterial;
            mat.color.setHex(0x334444);
            mat.opacity = 0.12;
          } else if (child instanceof THREE.Mesh) {
            const mat = child.material as THREE.MeshBasicMaterial;
            mat.color.setHex(0x446666);
            mat.opacity = 0.2;
          }
        });
        for (const dot of flowDots) {
          (dot.mesh.material as THREE.MeshBasicMaterial).opacity = 0;
        }
        leds.forEach((led) => {
          const mat = led.material as THREE.MeshBasicMaterial;
          mat.color.setHex(0x333333);
          mat.opacity = 0.3;
        });
      } else if (newMode === "broken") {
        shortCircuitTime = (performance.now() - startTime) / 1000;
        renderer.setClearColor(0x050505);
        bloomPass.strength = 1.5;
        bloomPass.threshold = 0.1;

        const SPARK = [0xff6600, 0xff4400, 0xffaa00, 0xff2200, 0xff8800, 0xffcc00, 0xff3300, 0xff5500, 0xff7700, 0xff1100];
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          const hex = SPARK[colorIndices[i]];
          mat.color.setHex(hex);
          mat.emissive.setHex(hex);
          mat.emissiveIntensity = 1;
        }
        world.gravity = { x: 0, y: -100, z: 0 };
        for (const body of bodies) {
          body.wakeUp();
          body.setLinvel({
            x: (Math.random() - 0.5) * 30,
            y: (Math.random()) * 20,
            z: (Math.random() - 0.5) * 15,
          }, true);
          body.setAngvel({
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 10,
            z: (Math.random() - 0.5) * 10,
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
