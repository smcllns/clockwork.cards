// V6: Dying Lightbulbs
// Based on V5 Neon Circuits. After chaos: balls stop bouncing,
// glow flickers like lightbulbs running out of battery, fade to black.
// Feeling: "Oh no, I've broken this display"

import {
  THREE, RAPIER, LIGHT, SHINY,
  HeroMode, layoutBalls, getBirthdaySpecs,
  setupScene, fitCamera, addWalls, createBalls, setupGrabHandlers,
  VFOV, BALL_RADIUS_FACTOR,
} from "./variations";

function createCircuitPaths(visW: number, visH: number, scene: THREE.Scene) {
  const group = new THREE.Group();
  for (let i = 0; i < 20; i++) {
    const points: THREE.Vector3[] = [];
    let x = (Math.random() - 0.5) * visW;
    let y = (Math.random() - 0.5) * visH;
    points.push(new THREE.Vector3(x, y, -1));
    const segments = 3 + Math.floor(Math.random() * 5);
    for (let s = 0; s < segments; s++) {
      if (Math.random() > 0.5) x += (Math.random() - 0.5) * 8;
      else y += (Math.random() - 0.5) * 8;
      x = Math.max(-visW / 2, Math.min(visW / 2, x));
      y = Math.max(-visH / 2, Math.min(visH / 2, y));
      points.push(new THREE.Vector3(x, y, -1));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: 0x334444, transparent: true, opacity: 0.12 });
    group.add(new THREE.Line(geo, mat));
    for (const pt of [points[0], points[points.length - 1]]) {
      const dot = new THREE.Mesh(
        new THREE.CircleGeometry(0.15, 8),
        new THREE.MeshBasicMaterial({ color: 0x446666, transparent: true, opacity: 0.2 }),
      );
      dot.position.copy(pt);
      dot.position.z = -0.9;
      group.add(dot);
    }
  }
  for (let i = 0; i < 6; i++) {
    const chip = new THREE.Mesh(
      new THREE.PlaneGeometry(1 + Math.random() * 2, 0.5 + Math.random()),
      new THREE.MeshBasicMaterial({ color: 0x223333, transparent: true, opacity: 0.1 }),
    );
    chip.position.set((Math.random() - 0.5) * visW * 0.8, (Math.random() - 0.5) * visH * 0.8, -0.8);
    group.add(chip);
  }
  scene.add(group);
  return group;
}

export function initV6(container: HTMLElement, name: string, dob: string) {
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

  // Per-ball death timing for broken mode
  const deathTimes = new Float32Array(meshes.length);
  const flickerSpeeds = new Float32Array(meshes.length);
  for (let i = 0; i < meshes.length; i++) {
    deathTimes[i] = 1 + Math.random() * 4; // each ball dies 1-5s after break
    flickerSpeeds[i] = 3 + Math.random() * 8; // flicker frequency
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

  let breakTime = 0;

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
      for (let i = 0; i < meshes.length; i++) {
        const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = 0.4 + 0.2 * Math.sin(elapsed * 1.5 + phases[i]);
      }
    }

    if (mode === "broken") {
      const t = elapsed - breakTime;

      // Circuit traces flicker and die
      circuitGroup.children.forEach((child, i) => {
        if (child instanceof THREE.Line) {
          const mat = child.material as THREE.LineBasicMaterial;
          const fadeT = Math.max(0, 1 - t * 0.3);
          mat.color.setHex(t < 1 ? 0xff4400 : 0x331100);
          mat.opacity = fadeT * (Math.random() > 0.7 ? 0.6 : 0.05);
        }
      });

      // Per-ball dying lightbulb effect
      for (let i = 0; i < meshes.length; i++) {
        const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
        const ballT = t / deathTimes[i]; // 0→1 over each ball's death time

        if (ballT >= 1) {
          // Dead — fully dark
          mat.emissiveIntensity = 0;
          mat.color.setHex(0x111111);
        } else if (ballT > 0.3) {
          // Flickering phase — irregular, slowing down
          const flickerPhase = ballT * flickerSpeeds[i] + phases[i];
          const flickerDecay = 1 - ballT;
          // Irregular flicker: mix of sin waves at different frequencies
          const flicker = Math.max(0,
            Math.sin(flickerPhase * 6) * 0.5 +
            Math.sin(flickerPhase * 13.7) * 0.3 +
            Math.sin(flickerPhase * 2.3) * 0.2
          );
          const intensity = flicker * flickerDecay * flickerDecay;
          mat.emissiveIntensity = intensity * 0.8;
          // Shift toward warm orange as dying
          const warmth = ballT * 0.5;
          const r = 1;
          const g = Math.max(0, 0.6 - warmth);
          const b = Math.max(0, 0.2 - warmth);
          mat.emissive.setRGB(r, g, b);
          mat.color.lerp(new THREE.Color(0x221100), 0.02);
        }
        // First 0.3: initial bright flash already set from setMode
      }

      // Bloom fades out with the balls
      const maxAlive = Math.max(0, 1 - t / 5);
      bloomPass.strength = maxAlive * 1.2;
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
        const NEON = SHINY.hex;
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          const hex = NEON[colorIndices[i]];
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
            (child.material as THREE.LineBasicMaterial).color.setHex(0x334444);
            (child.material as THREE.LineBasicMaterial).opacity = 0.12;
          } else if (child instanceof THREE.Mesh) {
            (child.material as THREE.MeshBasicMaterial).color.setHex(0x446666);
            (child.material as THREE.MeshBasicMaterial).opacity = 0.2;
          }
        });
      } else if (newMode === "broken") {
        breakTime = (performance.now() - startTime) / 1000;
        renderer.setClearColor(0x050505);
        bloomPass.strength = 1.5;
        bloomPass.threshold = 0.1;

        // Initial bright flash — all balls go bright white-hot
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          mat.color.setHex(0xffaa44);
          mat.emissive.setHex(0xff8833);
          mat.emissiveIntensity = 1.2;
        }

        // Gravity on, scatter
        world.gravity = { x: 0, y: -40, z: 0 };
        for (const body of bodies) {
          body.wakeUp();
          body.setLinvel({
            x: (Math.random() - 0.5) * 15,
            y: Math.random() * 10,
            z: (Math.random() - 0.5) * 8,
          }, true);
          body.setAngvel({
            x: (Math.random() - 0.5) * 5,
            y: (Math.random() - 0.5) * 5,
            z: (Math.random() - 0.5) * 5,
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
