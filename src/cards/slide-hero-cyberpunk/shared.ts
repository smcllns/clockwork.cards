// Hero variation types shared across all 5 variations
import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { FONT, CHAR_W, CHAR_H, CHAR_GAP, LINE_GAP, SPACE_W } from "./font";
import { LIGHT, SHINY } from "./colors";

export type HeroMode = "off" | "on" | "broken" | "broken-off";

export type Ball = { x: number; y: number; colorIndex: number; scale: number };
export type LineSpec = { text: string; scale: number };

export const VFOV = 50;
export const BALL_RADIUS_FACTOR = 0.46;
const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

// Shared layout engine
export function layoutBalls(specs: LineSpec[]): { balls: Ball[]; maxW: number; totalH: number } {
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
  const gapBefore = (i: number) =>
    i > 0 ? LINE_GAP * Math.max(lineLayouts[i - 1].scale, lineLayouts[i].scale) : 0;

  let totalH = 0;
  for (let i = 0; i < lineLayouts.length; i++) {
    totalH += CHAR_H * lineLayouts[i].scale + gapBefore(i);
  }

  const balls: Ball[] = [];
  let curY = 0;
  for (let li = 0; li < lineLayouts.length; li++) {
    const { chars, width: lineW, scale } = lineLayouts[li];
    curY += gapBefore(li);
    const lineOffX = (maxW - lineW) / 2;

    for (const { char, col } of chars) {
      const glyph = FONT[char];
      if (!glyph) continue;
      const charColor = Math.floor(Math.random() * LIGHT.hex.length);
      for (let r = 0; r < CHAR_H; r++) {
        for (let c = 0; c < CHAR_W; c++) {
          if (!glyph[r][c]) continue;
          const x = lineOffX + col + c * scale - maxW / 2;
          const y = -(curY + r * scale - totalH / 2);
          balls.push({ x, y, colorIndex: charColor, scale });
        }
      }
    }
    curY += CHAR_H * scale;
  }
  return { balls, maxW, totalH };
}

export function getBirthdaySpecs(name: string, dob: string): LineSpec[] {
  const age = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const d = new Date(dob);
  const dateLine = `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()} ${d.getUTCFullYear()}`;
  return [
    { text: String(age), scale: 2.5 },
    { text: "HAPPY", scale: 1.4 },
    { text: "BIRTHDAY", scale: 1.4 },
    { text: name.toUpperCase(), scale: 1.4 },
    { text: dateLine, scale: 0.45 },
  ];
}

// Shared scene setup
export type SceneOpts = { antialias?: boolean; shadows?: boolean };
export function setupScene(container: HTMLElement, opts?: SceneOpts) {
  const aa = opts?.antialias ?? true;
  const shadows = opts?.shadows ?? true;
  const w = container.clientWidth;
  const h = container.clientHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(VFOV, w / h, 0.1, 200);
  const renderer = new THREE.WebGLRenderer({ antialias: aa });
  renderer.setClearColor(0xffffff);
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  scene.add(new THREE.HemisphereLight(0xfff5e6, 0xe8f0ff, 0.4));
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
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0, 0, 0);
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  return { scene, camera, renderer, composer, bloomPass, w, h, dirLight };
}

export function fitCamera(camera: THREE.PerspectiveCamera, maxW: number, totalH: number, aspect: number): number {
  const vRad = (VFOV * Math.PI) / 180;
  const distH = ((totalH / 0.76) / 2) / Math.tan(vRad / 2);
  const hRad = 2 * Math.atan(aspect * Math.tan(vRad / 2));
  const distW = ((maxW / 0.9) / 2) / Math.tan(hRad / 2);
  const dist = Math.max(distH, distW);
  camera.position.set(0, 0, dist);
  camera.lookAt(0, 0, 0);
  return dist;
}

export function addWalls(world: RAPIER.World, camera: THREE.PerspectiveCamera, aspect: number): void {
  const camDist = camera.position.z;
  const vRad = (VFOV * Math.PI) / 180;
  const visH = 2 * camDist * Math.tan(vRad / 2);
  const half = Math.max(visH * aspect, visH) / 2 + 2;
  const hh = visH / 2 + 1;

  const walls: [number, number, number, number, number, number][] = [
    [0, -hh, 0, half, 1, half],
    [0, hh, 0, half, 1, half],
    [-half, 0, 0, 1, hh, half],
    [half, 0, 0, 1, hh, half],
    [0, 0, -half, half, hh, 1],
    [0, 0, half, half, hh, 1],
  ];
  for (const [x, y, z, hx, hy, hz] of walls) {
    const b = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z));
    world.createCollider(RAPIER.ColliderDesc.cuboid(hx, hy, hz).setRestitution(0.6).setFriction(0.2), b);
  }
}

export function createBalls(
  balls: Ball[],
  world: RAPIER.World,
  scene: THREE.Scene,
  palette: { hex: number[] } = LIGHT,
  materialOverrides?: Partial<THREE.MeshPhysicalMaterialParameters>,
): { bodies: RAPIER.RigidBody[]; meshes: THREE.Mesh[] } {
  const sphereGeo = new THREE.SphereGeometry(BALL_RADIUS_FACTOR, 16, 12);
  const bodies: RAPIER.RigidBody[] = [];
  const meshes: THREE.Mesh[] = [];

  for (const ball of balls) {
    const mat = new THREE.MeshPhysicalMaterial({
      color: palette.hex[ball.colorIndex],
      roughness: 0.4,
      metalness: 0.15,
      clearcoat: 0.3,
      clearcoatRoughness: 0.3,
      ...materialOverrides,
    });
    const mesh = new THREE.Mesh(sphereGeo, mat);
    mesh.scale.setScalar(ball.scale);
    mesh.position.set(ball.x, ball.y, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const radius = BALL_RADIUS_FACTOR * ball.scale;
    const body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(ball.x, ball.y, 0)
        .setLinearDamping(0.05)
        .setAngularDamping(0.05)
        .setCanSleep(false)
    );
    world.createCollider(
      RAPIER.ColliderDesc.ball(radius)
        .setRestitution(0.7)
        .setFriction(0.2),
      body,
    );
    bodies.push(body);
    meshes.push(mesh);
  }

  return { bodies, meshes };
}

export function setupGrabHandlers(
  canvas: HTMLCanvasElement,
  camera: THREE.PerspectiveCamera,
  bodies: RAPIER.RigidBody[],
  w: number,
  h: number,
): { grabbed: RAPIER.RigidBody[]; target: { x: number; y: number }; cleanup: () => void } {
  const grabbed: RAPIER.RigidBody[] = [];
  const target = { x: 0, y: 0 };
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

  function startGrab(mx: number, my: number): boolean {
    const wp = screenToWorld(mx, my);
    grabbed.length = 0;
    for (const body of bodies) {
      const pos = body.translation();
      const dx = pos.x - wp.x, dy = pos.y - wp.y;
      if (dx * dx + dy * dy < 9) {
        body.wakeUp();
        grabbed.push(body);
      }
    }
    if (grabbed.length) { target.x = wp.x; target.y = wp.y; }
    return grabbed.length > 0;
  }

  function moveGrab(mx: number, my: number) {
    const wp = screenToWorld(mx, my);
    target.x = wp.x;
    target.y = wp.y;
  }

  function endGrab() {
    for (const b of grabbed) b.wakeUp();
    grabbed.length = 0;
  }

  function touchPos(e: TouchEvent) {
    const t = e.touches[0], r = canvas.getBoundingClientRect();
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  }

  function canvasPos(e: MouseEvent): { x: number; y: number } {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  const onMouseDown = (e: MouseEvent) => startGrab(e.offsetX, e.offsetY);
  const onMouseMove = (e: MouseEvent) => { if (grabbed.length) { const p = canvasPos(e); moveGrab(p.x, p.y); } };
  const onTouchStart = (e: TouchEvent) => {
    const p = touchPos(e);
    if (startGrab(p.x, p.y)) e.preventDefault();
  };
  const onTouchMove = (e: TouchEvent) => {
    if (!grabbed.length) return;
    e.preventDefault();
    const p = touchPos(e);
    moveGrab(p.x, p.y);
  };

  canvas.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", endGrab);
  canvas.addEventListener("touchstart", onTouchStart, { passive: false });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", endGrab);

  const cleanup = () => {
    canvas.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", endGrab);
    canvas.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", endGrab);
  };

  return { grabbed, target, cleanup };
}

// Shared re-exports
export { LIGHT, SHINY, THREE, RAPIER };
