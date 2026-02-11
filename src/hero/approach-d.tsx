import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { FONT, CHAR_W, CHAR_H, CHAR_GAP, LINE_GAP, SPACE_W, birthdayLines } from "./font";
import { LIGHT, SHINY } from "./colors";
import { useTheme } from "../store/theme";

const DEPTH = 0.6;
const VFOV = 50;

type Letter = { colorIndex: number; offsets: { x: number; y: number }[]; cx: number; cy: number };

type SceneState = {
  world: RAPIER.World;
  bodies: RAPIER.RigidBody[];
  meshes: THREE.Group[];
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  frame: number;
  origins: { x: number; y: number; z: number }[];
  anchored: boolean;
  colorIndices: number[];
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

function setupScene(container: HTMLElement): { scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer; w: number; h: number } {
  const w = container.clientWidth;
  const h = container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(VFOV, w / h, 0.1, 200);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(10, 20, 15);
  scene.add(dirLight);

  return { scene, camera, renderer, w, h };
}

function createLetterBodies(
  letters: Letter[],
  world: RAPIER.World,
  scene: THREE.Scene,
): { bodies: RAPIER.RigidBody[]; meshes: THREE.Group[] } {
  const boxGeo = new THREE.BoxGeometry(0.92, 0.92, DEPTH);
  const bodies: RAPIER.RigidBody[] = [];
  const meshes: THREE.Group[] = [];

  for (const letter of letters) {
    const mat = new THREE.MeshStandardMaterial({ color: LIGHT.hex[letter.colorIndex] });
    const group = new THREE.Group();
    for (const off of letter.offsets) {
      const mesh = new THREE.Mesh(boxGeo, mat);
      mesh.position.set(off.x, off.y, 0);
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

      const { scene, camera, renderer, w, h } = setupScene(container);
      const world = new RAPIER.World({ x: 0, y: 0, z: 0 });
      const { letters, maxW, totalH } = layoutLetters(birthdayLines(name, age));
      const { bodies, meshes } = createLetterBodies(letters, world, scene);
      const aspect = w / h;

      fitCamera(camera, maxW, totalH, aspect);
      addWalls(world, camera, aspect);
      const { grabbed, target } = setupGrabHandlers(renderer.domElement, camera, bodies, w, h);

      const origins = bodies.map(b => {
        const t = b.translation();
        return { x: t.x, y: t.y, z: t.z };
      });
      const colorIndices = letters.map(l => l.colorIndex);
      stateRef.current = { world, bodies, meshes, renderer, camera, scene, frame: 0, origins, anchored: true, colorIndices };

      function animate(): void {
        for (const body of grabbed) {
          const pos = body.translation();
          body.setLinvel({ x: (target.x - pos.x) * 12, y: (target.y - pos.y) * 12, z: 0 }, true);
          body.setAngvel({ x: 0, y: 0, z: 0 }, true);
        }
        if (stateRef.current!.anchored) {
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
        renderer.render(scene, camera);
        stateRef.current!.frame = requestAnimationFrame(animate);
      }
      animate();
    });

    return () => {
      disposed = true;
      const s = stateRef.current;
      if (s) {
        cancelAnimationFrame(s.frame);
        s.renderer.dispose();
        container.removeChild(s.renderer.domElement);
        s.world.free();
      }
    };
  }, []);

  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;

    const palette = shiny ? SHINY : LIGHT;
    s.renderer.setClearColor(shiny ? 0x0a0a0f : 0xfffbeb);

    for (let i = 0; i < s.meshes.length; i++) {
      const group = s.meshes[i];
      const colorIndex = s.colorIndices[i];
      const hexColor = palette.hex[colorIndex];

      for (const mesh of group.children) {
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.color.setHex(hexColor);
        if (shiny) {
          material.emissive.setHex(hexColor);
          material.emissiveIntensity = 0.4;
        } else {
          material.emissive.setHex(0x000000);
          material.emissiveIntensity = 0;
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
    <section ref={containerRef} className="h-dvh relative overflow-hidden" style={{ background: 'var(--bg-hero)' }}>
      <nav className="relative z-10 flex items-center px-6 py-4">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>clockwork.cards/{name.toLowerCase()}</span>
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
