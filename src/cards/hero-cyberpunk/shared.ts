import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

// Layout specs and camera fit

export const BALL_RADIUS = 0.3;
export const SPRING_STIFFNESS = 20;
export const GRAB_RADIUS = 3;

export interface BallData {
  mesh: THREE.Mesh;
  body: RAPIER.RigidBody;
  anchor: THREE.Vector3;
  grabbed: boolean;
  deathTime?: number;
  flickerInterval?: number;
}

// Create a physics ball
export function createBall(
  scene: THREE.Scene,
  world: RAPIER.World,
  position: THREE.Vector3,
  material: THREE.Material
): BallData {
  // Mesh
  const geometry = new THREE.SphereGeometry(BALL_RADIUS, 8, 6); // Low-poly for perf
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  scene.add(mesh);

  // Physics body
  const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(position.x, position.y, position.z)
    .setCanSleep(false); // Avoid wake jitter

  const body = world.createRigidBody(bodyDesc);

  const colliderDesc = RAPIER.ColliderDesc.ball(BALL_RADIUS);
  world.createCollider(colliderDesc, body);

  return {
    mesh,
    body,
    anchor: position.clone(),
    grabbed: false,
  };
}

// Create walls
export function createWalls(world: RAPIER.World) {
  const wallDistance = 50;

  // Floor
  const floorDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, -wallDistance, 0);
  const floorBody = world.createRigidBody(floorDesc);
  const floorCollider = RAPIER.ColliderDesc.cuboid(100, 0.1, 100);
  world.createCollider(floorCollider, floorBody);

  // Ceiling
  const ceilingDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, wallDistance, 0);
  const ceilingBody = world.createRigidBody(ceilingDesc);
  const ceilingCollider = RAPIER.ColliderDesc.cuboid(100, 0.1, 100);
  world.createCollider(ceilingCollider, ceilingBody);

  // Left/Right/Front/Back
  [-wallDistance, wallDistance].forEach((x) => {
    const desc = RAPIER.RigidBodyDesc.fixed().setTranslation(x, 0, 0);
    const body = world.createRigidBody(desc);
    const collider = RAPIER.ColliderDesc.cuboid(0.1, 100, 100);
    world.createCollider(collider, body);
  });

  [-wallDistance, wallDistance].forEach((z) => {
    const desc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, 0, z);
    const body = world.createRigidBody(desc);
    const collider = RAPIER.ColliderDesc.cuboid(100, 100, 0.1);
    world.createCollider(collider, body);
  });
}

// Fit camera to view all balls
export function fitCameraToObjects(
  camera: THREE.PerspectiveCamera,
  balls: BallData[],
  offset: number = 1.5
) {
  if (balls.length === 0) return;

  const box = new THREE.Box3();

  balls.forEach((ball) => {
    box.expandByPoint(ball.mesh.position);
  });

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / Math.tan(fov / 2)) * offset;

  camera.position.set(center.x, center.y, center.z + cameraZ);
  camera.lookAt(center);
  camera.updateProjectionMatrix();
}
