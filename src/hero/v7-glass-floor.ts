// V7: Glass Floor (Full-Viewport)
// Same dying lightbulb effect as V6 but:
// - Canvas spans full viewport width (no side cropping)
// - Clear glass floor — balls never clipped at bottom
// - Physics world sized to container (same scale as V6), camera widened for viewport

import {
  THREE, RAPIER, LIGHT, SHINY,
  HeroMode, layoutBalls, getBirthdaySpecs,
  fitCamera, addWalls,
  VFOV, BALL_RADIUS_FACTOR,
} from "./variations";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

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
  }
  scene.add(group);
  return group;
}

function createGlassFloor(visW: number, floorY: number, scene: THREE.Scene) {
  // Simple transparent plane — no transmission (expensive)
  const geo = new THREE.PlaneGeometry(visW * 2, 0.03);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xaabbcc,
    transparent: true,
    opacity: 0.06,
  });
  const floor = new THREE.Mesh(geo, mat);
  floor.position.set(0, floorY, 0.1);
  scene.add(floor);

  const edgeMat = new THREE.LineBasicMaterial({ color: 0x335577, transparent: true, opacity: 0.2 });
  const edgePts = [
    new THREE.Vector3(-visW, floorY, 0.1),
    new THREE.Vector3(visW, floorY, 0.1),
  ];
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(edgePts), edgeMat));

  return { mesh: floor, edgeMat };
}

export function initV7(container: HTMLElement, name: string, dob: string) {
  let disposed = false;
  let mode: HeroMode = "off";
  let frame = 0;
  const startTime = performance.now();

  const vpW = window.innerWidth;
  const vpH = window.innerHeight;
  const containerW = container.clientWidth;
  const containerH = container.clientHeight;

  const scene = new THREE.Scene();
  // Camera uses viewport aspect for rendering, but we'll fit text to container aspect
  const camera = new THREE.PerspectiveCamera(VFOV, vpW / vpH, 0.1, 200);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xf5f5f0);
  renderer.setSize(vpW, vpH);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.width = "100vw";
  renderer.domElement.style.height = "100vh";
  renderer.domElement.style.pointerEvents = "auto";
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  scene.add(new THREE.HemisphereLight(0xfff5e6, 0xe8f0ff, 0.4));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(10, 20, 15);
  scene.add(dirLight);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(vpW, vpH), 0, 0, 0);
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  const world = new RAPIER.World({ x: 0, y: 0, z: 0 });
  const specs = getBirthdaySpecs(name, dob);
  const { balls, maxW, totalH } = layoutBalls(specs);

  const sphereGeo = new THREE.SphereGeometry(BALL_RADIUS_FACTOR, 16, 12);
  const bodies: RAPIER.RigidBody[] = [];
  const meshes: THREE.Mesh[] = [];
  const colorIndices: number[] = [];

  for (const ball of balls) {
    const mat = new THREE.MeshPhysicalMaterial({
      color: LIGHT.hex[ball.colorIndex],
      roughness: 0.4, metalness: 0.15, clearcoat: 0.3,
    });
    const mesh = new THREE.Mesh(sphereGeo, mat);
    mesh.scale.setScalar(ball.scale);
    mesh.position.set(ball.x, ball.y, 0);
    mesh.castShadow = true;
    scene.add(mesh);

    const radius = BALL_RADIUS_FACTOR * ball.scale;
    const body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(ball.x, ball.y, 0)
        .setLinearDamping(0.05)
        .setAngularDamping(0.05)
        .setCanSleep(false)
    );
    world.createCollider(RAPIER.ColliderDesc.ball(radius).setRestitution(0.7).setFriction(0.2), body);
    bodies.push(body);
    meshes.push(mesh);
    colorIndices.push(ball.colorIndex);
  }

  // Fit camera to CONTAINER aspect (same physics scale as V6), then widen for viewport
  const containerAspect = containerW / containerH;
  const camDist = fitCamera(camera, maxW, totalH, containerAspect);
  // Now override aspect to viewport (wider view, same distance = no side cropping)
  camera.aspect = vpW / vpH;
  camera.updateProjectionMatrix();

  // Visible bounds at the camera's actual viewport aspect
  const vRad = (VFOV * Math.PI) / 180;
  const visH = 2 * camDist * Math.tan(vRad / 2);
  const visW = visH * (vpW / vpH);

  // Floor at same position as V6 would have it (container-based visible height)
  const containerVisH = 2 * camDist * Math.tan(vRad / 2);
  const floorY = -containerVisH / 2 + 0.5;

  // Walls at full viewport edges
  const wallThickness = 1;
  const wallData: [number, number, number, number, number, number][] = [
    [0, floorY - wallThickness, 0, visW / 2 + 2, wallThickness, visW / 2],
    [0, visH / 2 + wallThickness + 1, 0, visW / 2 + 2, wallThickness, visW / 2],
    [-visW / 2 - wallThickness, 0, 0, wallThickness, visH, visW / 2],
    [visW / 2 + wallThickness, 0, 0, wallThickness, visH, visW / 2],
    [0, 0, -visW / 2, visW / 2, visH, wallThickness],
    [0, 0, visW / 2, visW / 2, visH, wallThickness],
  ];
  for (const [x, y, z, hx, hy, hz] of wallData) {
    const b = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z));
    world.createCollider(RAPIER.ColliderDesc.cuboid(hx, hy, hz).setRestitution(0.6).setFriction(0.2), b);
  }

  const origins = bodies.map(b => {
    const t = b.translation();
    return { x: t.x, y: t.y, z: t.z };
  });

  const circuitGroup = createCircuitPaths(visW, visH, scene);
  const glassFloor = createGlassFloor(visW, floorY, scene);

  const phases = new Float32Array(meshes.length);
  const deathTimes = new Float32Array(meshes.length);
  const flickerSpeeds = new Float32Array(meshes.length);
  for (let i = 0; i < meshes.length; i++) {
    phases[i] = Math.random() * Math.PI * 2;
    deathTimes[i] = 1.5 + Math.random() * 4;
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
  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerup", onPointerUp);

  let visible = true;
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !frame) frame = requestAnimationFrame(animate);
  }, { threshold: 0 });
  observer.observe(container);

  let breakTime = 0;

  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
  }
  window.addEventListener("resize", onResize);

  function animate() {
    if (!visible || disposed) { frame = 0; return; }
    const elapsed = (performance.now() - startTime) / 1000;

    if (mode !== "broken") {
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
        }
      });
      for (let i = 0; i < meshes.length; i++) {
        const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = 0.4 + 0.2 * Math.sin(elapsed * 1.5 + phases[i]);
      }
      (glassFloor.mesh.material as THREE.MeshBasicMaterial).opacity = 0.1;
      glassFloor.edgeMat.opacity = 0.35;
      glassFloor.edgeMat.color.setHex(0x00ffaa);
    }

    if (mode === "broken") {
      const t = elapsed - breakTime;

      circuitGroup.children.forEach((child) => {
        if (child instanceof THREE.Line) {
          const mat = child.material as THREE.LineBasicMaterial;
          const fadeT = Math.max(0, 1 - t * 0.3);
          mat.color.setHex(t < 1 ? 0xff4400 : 0x331100);
          mat.opacity = fadeT * (Math.random() > 0.7 ? 0.6 : 0.05);
        }
      });

      (glassFloor.mesh.material as THREE.MeshBasicMaterial).opacity = t < 2 ? 0.08 * (Math.random() > 0.5 ? 1 : 0) : 0.02;
      glassFloor.edgeMat.color.setHex(t < 1 ? 0xff4400 : 0x220000);
      glassFloor.edgeMat.opacity = Math.max(0, 0.3 - t * 0.06);

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
        }
        circuitGroup.children.forEach((child) => {
          if (child instanceof THREE.Line) {
            (child.material as THREE.LineBasicMaterial).color.setHex(0x334444);
            (child.material as THREE.LineBasicMaterial).opacity = 0.12;
          }
        });
        (glassFloor.mesh.material as THREE.MeshBasicMaterial).opacity = 0.04;
        glassFloor.edgeMat.color.setHex(0x335577);
        glassFloor.edgeMat.opacity = 0.15;
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
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      world.free();
    },
  };
}
