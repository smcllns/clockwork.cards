// V11: Slow Death
// Based on V5 (Neon Circuits). Floor raised to fix bottom cropping (no zoom out).
// Broken mode: V5 spark/flicker on circuits + V6 dying lightbulb on balls.
// Death times stretched way out — survivors flicker for many minutes.

import {
  THREE, RAPIER, LIGHT, SHINY,
  HeroMode, layoutBalls, getBirthdaySpecs,
  setupScene, fitCamera, addWalls, createBalls, setupGrabHandlers,
  VFOV, BALL_RADIUS_FACTOR,
  type SceneOpts,
} from "./shared";
import { FONT, CHAR_H, CHAR_W } from "./font";

const DYING_COLOR = new THREE.Color(0x221100);

function countGlyphPixels(text: string): number[] {
  const counts: number[] = [];
  for (const ch of text) {
    if (ch === " ") continue;
    const glyph = FONT[ch];
    if (!glyph) continue;
    let count = 0;
    for (let r = 0; r < CHAR_H; r++)
      for (let c = 0; c < CHAR_W; c++)
        if (glyph[r][c]) count++;
    counts.push(count);
  }
  return counts;
}

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

function createFlowDots(circuitGroup: THREE.Group, scene: THREE.Scene) {
  const dots: { mesh: THREE.Mesh; path: THREE.Vector3[]; progress: number; speed: number }[] = [];
  const dotGeo = new THREE.SphereGeometry(0.08, 8, 8);
  circuitGroup.children.forEach((child) => {
    if (!(child instanceof THREE.Line)) return;
    if (Math.random() > 0.5) return;
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

function sampleDeathTime(): number {
  const r = Math.random();
  if (r < 0.80) return 5 + Math.random() * 55;      // 80%: 5-60s
  if (r < 0.95) return 60 + Math.random() * 120;     // 15%: 60-180s
  return 180 + Math.random() * 5820;                  // 5%: 180-6000s
}

// Raise the floor so balls don't clip the bottom viewport edge.
// addWalls places floor at -(visH/2 + 1). We add an extra floor higher up.
// Glass wall in front of camera — keeps balls near z=0 so they don't
// balloon off-screen due to perspective. The biggest ball radius is
// ~1.15 (0.46 * 2.5 scale), so z=3 gives a bit of bounce room.
const FRONT_WALL_Z = 3;

export function initV11(container: HTMLElement, name: string, dob: string) {
  let disposed = false;
  let mode: HeroMode = "off";
  let frame = 0;
  const startTime = performance.now();

  const { scene, camera, renderer, composer, bloomPass, w, h } = setupScene(container, { antialias: true, shadows: true });
  renderer.setClearColor(0xf5f5f0);

  // Perf: cap pixel ratio at 1 (skip retina rendering)
  renderer.setPixelRatio(1);
  renderer.setSize(w, h);
  composer.setSize(w, h);

  const world = new RAPIER.World({ x: 0, y: 0, z: 0 });
  const specs = getBirthdaySpecs(name, dob);
  const { balls, maxW, totalH } = layoutBalls(specs);

  const { bodies, meshes } = createBalls(balls, world, scene);

  const aspect = w / h;
  const camDist = fitCamera(camera, maxW, totalH, aspect);
  addWalls(world, camera, aspect);

  // Glass wall between balls and camera — prevents z-axis perspective blowup
  const vRad = (VFOV * Math.PI) / 180;
  const visH = 2 * camDist * Math.tan(vRad / 2);
  const visW = visH * aspect;
  const half = Math.max(visW, visH) / 2 + 2;
  const frontWall = world.createRigidBody(
    RAPIER.RigidBodyDesc.fixed().setTranslation(0, 0, FRONT_WALL_Z)
  );
  world.createCollider(
    RAPIER.ColliderDesc.cuboid(half, half, 1).setRestitution(0.5).setFriction(0.2),
    frontWall,
  );
  // Raised floor so balls don't clip bottom viewport edge
  const raisedFloor = world.createRigidBody(
    RAPIER.RigidBodyDesc.fixed().setTranslation(0, -visH / 2 + 4, 0)
  );
  world.createCollider(
    RAPIER.ColliderDesc.cuboid(half, 1, half).setRestitution(0.6).setFriction(0.2),
    raisedFloor,
  );

  // Perf: lower-poly spheres (8x6 vs 16x12)
  const lowPolyGeo = new THREE.SphereGeometry(BALL_RADIUS_FACTOR, 8, 6);
  for (const mesh of meshes) mesh.geometry = lowPolyGeo;

  const origins = bodies.map(b => {
    const t = b.translation();
    return { x: t.x, y: t.y, z: t.z };
  });

  // Perf: simple materials for off mode (Lambert instead of Physical)
  const simpleMats = balls.map(b =>
    new THREE.MeshLambertMaterial({ color: LIGHT.hex[b.colorIndex] })
  );
  const physicalMats = meshes.map(m => m.material as THREE.MeshPhysicalMaterial);
  // Start in off mode with simple materials
  for (let i = 0; i < meshes.length; i++) meshes[i].material = simpleMats[i];

  const { grabbed, target, cleanup: grabCleanup } = setupGrabHandlers(renderer.domElement, camera, bodies, w, h);
  let wasGrabbing = false;

  const colorIndices = balls.map(b => b.colorIndex);
  const phases = new Float32Array(meshes.length);
  for (let i = 0; i < phases.length; i++) phases[i] = Math.random() * Math.PI * 2;

  const circuitGroup = createCircuitPaths(visW, visH, scene);
  const flowDots = createFlowDots(circuitGroup, scene);

  const leds: THREE.Mesh[] = [];
  for (let i = 0; i < 5; i++) {
    const ledGeo = new THREE.CircleGeometry(0.12, 16);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.3 });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(-visW / 2 + 1.5, visH / 2 - 1 - i * 0.5, 0.5);
    scene.add(led);
    leds.push(led);
  }

  const deathTimes = new Float32Array(meshes.length);
  const flickerSpeeds = new Float32Array(meshes.length);
  for (let i = 0; i < meshes.length; i++) {
    flickerSpeeds[i] = 3 + Math.random() * 8;
  }

  const releaseDelays = new Float32Array(meshes.length);
  const released = new Uint8Array(meshes.length);
  const hitGround = new Uint8Array(meshes.length);
  const floorY = -visH / 2 + 4 + 1.5;

  let spinAngle = 0;
  const _yAxis = new THREE.Vector3(0, 1, 0);
  const _spinQuat = new THREE.Quaternion();
  const _vec3 = new THREE.Vector3();

  let spinActive = false;
  let lastX = 0;
  function onPointerDown(e: PointerEvent) { spinActive = true; lastX = e.clientX; }
  function onPointerMove(e: PointerEvent) {
    if (!spinActive) return;
    // Only spin when not grabbing balls (grab takes priority)
    if (grabbed.length === 0) {
      spinAngle += (e.clientX - lastX) * 0.01;
    }
    lastX = e.clientX;
  }
  function onPointerUp() { spinActive = false; }
  container.addEventListener("pointerdown", onPointerDown);
  container.addEventListener("pointermove", onPointerMove);
  // Bind up to window so it fires even if pointer leaves container
  window.addEventListener("pointerup", onPointerUp);

  let visible = true;
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !frame) frame = requestAnimationFrame(animate);
  }, { threshold: 0 });
  observer.observe(container);

  let breakTime = 0;
  let settleFrames = 120; // frames of physics to run after changes

  function animate() {
    if (!visible || disposed) { frame = 0; return; }
    const elapsed = (performance.now() - startTime) / 1000;

    const isGrabbing = grabbed.length > 0;
    if (wasGrabbing && !isGrabbing) settleFrames = 120;
    wasGrabbing = isGrabbing;

    let needsPhysics = mode === "broken" || isGrabbing || spinActive;
    if (!needsPhysics && settleFrames > 0) {
      settleFrames--;
      needsPhysics = true;
    }

    if (needsPhysics) {
      for (const body of grabbed) {
        const pos = body.translation();
        body.setLinvel({ x: (target.x - pos.x) * 12, y: (target.y - pos.y) * 12, z: 0 }, true);
        body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      }

      if (mode === "broken") {
        const t = elapsed - breakTime;
        for (let i = 0; i < bodies.length; i++) {
          if (released[i]) continue;
          if (t >= releaseDelays[i]) {
            released[i] = 1;
            bodies[i].setLinearDamping(0.6);
            bodies[i].setLinvel({
              x: (Math.random() - 0.5) * 25,
              y: Math.random() * 15,
              z: (Math.random() - 0.5) * 12,
            }, true);
            bodies[i].setAngvel({
              x: (Math.random() - 0.5) * 8,
              y: (Math.random() - 0.5) * 8,
              z: (Math.random() - 0.5) * 8,
            }, true);
          } else {
            const pos = bodies[i].translation();
            const orig = origins[i];
            bodies[i].setLinvel({ x: (orig.x - pos.x) * 20, y: (orig.y - pos.y) * 20, z: -pos.z * 20 }, true);
          }
        }
      } else if (grabbed.length === 0) {
        for (let i = 0; i < bodies.length; i++) {
          const pos = bodies[i].translation();
          const orig = origins[i];
          bodies[i].setLinvel({ x: (orig.x - pos.x) * 20, y: (orig.y - pos.y) * 20, z: -pos.z * 20 }, true);
        }
      }

      world.step();
    }
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

      for (const dot of flowDots) {
        dot.progress += dot.speed;
        if (dot.progress >= 1) dot.progress = 0;
        const pathLen = dot.path.length - 1;
        const idx = Math.min(Math.floor(dot.progress * pathLen), pathLen - 1);
        const t = (dot.progress * pathLen) - idx;
        dot.mesh.position.lerpVectors(dot.path[idx], dot.path[idx + 1], t);
        (dot.mesh.material as THREE.MeshBasicMaterial).opacity = 0.8;
      }

      leds.forEach((led, i) => {
        const mat = led.material as THREE.MeshBasicMaterial;
        mat.color.setHex(0x00ff88);
        mat.opacity = 0.6 + 0.3 * Math.sin(elapsed * 4 + i * 1.2);
      });

      for (let i = 0; i < meshes.length; i++) {
        const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = 0.4 + 0.2 * Math.sin(elapsed * 1.5 + phases[i]);
      }
    }

    if (mode === "broken") {
      const t = elapsed - breakTime;

      // V5 spark/flicker on circuits
      circuitGroup.children.forEach((child, i) => {
        if (child instanceof THREE.Line) {
          const mat = child.material as THREE.LineBasicMaterial;
          const flicker = Math.random() > 0.7 ? 0.8 : 0;
          mat.color.setHex(Math.random() > 0.5 ? 0xff4400 : 0xffaa00);
          mat.opacity = flicker * Math.max(0, 1 - t * 0.15);
        }
      });

      // Flow dots spark then die
      for (const dot of flowDots) {
        const mat = dot.mesh.material as THREE.MeshBasicMaterial;
        mat.color.setHex(0xff4400);
        mat.opacity = (t < 4 && Math.random() > 0.6) ? 1 : 0;
      }

      // LEDs die one by one
      leds.forEach((led, i) => {
        const mat = led.material as THREE.MeshBasicMaterial;
        if (t > i * 0.4) {
          mat.color.setHex(0xff0000);
          mat.opacity = t > i * 0.4 + 0.5 ? 0.1 : 0.8;
        }
      });

      // Color change on first ground hit
      const SPARK = [0xff6600, 0xff4400, 0xffaa00, 0xff2200, 0xff8800, 0xffcc00, 0xff3300, 0xff5500, 0xff7700, 0xff1100];
      for (let i = 0; i < bodies.length; i++) {
        if (!hitGround[i] && released[i] && bodies[i].translation().y <= floorY) {
          hitGround[i] = 1;
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          const hex = SPARK[colorIndices[i]];
          mat.color.setHex(hex);
          mat.emissive.setHex(hex);
          mat.emissiveIntensity = 1.2;
        }
      }

      // Per-ball dying lightbulb with very long tail (only after ground hit)
      for (let i = 0; i < meshes.length; i++) {
        if (!hitGround[i]) continue;
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
          mat.color.lerp(DYING_COLOR, 0.005);
        }
      }

      // Bloom: flicker early (V5 sparks), then track survivors
      if (t < 3) {
        bloomPass.strength = Math.random() > 0.8 ? 2 : 0.5;
      } else {
        let maxIntensity = 0;
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          if (mat.emissiveIntensity > maxIntensity) maxIntensity = mat.emissiveIntensity;
        }
        bloomPass.strength = maxIntensity > 0 ? 0.4 + maxIntensity * 0.8 : 0;
      }
    }

    // Perf: skip bloom/composer in off mode
    if (mode === "off") {
      renderer.render(scene, camera);
    } else {
      composer.render();
    }
    frame = requestAnimationFrame(animate);
  }

  frame = requestAnimationFrame(animate);

  return {
    setMode(newMode: HeroMode) {
      mode = newMode;
      settleFrames = 120;
      if (newMode === "on") {
        renderer.setClearColor(0x080c10);
        bloomPass.strength = 0.7;
        bloomPass.radius = 0.3;
        bloomPass.threshold = 0.25;
        for (let i = 0; i < meshes.length; i++) {
          meshes[i].material = physicalMats[i];
          const mat = physicalMats[i];
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
          meshes[i].material = simpleMats[i];
          simpleMats[i].color.setHex(LIGHT.hex[colorIndices[i]]);
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
        for (const dot of flowDots) {
          (dot.mesh.material as THREE.MeshBasicMaterial).opacity = 0;
        }
        leds.forEach((led) => {
          const mat = led.material as THREE.MeshBasicMaterial;
          mat.color.setHex(0x333333);
          mat.opacity = 0.3;
        });
      } else if (newMode === "broken") {
        breakTime = (performance.now() - startTime) / 1000;
        renderer.setClearColor(0x050505);
        bloomPass.strength = 1.5;
        bloomPass.threshold = 0.1;

        for (let i = 0; i < meshes.length; i++) {
          deathTimes[i] = sampleDeathTime();
        }

        for (let i = 0; i < meshes.length; i++) {
          meshes[i].material = physicalMats[i];
          const mat = physicalMats[i];
          const hex = SHINY.hex[colorIndices[i]];
          mat.color.setHex(hex);
          mat.emissive.setHex(hex);
          mat.emissiveIntensity = 0.4;
          hitGround[i] = 0;
        }

        world.gravity = { x: 0, y: -80, z: 0 };

        // Stagger release: balls near a random impact point fall first
        const impactX = (Math.random() - 0.5) * visW * 0.8;
        const impactY = (Math.random() - 0.5) * visH * 0.8;
        let maxDist = 0;
        for (let i = 0; i < bodies.length; i++) {
          const pos = bodies[i].translation();
          const dist = Math.sqrt((pos.x - impactX) ** 2 + (pos.y - impactY) ** 2);
          releaseDelays[i] = dist;
          if (dist > maxDist) maxDist = dist;
          released[i] = 0;
        }
        // Normalize to 0-0.8s spread
        for (let i = 0; i < bodies.length; i++) {
          releaseDelays[i] = (releaseDelays[i] / maxDist) * 0.8;
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
      window.removeEventListener("pointerup", onPointerUp);
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) container.removeChild(renderer.domElement);
      world.free();
    },
  };
}
