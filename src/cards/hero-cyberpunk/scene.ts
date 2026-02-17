import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { textToSpherePositions } from './font';
import { lightColors, shinyColors } from './colors';
import {
  BALL_RADIUS,
  SPRING_STIFFNESS,
  GRAB_RADIUS,
  BallData,
  createBall,
  createWalls,
  fitCameraToObjects,
} from './shared';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export type SceneMode = 'off' | 'on' | 'broken' | 'broken-off';

export interface SceneOptions {
  canvas: HTMLCanvasElement;
  name: string;
  dob: Date;
  onModeChange?: (mode: SceneMode) => void;
}

export class HeroScene {
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private composer?: EffectComposer;
  private world?: RAPIER.World;
  private balls: BallData[] = [];
  private mode: SceneMode = 'off';
  private animationId?: number;
  private isRunning = false;

  // Interaction state
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private rotationY = 0;
  private grabbedBalls: BallData[] = [];

  constructor(private options: SceneOptions) {
    this.canvas = options.canvas;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(lightColors.ball);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 50);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(1); // Force pixel ratio to 1 for perf
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    // Setup interaction handlers
    this.setupInteractionHandlers();
  }

  async init() {
    // Initialize Rapier
    await RAPIER.init();
    const gravity = new RAPIER.Vector3(0, 0, 0); // No gravity initially
    this.world = new RAPIER.World(gravity);

    // Create walls
    createWalls(this.world);

    // Generate text
    const age = Math.floor(
      (Date.now() - this.options.dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );
    const month = this.options.dob.toLocaleDateString('en-US', { month: 'long' });
    const day = this.options.dob.getDate();
    const year = this.options.dob.getFullYear();

    const text = `${age} / HAPPY / BIRTHDAY / ${this.options.name.toUpperCase()} / ${month.toUpperCase()} ${day} ${year}`;

    // Parse text into lines with different scales
    const lines = text.split(' / ');
    const scales = [2.5, 1.4, 1.4, 1.4, 0.45]; // Age bigger, date smaller

    let allPositions: { x: number; y: number; z: number; scale: number }[] = [];
    let currentY = 0;

    lines.forEach((line, index) => {
      const scale = scales[index] || 1;
      const positions = textToSpherePositions(line, scale);

      positions.forEach((pos) => {
        allPositions.push({
          x: pos.x,
          y: currentY + pos.y,
          z: pos.z,
          scale,
        });
      });

      currentY -= 12 * scale; // Line spacing
    });

    // Create balls
    const material = new THREE.MeshLambertMaterial({ color: lightColors.ball });

    allPositions.forEach((pos) => {
      const position = new THREE.Vector3(pos.x, pos.y, pos.z);
      const ball = createBall(this.scene, this.world!, position, material);
      this.balls.push(ball);
    });

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    // Fit camera
    fitCameraToObjects(this.camera, this.balls);

    // Start animation
    this.isRunning = true;
    this.animate();
  }

  setMode(mode: SceneMode) {
    if (this.mode === mode) return;

    const prevMode = this.mode;
    this.mode = mode;

    // Handle transitions
    if (mode === 'on' && prevMode === 'off') {
      this.transitionToShiny();
    } else if (mode === 'off' && prevMode === 'on') {
      this.transitionToLight();
    } else if (mode === 'broken' && prevMode === 'on') {
      this.triggerBroken();
    }

    if (this.options.onModeChange) {
      this.options.onModeChange(mode);
    }
  }

  private transitionToShiny() {
    // Switch to MeshPhysicalMaterial with emissive glow
    this.balls.forEach((ball) => {
      const newMaterial = new THREE.MeshPhysicalMaterial({
        color: shinyColors.ball,
        emissive: shinyColors.glow,
        emissiveIntensity: 0.5,
        metalness: 0.6,
        roughness: 0.4,
        clearcoat: 0.5,
      });
      ball.mesh.material = newMaterial;
    });

    // Setup bloom pass
    const renderPass = new RenderPass(this.scene, this.camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.canvas.clientWidth, this.canvas.clientHeight),
      0.5, // strength
      0.4, // radius
      0.85 // threshold
    );

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);
    this.composer.addPass(bloomPass);
  }

  private transitionToLight() {
    // Switch back to Lambert material
    this.balls.forEach((ball) => {
      const newMaterial = new THREE.MeshLambertMaterial({ color: lightColors.ball });
      ball.mesh.material = newMaterial;
    });

    // Remove bloom
    this.composer = undefined;
  }

  private triggerBroken() {
    if (!this.world) return;

    // Enable gravity
    this.world.gravity = new RAPIER.Vector3(0, -80, 0);

    // Staggered radial wave release (0-0.8s)
    this.balls.forEach((ball, index) => {
      const delay = (index / this.balls.length) * 800;

      setTimeout(() => {
        // Apply radial impulse
        const direction = new THREE.Vector3(
          Math.random() - 0.5,
          0,
          Math.random() - 0.5
        ).normalize();
        const impulse = direction.multiplyScalar(Math.random() * 5 + 5);
        ball.body.applyImpulse(
          new RAPIER.Vector3(impulse.x, impulse.y, impulse.z),
          true
        );

        // Set death time (heavy-tailed distribution)
        const rand = Math.random();
        let deathDelay;
        if (rand < 0.8) {
          // 80% die in 5-60 seconds
          deathDelay = 5000 + Math.random() * 55000;
        } else if (rand < 0.95) {
          // 15% die in 60-180 seconds
          deathDelay = 60000 + Math.random() * 120000;
        } else {
          // 5% die in 3-100 minutes
          deathDelay = 180000 + Math.random() * 5820000;
        }

        ball.deathTime = Date.now() + deathDelay;
      }, delay);
    });
  }

  private setupInteractionHandlers() {
    // Mouse/touch drag to rotate scene
    this.canvas.addEventListener('mousedown', this.onPointerDown);
    this.canvas.addEventListener('mousemove', this.onPointerMove);
    this.canvas.addEventListener('mouseup', this.onPointerUp);
    this.canvas.addEventListener('touchstart', this.onPointerDown);
    this.canvas.addEventListener('touchmove', this.onPointerMove);
    this.canvas.addEventListener('touchend', this.onPointerUp);
  }

  private onPointerDown = (e: MouseEvent | TouchEvent) => {
    this.isDragging = true;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    this.previousMousePosition = { x: clientX, y: clientY };

    // Check for ball grab
    if (this.mode === 'on' || this.mode === 'broken') {
      this.checkBallGrab(clientX, clientY);
    }
  };

  private onPointerMove = (e: MouseEvent | TouchEvent) => {
    if (!this.isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - this.previousMousePosition.x;

    // Rotate scene around Y axis
    this.rotationY += deltaX * 0.005;
    this.scene.rotation.y = this.rotationY;

    this.previousMousePosition = { x: clientX, y: clientY };
  };

  private onPointerUp = () => {
    this.isDragging = false;

    // Release grabbed balls
    this.grabbedBalls.forEach((ball) => {
      ball.grabbed = false;
    });
    this.grabbedBalls = [];
  };

  private checkBallGrab(clientX: number, clientY: number) {
    // Convert screen coordinates to 3D world position
    const rect = this.canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);

    // Check for balls within grab radius
    this.balls.forEach((ball) => {
      const distance = raycaster.ray.distanceToPoint(ball.mesh.position);
      if (distance < GRAB_RADIUS) {
        ball.grabbed = true;
        this.grabbedBalls.push(ball);

        // Apply throw impulse
        const direction = raycaster.ray.direction.clone();
        const impulse = direction.multiplyScalar(20);
        ball.body.applyImpulse(
          new RAPIER.Vector3(impulse.x, impulse.y, impulse.z),
          true
        );
      }
    });
  }

  private animate = () => {
    if (!this.isRunning) return;

    this.animationId = requestAnimationFrame(this.animate);

    // Step physics
    if (this.world) {
      this.world.step();

      // Update ball positions and apply spring forces
      this.balls.forEach((ball) => {
        const pos = ball.body.translation();
        ball.mesh.position.set(pos.x, pos.y, pos.z);

        // Apply spring force to anchor (if not grabbed and not dead)
        if (!ball.grabbed && !ball.deathTime) {
          const anchorForce = new THREE.Vector3()
            .copy(ball.anchor)
            .sub(ball.mesh.position)
            .multiplyScalar(SPRING_STIFFNESS);

          // Apply as velocity steering instead of force for smoother motion
          const vel = ball.body.linvel();
          const desiredVel = anchorForce.multiplyScalar(0.1);
          ball.body.setLinvel(
            new RAPIER.Vector3(
              vel.x * 0.9 + desiredVel.x,
              vel.y * 0.9 + desiredVel.y,
              vel.z * 0.9 + desiredVel.z
            ),
            true
          );
        }

        // Handle dying balls (flicker effect)
        if (ball.deathTime && Date.now() > ball.deathTime) {
          if (!ball.flickerInterval) {
            ball.flickerInterval = window.setInterval(() => {
              const material = ball.mesh.material as THREE.MeshPhysicalMaterial;
              if (material.emissiveIntensity) {
                material.emissiveIntensity = Math.random() * 0.3;
              }
            }, 100);

            // Fade out and remove after flickering
            setTimeout(() => {
              if (ball.flickerInterval) {
                clearInterval(ball.flickerInterval);
              }
              this.scene.remove(ball.mesh);
              if (this.world) {
                this.world.removeRigidBody(ball.body);
              }
            }, 2000);
          }
        }
      });
    }

    // Render
    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  };

  handleResize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);

    if (this.composer) {
      this.composer.setSize(width, height);
    }
  }

  destroy() {
    this.isRunning = false;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.renderer.dispose();

    if (this.world) {
      this.world.free();
    }
  }
}
