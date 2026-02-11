import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { FONT, CHAR_W, CHAR_H, CHAR_GAP, LINE_GAP, SPACE_W } from "./font";
import { LIGHT, SHINY } from "./colors";
import { useTheme } from "../store/theme";

const DEPTH = 0.92;
const VFOV = 50;
const PARTICLE_COUNT = 60;
const _yAxis = new THREE.Vector3(0, 1, 0);
const _spinQuat = new THREE.Quaternion();
const _vec3 = new THREE.Vector3();

type Letter = { colorIndex: number; offsets: { x: number; y: number }[]; cx: number; cy: number; scale: number };

type SceneState = {
  world: RAPIER.World;
  bodies: RAPIER.RigidBody[];
  meshes: THREE.Group[];
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  composer: EffectComposer;
  bloomPass: UnrealBloomPass;
  particles: THREE.Points;
  particleVelocities: Float32Array;
  frame: number;
  origins: { x: number; y: number; z: number }[];
  anchored: boolean;
  colorIndices: number[];
  shiny: boolean;
  startTime: number;
  phases: Float32Array;
  camDist: number;
  spinAngle: number;
  ageCount: number;
};

type LineSpec = { text: string; scale: number };

function layoutLetters(specs: LineSpec[]): { letters: Letter[]; maxW: number; totalH: number } {
  const lineLayouts: { chars: { char: string; col: number }[]; width: number; scale: number }[] = [];
  for (const { text, scale } of specs) {
    const chars: { char: string; col: number }[] = [];
    let col = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === " ") { col += SPACE_W * scale; continue; }
      chars.push({ char: text[i], col });
      col += CHAR_W * scale;
      if (i + 1 < text.length && text[i + 1] !== " ") col += CHAR_GAP * scale;
    }
    lineLayouts.push({ chars, width: col, scale });
  }

  const maxW = Math.max(...lineLayouts.map(l => l.width));
  let totalH = 0;
  for (let i = 0; i < lineLayouts.length; i++) {
    totalH += CHAR_H * lineLayouts[i].scale;
    if (i > 0) totalH += LINE_GAP * Math.max(lineLayouts[i - 1].scale, lineLayouts[i].scale);
  }
  const letters: Letter[] = [];

  let curY = 0;
  for (let li = 0; li < lineLayouts.length; li++) {
    const { chars, width: lineW, scale } = lineLayouts[li];
    if (li > 0) curY += LINE_GAP * Math.max(lineLayouts[li - 1].scale, lineLayouts[li].scale);
    const lineOffX = (maxW - lineW) / 2;

    for (const { char, col } of chars) {
      const glyph = FONT[char];
      if (!glyph) continue;
      const abs: { x: number; y: number }[] = [];
      for (let r = 0; r < CHAR_H; r++)
        for (let c = 0; c < CHAR_W; c++)
          if (glyph[r][c]) abs.push({ x: lineOffX + col + c * scale, y: curY + r * scale });
      if (!abs.length) continue;

      const comX = abs.reduce((s, p) => s + p.x, 0) / abs.length;
      const comY = abs.reduce((s, p) => s + p.y, 0) / abs.length;
      letters.push({
        colorIndex: Math.floor(Math.random() * LIGHT.hex.length),
        offsets: abs.map(p => ({ x: p.x - comX, y: -(p.y - comY) })),
        cx: comX - maxW / 2,
        cy: -(comY - totalH / 2),
        scale,
      });
    }
    curY += CHAR_H * scale;
  }
  return { letters, maxW, totalH };
}

function setupScene(container: HTMLElement): { scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer; composer: EffectComposer; bloomPass: UnrealBloomPass; w: number; h: number } {
  const w = container.clientWidth;
  const h = container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(VFOV, w / h, 0.1, 200);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xffffff);
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const hemi = new THREE.HemisphereLight(0xfff5e6, 0xe8f0ff, 0.4);
  scene.add(hemi);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(10, 20, 15);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(1024, 1024);
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 100;
  dirLight.shadow.camera.left = -30;
  dirLight.shadow.camera.right = 30;
  dirLight.shadow.camera.top = 30;
  dirLight.shadow.camera.bottom = -30;
  dirLight.shadow.radius = 4;
  scene.add(dirLight);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(w, h),
    0, 0, 0, // disabled by default (light mode)
  );
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  return { scene, camera, renderer, composer, bloomPass, w, h };
}

function createLetterBodies(
  letters: Letter[],
  world: RAPIER.World,
  scene: THREE.Scene,
): { bodies: RAPIER.RigidBody[]; meshes: THREE.Group[] } {
  const shape = new THREE.Shape();
  const s = 0.92, r = 0.04;
  shape.moveTo(-s/2 + r, -s/2);
  shape.lineTo(s/2 - r, -s/2);
  shape.quadraticCurveTo(s/2, -s/2, s/2, -s/2 + r);
  shape.lineTo(s/2, s/2 - r);
  shape.quadraticCurveTo(s/2, s/2, s/2 - r, s/2);
  shape.lineTo(-s/2 + r, s/2);
  shape.quadraticCurveTo(-s/2, s/2, -s/2, s/2 - r);
  shape.lineTo(-s/2, -s/2 + r);
  shape.quadraticCurveTo(-s/2, -s/2, -s/2 + r, -s/2);
  const boxGeo = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: false });
  boxGeo.translate(0, 0, -DEPTH / 2);

  const bodies: RAPIER.RigidBody[] = [];
  const meshes: THREE.Group[] = [];

  for (const letter of letters) {
    const mat = new THREE.MeshPhysicalMaterial({
      color: LIGHT.hex[letter.colorIndex],
      roughness: 0.6,
      metalness: 0.1,
      clearcoat: 0.15,
      clearcoatRoughness: 0.4,
    });
    const ls = letter.scale;
    const group = new THREE.Group();
    for (const off of letter.offsets) {
      const mesh = new THREE.Mesh(boxGeo, mat);
      mesh.position.set(off.x, off.y, 0);
      mesh.scale.set(ls, ls, ls);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
    group.position.set(letter.cx, letter.cy, 0);
    scene.add(group);

    const halfCube = 0.46 * ls;
    const body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(letter.cx, letter.cy, 0)
        .setLinearDamping(0.5)
        .setAngularDamping(0.5)
        .setCanSleep(false)
    );
    for (const off of letter.offsets) {
      world.createCollider(
        RAPIER.ColliderDesc.cuboid(halfCube, halfCube, DEPTH * ls / 2)
          .setTranslation(off.x, off.y, 0)
          .setRestitution(0.3)
          .setFriction(0.5),
        body,
      );
    }
    bodies.push(body);
    meshes.push(group);
  }

  return { bodies, meshes };
}

function createParticles(scene: THREE.Scene, camera: THREE.PerspectiveCamera): { points: THREE.Points; velocities: Float32Array } {
  const camDist = camera.position.z;
  const vRad = (VFOV * Math.PI) / 180;
  const visH = 2 * camDist * Math.tan(vRad / 2);
  const visW = visH * (camera.aspect);

  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * visW;
    positions[i * 3 + 1] = (Math.random() - 0.5) * visH;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = Math.random() * 0.03 + 0.01;
    velocities[i * 3 + 2] = 0;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // tiny radial gradient sparkle texture
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.3, "rgba(255,255,255,0.6)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);
  const texture = new THREE.CanvasTexture(canvas);

  const mat = new THREE.PointsMaterial({
    size: 0.15,
    map: texture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  return { points, velocities };
}

// 5% horizontal padding, 12% vertical padding
function fitCamera(camera: THREE.PerspectiveCamera, maxW: number, totalH: number, aspect: number): number {
  const vRad = (VFOV * Math.PI) / 180;
  const distH = ((totalH / 0.76) / 2) / Math.tan(vRad / 2);
  const hRad = 2 * Math.atan(aspect * Math.tan(vRad / 2));
  const distW = ((maxW / 0.9) / 2) / Math.tan(hRad / 2);
  const dist = Math.max(distH, distW);
  camera.position.set(0, 0, dist);
  camera.lookAt(0, 0, 0);
  return dist;
}

function addWalls(world: RAPIER.World, camera: THREE.PerspectiveCamera, aspect: number): void {
  const camDist = camera.position.z;
  const vRad = (VFOV * Math.PI) / 180;
  const visH = 2 * camDist * Math.tan(vRad / 2);
  const visW = visH * aspect;
  const half = Math.max(visW, visH) / 2 + 2;

  function wall(x: number, y: number, z: number, hx: number, hy: number, hz: number): void {
    const b = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z));
    world.createCollider(RAPIER.ColliderDesc.cuboid(hx, hy, hz).setRestitution(0.2).setFriction(0.5), b);
  }
  wall(0, -visH / 2 + 8, 0, half, 1, half);    // bottom
  wall(0, visH / 2 + 1, 0, half, 1, half);     // top
  wall(-half, 0, 0, 1, visH / 2 + 1, half);    // left
  wall(half, 0, 0, 1, visH / 2 + 1, half);     // right
  wall(0, 0, -half, half, visH / 2 + 1, 1);    // back
  wall(0, 0, half, half, visH / 2 + 1, 1);     // front
}

function setupGrabHandlers(
  canvas: HTMLCanvasElement,
  camera: THREE.PerspectiveCamera,
  bodies: RAPIER.RigidBody[],
  w: number,
  h: number,
): { grabbed: RAPIER.RigidBody[]; target: { x: number; y: number } } {
  const grabbed: RAPIER.RigidBody[] = [];
  const target = { x: 0, y: 0 };
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const hitPoint = new THREE.Vector3();

  function screenToWorld(mx: number, my: number): { x: number; y: number } {
    pointer.set((mx / w) * 2 - 1, -(my / h) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    raycaster.ray.intersectPlane(plane, hitPoint);
    return { x: hitPoint.x, y: hitPoint.y };
  }

  function startGrab(mx: number, my: number): boolean {
    const wp = screenToWorld(mx, my);
    grabbed.length = 0;
    for (const body of bodies) {
      const pos = body.translation();
      const dx = pos.x - wp.x, dy = pos.y - wp.y;
      if (dx * dx + dy * dy < 25) {
        body.wakeUp();
        grabbed.push(body);
      }
    }
    if (grabbed.length) { target.x = wp.x; target.y = wp.y; }
    return grabbed.length > 0;
  }

  function moveGrab(mx: number, my: number): void {
    const wp = screenToWorld(mx, my);
    target.x = wp.x;
    target.y = wp.y;
  }

  function endGrab(): void {
    for (const b of grabbed) b.wakeUp();
    grabbed.length = 0;
  }

  function touchPos(e: TouchEvent): { x: number; y: number } {
    const t = e.touches[0], r = canvas.getBoundingClientRect();
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  }

  canvas.addEventListener("mousedown", e => startGrab(e.offsetX, e.offsetY));
  canvas.addEventListener("mousemove", e => { if (grabbed.length) moveGrab(e.offsetX, e.offsetY); });
  canvas.addEventListener("mouseup", endGrab);
  canvas.addEventListener("touchstart", e => {
    const p = touchPos(e);
    if (startGrab(p.x, p.y)) e.preventDefault();
  }, { passive: false });
  canvas.addEventListener("touchmove", e => {
    if (!grabbed.length) return;
    e.preventDefault();
    const p = touchPos(e);
    moveGrab(p.x, p.y);
  }, { passive: false });
  canvas.addEventListener("touchend", endGrab);

  return { grabbed, target };
}

const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

export default function Hero({ name, dob }: { name: string; dob: string }) {
  const age = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<SceneState | null>(null);
  const [chaos, setChaos] = useState(false);
  const shiny = useTheme(s => s.shiny);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;

    let dragging = false;
    let lastX = 0;
    function onPointerDown(e: PointerEvent) {
      dragging = true;
      lastX = e.clientX;
    }
    function onPointerMove(e: PointerEvent) {
      if (!dragging || !stateRef.current) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      stateRef.current.spinAngle += dx * 0.01;
    }
    function onPointerUp() { dragging = false; }
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);

    RAPIER.init().then(() => {
      if (disposed) return;

      const { scene, camera, renderer, composer, bloomPass, w, h } = setupScene(container);
      const world = new RAPIER.World({ x: 0, y: 0, z: 0 });
      const d = new Date(dob);
      const dateLine = `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()} ${d.getUTCFullYear()}`;
      const { letters, maxW, totalH } = layoutLetters([
        { text: String(age), scale: 2.5 },
        { text: "HAPPY", scale: 1.4 },
        { text: "BIRTHDAY", scale: 1.4 },
        { text: name.toUpperCase(), scale: 1.4 },
        { text: dateLine, scale: 0.45 },
      ]);
      const { bodies, meshes } = createLetterBodies(letters, world, scene);
      const aspect = w / h;

      const camDist = fitCamera(camera, maxW, totalH, aspect);
      addWalls(world, camera, aspect);
      const { grabbed, target } = setupGrabHandlers(renderer.domElement, camera, bodies, w, h);

      const { points: particles, velocities: particleVelocities } = createParticles(scene, camera);

      const origins = bodies.map(b => {
        const t = b.translation();
        return { x: t.x, y: t.y, z: t.z };
      });
      const colorIndices = letters.map(l => l.colorIndex);
      const phases = new Float32Array(meshes.length);
      for (let i = 0; i < phases.length; i++) phases[i] = Math.random() * Math.PI * 2;

      stateRef.current = {
        world, bodies, meshes, renderer, camera, scene, composer, bloomPass,
        particles, particleVelocities,
        frame: 0, origins, anchored: true, colorIndices, shiny: false,
        startTime: performance.now(), phases, camDist, spinAngle: 0,
        ageCount: String(age).length,
      };

      const vRad = (VFOV * Math.PI) / 180;
      const visH = 2 * camDist * Math.tan(vRad / 2);
      const visW = visH * aspect;

      function animate(): void {
        const st = stateRef.current!;
        const elapsed = (performance.now() - st.startTime) / 1000;

        if (!st.anchored) {
          for (const body of grabbed) {
            const pos = body.translation();
            body.setLinvel({ x: (target.x - pos.x) * 12, y: (target.y - pos.y) * 12, z: 0 }, true);
            body.setAngvel({ x: 0, y: 0, z: 0 }, true);
          }
        }
        if (st.anchored) {
          for (let i = 0; i < bodies.length; i++) {
            if (grabbed.includes(bodies[i])) continue;
            const pos = bodies[i].translation();
            const orig = origins[i];
            bodies[i].setLinvel({ x: (orig.x - pos.x) * 20, y: (orig.y - pos.y) * 20, z: -pos.z * 20 }, true);
            const rot = bodies[i].rotation();
            bodies[i].setAngvel({ x: -rot.x * 8, y: -rot.y * 8, z: -rot.z * 8 }, true);
          }
        }
        world.step();
        _spinQuat.setFromAxisAngle(_yAxis, st.spinAngle);
        for (let i = 0; i < bodies.length; i++) {
          const pos = bodies[i].translation();
          const rot = bodies[i].rotation();
          _vec3.set(pos.x, pos.y, pos.z).applyQuaternion(_spinQuat);
          meshes[i].position.copy(_vec3);
          meshes[i].quaternion.set(rot.x, rot.y, rot.z, rot.w).premultiply(_spinQuat);
        }

        if (st.shiny) {
          for (let i = 0; i < meshes.length; i++) {
            const isAge = i < st.ageCount;
            for (const child of meshes[i].children) {
              const mat = (child as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
              if (isAge) {
                // always-bright glow cycling through hues
                const hue = (elapsed * 0.08 + st.phases[i]) % 1;
                mat.emissive.setHSL(hue, 1, 0.5);
                mat.emissiveIntensity = 0.8 + 0.2 * Math.sin(elapsed * 2 + st.phases[i]);
              } else {
                mat.emissiveIntensity = 0.5 + 0.3 * Math.sin(elapsed * 1.5 + st.phases[i]);
              }
            }
          }

          // animate particles
          const posAttr = particles.geometry.getAttribute("position") as THREE.BufferAttribute;
          const pos = posAttr.array as Float32Array;
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            pos[i * 3] += particleVelocities[i * 3];
            pos[i * 3 + 1] += particleVelocities[i * 3 + 1];
            // wrap around
            if (pos[i * 3 + 1] > visH / 2) {
              pos[i * 3 + 1] = -visH / 2;
              pos[i * 3] = (Math.random() - 0.5) * visW;
            }
          }
          posAttr.needsUpdate = true;
        }

        st.composer.render();
        st.frame = requestAnimationFrame(animate);
      }
      animate();
    });

    return () => {
      disposed = true;
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      const s = stateRef.current;
      if (s) {
        cancelAnimationFrame(s.frame);
        s.composer.dispose();
        s.renderer.dispose();
        container.removeChild(s.renderer.domElement);
        s.world.free();
      }
    };
  }, []);

  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;

    s.shiny = shiny;
    const palette = shiny ? SHINY : LIGHT;
    s.renderer.setClearColor(shiny ? 0x0a0a0f : 0xffffff);

    // toggle bloom
    if (shiny) {
      s.bloomPass.strength = 1.2;
      s.bloomPass.radius = 0.4;
      s.bloomPass.threshold = 0.2;
      (s.particles.material as THREE.PointsMaterial).opacity = 0.6;
    } else {
      s.bloomPass.strength = 0;
      s.bloomPass.radius = 0;
      s.bloomPass.threshold = 1;
      (s.particles.material as THREE.PointsMaterial).opacity = 0;
    }

    for (let i = 0; i < s.meshes.length; i++) {
      const group = s.meshes[i];
      const colorIndex = s.colorIndices[i];
      const hexColor = palette.hex[colorIndex];

      for (const mesh of group.children) {
        const material = (mesh as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
        material.color.setHex(hexColor);
        if (shiny) {
          material.emissive.setHex(hexColor);
          material.emissiveIntensity = 0.6;
          material.roughness = 0.3;
          material.metalness = 0.2;
          material.clearcoat = 0;
        } else {
          material.emissive.setHex(0x000000);
          material.emissiveIntensity = 0;
          material.roughness = 0.6;
          material.metalness = 0.1;
          material.clearcoat = 0.15;
        }
      }
    }
  }, [shiny]);

  function unleashChaos(): void {
    const s = stateRef.current;
    if (!s) return;
    setChaos(true);
    s.anchored = false;
    s.world.gravity = { x: 0, y: -150, z: 0 };
    for (const body of s.bodies) {
      body.wakeUp();
      body.setLinvel({ x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 5, z: (Math.random() - 0.5) * 3 }, true);
      body.setAngvel({ x: (Math.random() - 0.5) * 3, y: (Math.random() - 0.5) * 3, z: (Math.random() - 0.5) * 3 }, true);
    }
  }

  return (
    <section ref={containerRef} className="h-dvh relative overflow-hidden" data-dot-grid data-shiny-overlay style={{ background: 'var(--bg-hero)' }}>
      <nav className="relative z-10 flex items-center px-6 py-4">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>clockwork.cards/{name.toLowerCase()}</span>
        <div className="ml-auto flex gap-2 items-center">
          <button
            onClick={() => useTheme.getState().toggle()}
            className="relative w-10 h-5 rounded-full cursor-pointer transition-colors duration-300"
            style={{ background: shiny ? "var(--accent-1)" : "var(--border-color)" }}
          >
            <span
              className="absolute top-0.5 w-4 h-4 rounded-full transition-transform duration-300"
              style={{
                background: shiny ? "#000" : "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                transform: shiny ? "translateX(21px)" : "translateX(2px)",
              }}
            />
          </button>
        </div>
      </nav>
      <div className="absolute bottom-6 right-6 z-10 flex flex-col items-center gap-1.5">
        <button
          onClick={!chaos ? unleashChaos : undefined}
          className={`relative w-10 h-10 rounded-full transition-all duration-300 ${
            chaos
              ? "cursor-default scale-90"
              : "cursor-pointer hover:scale-105 active:scale-95"
          }`}
          style={{
            background: chaos
              ? "radial-gradient(circle at 40% 35%, #666, #333)"
              : "radial-gradient(circle at 40% 35%, #ff4444, #cc0000)",
            boxShadow: chaos
              ? "0 2px 8px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(0,0,0,0.3)"
              : "0 0 12px rgba(255,0,0,0.4), 0 0 24px rgba(255,0,0,0.2), 0 4px 8px rgba(0,0,0,0.3), inset 0 -3px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,100,100,0.3)",
            border: chaos ? "3px solid #555" : "3px solid #990000",
          }}
        />
        <span
          className="text-center leading-tight max-w-24"
          style={{
            fontFamily: "'Caveat', 'Segoe Script', cursive",
            color: chaos ? "var(--text-secondary)" : "var(--text-primary)",
            opacity: chaos ? 0.4 : 0.7,
            textDecoration: "none",
            fontSize: "0.95rem",
          }}
        >
          Do not press this button
        </span>
      </div>
    </section>
  );
}
