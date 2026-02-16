// V8: Neon Letters
// 3D box-based pixel letters (like approach-d) with neon tube aesthetic.
// Off: dark metallic letters on dark background. On: glowing neon tubes, hue-cycling.
// Broken: letters swing off their anchors, fall and smash (scatter into pixels).

import {
  THREE, RAPIER, LIGHT, SHINY,
  HeroMode, layoutBalls, getBirthdaySpecs,
  setupScene, fitCamera, addWalls,
  VFOV, BALL_RADIUS_FACTOR,
} from "./variations";

export function initV8(container: HTMLElement, name: string, dob: string) {
  let disposed = false;
  let mode: HeroMode = "off";
  let frame = 0;
  const startTime = performance.now();

  const { scene, camera, renderer, composer, bloomPass, w, h } = setupScene(container);
  renderer.setClearColor(0x0a0a12);

  const world = new RAPIER.World({ x: 0, y: 0, z: 0 });
  const specs = getBirthdaySpecs(name, dob);
  const { balls, maxW, totalH } = layoutBalls(specs);
  const aspect = w / h;
  const camDist = fitCamera(camera, maxW, totalH, aspect);
  addWalls(world, camera, aspect);

  // Build box-based letters instead of spheres
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const bodies: RAPIER.RigidBody[] = [];
  const meshes: THREE.Mesh[] = [];
  const colorIndices: number[] = [];

  // Neon color palette per character
  const NEON_COLORS = [0x00ffff, 0xff2d55, 0xbf5af2, 0x39ff14, 0xff006e, 0x00f0ff, 0xff10f0, 0x00ff88, 0xec4899, 0x3b82f6];

  for (const ball of balls) {
    const neonHex = NEON_COLORS[ball.colorIndex % NEON_COLORS.length];

    // Off state: dark metallic
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x222233,
      roughness: 0.3,
      metalness: 0.8,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      emissive: 0x000000,
      emissiveIntensity: 0,
    });
    (mat as any)._neonColor = neonHex;

    const mesh = new THREE.Mesh(boxGeo, mat);
    const s = ball.scale * 0.9;
    mesh.scale.set(s, s, s * 0.4); // flatter cubes for letter look
    mesh.position.set(ball.x, ball.y, 0);
    mesh.castShadow = true;
    scene.add(mesh);

    const hx = s * 0.45, hy = s * 0.45, hz = s * 0.2;
    const body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(ball.x, ball.y, 0)
        .setLinearDamping(0.05)
        .setAngularDamping(0.05)
        .setCanSleep(false)
    );
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(hx, hy, hz).setRestitution(0.4).setFriction(0.3),
      body,
    );

    bodies.push(body);
    meshes.push(mesh);
    colorIndices.push(ball.colorIndex);
  }

  const origins = bodies.map(b => {
    const t = b.translation();
    return { x: t.x, y: t.y, z: t.z };
  });
  const phases = new Float32Array(meshes.length);
  for (let i = 0; i < phases.length; i++) phases[i] = Math.random() * Math.PI * 2;

  // Dark grid background
  const vRad = (VFOV * Math.PI) / 180;
  const visH = 2 * camDist * Math.tan(vRad / 2);
  const visW = visH * aspect;

  // Circuit board background lines
  const bgGroup = new THREE.Group();
  const gridMat = new THREE.LineBasicMaterial({ color: 0x112233, transparent: true, opacity: 0.15 });
  for (let i = 0; i < 30; i++) {
    const pts: THREE.Vector3[] = [];
    let x = (Math.random() - 0.5) * visW;
    let y = (Math.random() - 0.5) * visH;
    pts.push(new THREE.Vector3(x, y, -2));
    for (let s = 0; s < 4 + Math.floor(Math.random() * 4); s++) {
      if (Math.random() > 0.5) x += (Math.random() - 0.5) * 10;
      else y += (Math.random() - 0.5) * 10;
      pts.push(new THREE.Vector3(x, y, -2));
    }
    bgGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat.clone()));
  }
  scene.add(bgGroup);

  // Grab handlers
  const grabbed: RAPIER.RigidBody[] = [];
  const grabTarget = { x: 0, y: 0 };
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const hitPoint = new THREE.Vector3();

  function screenToWorld(mx: number, my: number) {
    pointer.set((mx / w) * 2 - 1, -(my / h) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    raycaster.ray.intersectPlane(plane, hitPoint);
    return { x: hitPoint.x, y: hitPoint.y };
  }

  const canvas = renderer.domElement;
  let grabbing = false;

  function onMouseDown(e: MouseEvent) {
    const wp = screenToWorld(e.offsetX, e.offsetY);
    grabbed.length = 0;
    if (mode === "broken") {
      for (const body of bodies) {
        const pos = body.translation();
        if (Math.hypot(pos.x - wp.x, pos.y - wp.y) < 3) grabbed.push(body);
      }
    }
    if (grabbed.length) { grabTarget.x = wp.x; grabTarget.y = wp.y; grabbing = true; }
  }
  function onMouseMove(e: MouseEvent) {
    if (!grabbing) return;
    const wp = screenToWorld(e.offsetX, e.offsetY);
    grabTarget.x = wp.x; grabTarget.y = wp.y;
  }
  function onMouseUp() { grabbed.length = 0; grabbing = false; }

  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);

  // Spin
  let spinAngle = 0;
  const _yAxis = new THREE.Vector3(0, 1, 0);
  const _spinQuat = new THREE.Quaternion();
  const _vec3 = new THREE.Vector3();

  let dragActive = false;
  let lastX = 0;
  function onPointerDown(e: PointerEvent) {
    if (mode !== "broken") { dragActive = true; lastX = e.clientX; }
  }
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

    // Grab force
    for (const body of grabbed) {
      const pos = body.translation();
      body.setLinvel({ x: (grabTarget.x - pos.x) * 12, y: (grabTarget.y - pos.y) * 12, z: 0 }, true);
    }

    // Spring to origin (when not broken)
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
      const rot = bodies[i].rotation();
      _vec3.set(pos.x, pos.y, pos.z).applyQuaternion(_spinQuat);
      meshes[i].position.copy(_vec3);
      meshes[i].quaternion.set(rot.x, rot.y, rot.z, rot.w);
    }

    // Neon glow animation
    if (mode === "on") {
      for (let i = 0; i < meshes.length; i++) {
        const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = 0.5 + 0.3 * Math.sin(elapsed * 1.2 + phases[i]);
      }
      // Background traces pulse
      bgGroup.children.forEach((child, i) => {
        if (child instanceof THREE.Line) {
          const mat = child.material as THREE.LineBasicMaterial;
          mat.color.setHex(0x003355);
          mat.opacity = 0.15 + 0.1 * Math.sin(elapsed * 1.5 + i * 0.7);
        }
      });
    }

    if (mode === "broken") {
      const t = elapsed - breakTime;
      // Flicker and die over ~4s
      for (let i = 0; i < meshes.length; i++) {
        const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
        const deathT = 1 + (phases[i] / (Math.PI * 2)) * 3; // 1-4s per block
        const progress = t / deathT;
        if (progress >= 1) {
          mat.emissiveIntensity = 0;
          mat.color.setHex(0x111111);
        } else if (progress > 0.2) {
          const flicker = Math.sin(t * 15 + phases[i]) > 0 ? 1 : 0.1;
          mat.emissiveIntensity = flicker * (1 - progress) * 0.8;
        }
      }
      bloomPass.strength = Math.max(0, 1.2 * (1 - t / 4));

      // Background sparks
      bgGroup.children.forEach((child) => {
        if (child instanceof THREE.Line) {
          const mat = child.material as THREE.LineBasicMaterial;
          mat.color.setHex(t < 1 ? 0xff4400 : 0x110000);
          mat.opacity = t < 1 ? (Math.random() > 0.5 ? 0.5 : 0) : 0.02;
        }
      });
    }

    composer.render();
    frame = requestAnimationFrame(animate);
  }

  frame = requestAnimationFrame(animate);

  return {
    setMode(newMode: HeroMode) {
      mode = newMode;
      if (newMode === "off") {
        renderer.setClearColor(0x0a0a12);
        bloomPass.strength = 0;
        bloomPass.radius = 0;
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          mat.color.setHex(0x222233);
          mat.emissive.setHex(0x000000);
          mat.emissiveIntensity = 0;
          mat.roughness = 0.3;
          mat.metalness = 0.8;
        }
        bgGroup.children.forEach((child) => {
          if (child instanceof THREE.Line) {
            (child.material as THREE.LineBasicMaterial).color.setHex(0x112233);
            (child.material as THREE.LineBasicMaterial).opacity = 0.15;
          }
        });
      } else if (newMode === "on") {
        renderer.setClearColor(0x080c14);
        bloomPass.strength = 1.0;
        bloomPass.radius = 0.4;
        bloomPass.threshold = 0.2;
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          const neon = NEON_COLORS[colorIndices[i] % NEON_COLORS.length];
          mat.color.setHex(neon);
          mat.emissive.setHex(neon);
          mat.emissiveIntensity = 0.6;
          mat.roughness = 0.15;
          mat.metalness = 0.3;
          mat.clearcoat = 0.8;
        }
      } else if (newMode === "broken") {
        breakTime = (performance.now() - startTime) / 1000;
        renderer.setClearColor(0x030303);
        bloomPass.strength = 1.5;
        bloomPass.threshold = 0.1;

        // Flash bright
        for (let i = 0; i < meshes.length; i++) {
          const mat = meshes[i].material as THREE.MeshPhysicalMaterial;
          mat.emissiveIntensity = 1.5;
        }

        // Heavy gravity, angular chaos
        world.gravity = { x: 0, y: -60, z: 0 };
        for (const body of bodies) {
          body.wakeUp();
          body.setLinvel({
            x: (Math.random() - 0.5) * 20,
            y: Math.random() * 15 + 5,
            z: (Math.random() - 0.5) * 10,
          }, true);
          // Strong angular velocity for tumbling letter blocks
          body.setAngvel({
            x: (Math.random() - 0.5) * 15,
            y: (Math.random() - 0.5) * 15,
            z: (Math.random() - 0.5) * 15,
          }, true);
        }
      }
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
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
