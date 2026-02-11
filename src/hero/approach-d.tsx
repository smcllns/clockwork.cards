import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { FONT, CHAR_W, CHAR_H, CHAR_GAP, LINE_GAP, SPACE_W, birthdayLines } from "./font";
import { LIGHT, SHINY } from "./colors";
import { useTheme } from "../store/theme";

const DEPTH = 0.6;
const VFOV = 50;
const PARTICLE_COUNT = 60;

type Letter = { colorIndex: number; offsets: { x: number; y: number }[]; cx: number; cy: number };

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
};

function layoutLetters(lines: string[]): { letters: Letter[]; maxW: number; totalH: number } {
  const lineLayouts: { chars: { char: string; col: number }[]; width: number }[] = [];
  for (const line of lines) {
    const chars: { char: string; col: number }[] = [];
    let col = 0;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === " ") { col += SPACE_W; continue; }
      chars.push({ char: line[i], col });
      col += CHAR_W;
      if (i + 1 < line.length && line[i + 1] !== " ") col += CHAR_GAP;
    }
    lineLayouts.push({ chars, width: col });
  }

  const maxW = Math.max(...lineLayouts.map(l => l.width));
  const totalH = lines.length * CHAR_H + (lines.length - 1) * LINE_GAP;
  const letters: Letter[] = [];

  for (let li = 0; li < lineLayouts.length; li++) {
    const { chars, width: lineW } = lineLayouts[li];
    const lineOffX = (maxW - lineW) / 2;
    const lineOffY = li * (CHAR_H + LINE_GAP);

    for (const { char, col } of chars) {
      const glyph = FONT[char];
      if (!glyph) continue;
      const abs: { x: number; y: number }[] = [];
      for (let r = 0; r < CHAR_H; r++)
        for (let c = 0; c < CHAR_W; c++)
          if (glyph[r][c]) abs.push({ x: lineOffX + col + c, y: lineOffY + r });
      if (!abs.length) continue;

      const comX = abs.reduce((s, p) => s + p.x, 0) / abs.length;
      const comY = abs.reduce((s, p) => s + p.y, 0) / abs.length;
      letters.push({
        colorIndex: Math.floor(Math.random() * LIGHT.hex.length),
        offsets: abs.map(p => ({ x: p.x - comX, y: -(p.y - comY) })),
        cx: comX - maxW / 2,
        cy: -(comY - totalH / 2),
      });
    }
  }
  return { letters, maxW, totalH };
}

function setupScene(container: HTMLElement): { scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer; composer: EffectComposer; bloomPass: UnrealBloomPass; w: number; h: number } {
  const w = container.clientWidth;
  const h = container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(VFOV, w / h, 0.1, 200);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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
    const group = new THREE.Group();
    for (const off of letter.offsets) {
      const mesh = new THREE.Mesh(boxGeo, mat);
      mesh.position.set(off.x, off.y, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
    group.position.set(letter.cx, letter.cy, 0);
    scene.add(group);

    const body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(letter.cx, letter.cy, 0)
        .setLinearDamping(0.5)
        .setAngularDamping(0.5)
        .setCanSleep(false)
    );
    for (const off of letter.offsets) {
      world.createCollider(
        RAPIER.ColliderDesc.cuboid(0.46, 0.46, DEPTH / 2)
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
function fitCamera(camera: THREE.PerspectiveCamera, maxW: number, totalH: number, aspect: number): void {
  const vRad = (VFOV * Math.PI) / 180;
  const distH = ((totalH / 0.76) / 2) / Math.tan(vRad / 2);
  const hRad = 2 * Math.atan(aspect * Math.tan(vRad / 2));
  const distW = ((maxW / 0.9) / 2) / Math.tan(hRad / 2);
  camera.position.set(0, 0, Math.max(distH, distW));
  camera.lookAt(0, 0, 0);
}

function addWalls(world: RAPIER.World, camera: THREE.PerspectiveCamera, aspect: number): void {
  const camDist = camera.position.z;
  const vRad = (VFOV * Math.PI) / 180;
  const visH = 2 * camDist * Math.tan(vRad / 2);
  const visW = visH * aspect;

  function wall(x: number, y: number, z: number, hx: number, hy: number, hz: number): void {
    const b = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z));
    world.createCollider(RAPIER.ColliderDesc.cuboid(hx, hy, hz).setRestitution(0.2).setFriction(0.5), b);
  }
  wall(0, -visH / 2 - 1, 0, visW / 2 + 1, 1, 5);   // bottom
  wall(0, visH / 2 + 1, 0, visW / 2 + 1, 1, 5);     // top
  wall(-visW / 2 - 1, 0, 0, 1, visH / 2 + 1, 5);    // left
  wall(visW / 2 + 1, 0, 0, 1, visH / 2 + 1, 5);     // right
  wall(0, 0, -3, visW / 2 + 1, visH / 2 + 1, 1);    // back
  wall(0, 0, 3, visW / 2 + 1, visH / 2 + 1, 1);     // front
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

export default function ApproachD({ name, age }: { name: string; age: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<SceneState | null>(null);
  const [chaos, setChaos] = useState(false);
  const shiny = useTheme(s => s.shiny);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;

    RAPIER.init().then(() => {
      if (disposed) return;

      const { scene, camera, renderer, composer, bloomPass, w, h } = setupScene(container);
      const world = new RAPIER.World({ x: 0, y: 0, z: 0 });
      const { letters, maxW, totalH } = layoutLetters(birthdayLines(name, age));
      const { bodies, meshes } = createLetterBodies(letters, world, scene);
      const aspect = w / h;

      fitCamera(camera, maxW, totalH, aspect);
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
        startTime: performance.now(), phases,
      };

      const camDist = camera.position.z;
      const vRad = (VFOV * Math.PI) / 180;
      const visH = 2 * camDist * Math.tan(vRad / 2);
      const visW = visH * aspect;

      function animate(): void {
        const st = stateRef.current!;
        const elapsed = (performance.now() - st.startTime) / 1000;

        for (const body of grabbed) {
          const pos = body.translation();
          body.setLinvel({ x: (target.x - pos.x) * 12, y: (target.y - pos.y) * 12, z: 0 }, true);
          body.setAngvel({ x: 0, y: 0, z: 0 }, true);
        }
        if (st.anchored) {
          for (let i = 0; i < bodies.length; i++) {
            if (grabbed.includes(bodies[i])) continue;
            const pos = bodies[i].translation();
            const orig = origins[i];
            bodies[i].setLinvel({ x: (orig.x - pos.x) * 8, y: (orig.y - pos.y) * 8, z: -pos.z * 8 }, true);
            const rot = bodies[i].rotation();
            bodies[i].setAngvel({ x: -rot.x * 8, y: -rot.y * 8, z: -rot.z * 8 }, true);
          }
        }
        world.step();
        for (let i = 0; i < bodies.length; i++) {
          const pos = bodies[i].translation();
          const rot = bodies[i].rotation();
          meshes[i].position.set(pos.x, pos.y, pos.z);
          meshes[i].quaternion.set(rot.x, rot.y, rot.z, rot.w);
        }

        // emissive pulse in shiny mode
        if (st.shiny) {
          for (let i = 0; i < meshes.length; i++) {
            const pulse = 0.5 + 0.3 * Math.sin(elapsed * 1.5 + st.phases[i]);
            for (const child of meshes[i].children) {
              ((child as THREE.Mesh).material as THREE.MeshPhysicalMaterial).emissiveIntensity = pulse;
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
    s.renderer.setClearColor(shiny ? 0x0a0a0f : 0xfffbeb);

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
        <div className="ml-auto flex gap-2">
          {["d", "c"].map(v => (
            <a key={v} href={`?hero=${v}`} className={`text-xs px-2 py-1 rounded ${v === "d" ? "bg-zinc-800 text-white" : "bg-zinc-200 text-zinc-600"}`}>{v.toUpperCase()}</a>
          ))}
        </div>
      </nav>
      {!chaos && (
        <button onClick={unleashChaos} className="absolute bottom-6 right-6 z-10 bg-red-400 hover:bg-red-500 text-white text-xs px-4 py-2 rounded-full shadow-lg transition-colors cursor-pointer">
          do not press this button
        </button>
      )}
    </section>
  );
}
