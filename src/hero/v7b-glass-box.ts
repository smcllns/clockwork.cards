// V7B: Glass Box (Rooftop)
// Same as V6 dying lights but camera pulled back so the ball area
// doesn't fill the viewport edge-to-edge. Physics box occupies ~65%
// of the view — feels like balls on a rooftop, not cropped at edges.

import {
  THREE, RAPIER, LIGHT, SHINY,
  HeroMode, layoutBalls, getBirthdaySpecs,
  setupScene, fitCamera, createBalls, setupGrabHandlers,
  VFOV, BALL_RADIUS_FACTOR,
} from "./variations";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

const ZOOM_OUT = 1.45; // camera pullback factor — creates ~30% margin around ball area

export function initV7b(container: HTMLElement, name: string, dob: string) {
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

  // Fit camera to text, then pull back for breathing room
  const baseDist = fitCamera(camera, maxW, totalH, aspect);
  const camDist = baseDist * ZOOM_OUT;
  camera.position.set(0, 0, camDist);
  camera.lookAt(0, 0, 0);

  // Walls sized to the original (tight) visible area, not the wider camera view
  // This keeps balls contained in the same rectangle as V6
  const vRad = (VFOV * Math.PI) / 180;
  const tightVisH = 2 * baseDist * Math.tan(vRad / 2);
  const tightVisW = tightVisH * aspect;
  const halfW = tightVisW / 2;
  const halfH = tightVisH / 2;

  const wallThickness = 1;
  const wallDepth = Math.max(halfW, halfH);
  const walls: [number, number, number, number, number, number][] = [
    [0, -halfH - wallThickness, 0, halfW + 2, wallThickness, wallDepth],   // floor
    [0, halfH + wallThickness, 0, halfW + 2, wallThickness, wallDepth],    // ceiling
    [-halfW - wallThickness, 0, 0, wallThickness, halfH + 2, wallDepth],   // left
    [halfW + wallThickness, 0, 0, wallThickness, halfH + 2, wallDepth],    // right
    [0, 0, -wallDepth, halfW + 2, halfH + 2, wallThickness],              // back
    [0, 0, wallDepth, halfW + 2, halfH + 2, wallThickness],               // front
  ];
  for (const [x, y, z, hx, hy, hz] of walls) {
    const b = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z));
    world.createCollider(RAPIER.ColliderDesc.cuboid(hx, hy, hz).setRestitution(0.6).setFriction(0.2), b);
  }

  const { grabbed, target, cleanup: grabCleanup } = setupGrabHandlers(renderer.domElement, camera, bodies, w, h);

  const colorIndices = balls.map(b => b.colorIndex);
  const origins = bodies.map(b => {
    const t = b.translation();
    return { x: t.x, y: t.y, z: t.z };
  });

  const phases = new Float32Array(meshes.length);
  const deathTimes = new Float32Array(meshes.length);
  const flickerSpeeds = new Float32Array(meshes.length);
  for (let i = 0; i < meshes.length; i++) {
    phases[i] = Math.random() * Math.PI * 2;
    deathTimes[i] = 1 + Math.random() * 4;
    flickerSpeeds[i] = 3 + Math.random() * 8;
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
      for (let i = 0; i < meshes.length; i++) {
        const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = 0.4 + 0.2 * Math.sin(elapsed * 1.5 + phases[i]);
      }
    }

    if (mode === "broken") {
      const t = elapsed - breakTime;

      for (let i = 0; i < meshes.length; i++) {
        const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
        const ballT = t / deathTimes[i];

        if (ballT >= 1) {
          mat.emissiveIntensity = 0;
          mat.color.setHex(0x111111);
        } else if (ballT > 0.3) {
          const flickerPhase = ballT * flickerSpeeds[i] + phases[i];
          const flickerDecay = 1 - ballT;
          const flicker = Math.max(0,
            Math.sin(flickerPhase * 6) * 0.5 +
            Math.sin(flickerPhase * 13.7) * 0.3 +
            Math.sin(flickerPhase * 2.3) * 0.2
          );
          mat.emissiveIntensity = flicker * flickerDecay * flickerDecay * 0.8;
          const warmth = ballT * 0.5;
          mat.emissive.setRGB(1, Math.max(0, 0.6 - warmth), Math.max(0, 0.2 - warmth));
          mat.color.lerp(new THREE.Color(0x221100), 0.02);
        }
      }

      bloomPass.strength = Math.max(0, 1.2 * (1 - t / 5));
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
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          const hex = SHINY.hex[colorIndices[i]];
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
      } else if (newMode === "broken") {
        breakTime = (performance.now() - startTime) / 1000;
        renderer.setClearColor(0x050505);
        bloomPass.strength = 1.5;
        bloomPass.threshold = 0.1;

        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          mat.color.setHex(0xffaa44);
          mat.emissive.setHex(0xff8833);
          mat.emissiveIntensity = 1.2;
        }

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
