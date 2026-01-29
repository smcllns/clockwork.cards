import { onMount, onCleanup, createSignal, createEffect, JSX } from "solid-js"
import * as THREE from "three"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js"
import type { Font } from "three/examples/jsm/loaders/FontLoader.js"

interface HeroNumber3DProps {
  number: number
}

export function HeroNumber3D(props: HeroNumber3DProps): JSX.Element {
  const [ready, setReady] = createSignal(false)
  let rebuildText: ((text: string) => void) | undefined
  let container!: HTMLDivElement
  let canvas!: HTMLCanvasElement

  createEffect(() => {
    const num = props.number
    rebuildText?.(String(num))
  })

  onMount(() => {
    if (!container || !canvas) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    )
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.9

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.9,
      0.25,
      0.5,
    )
    composer.addPass(bloom)
    composer.addPass(new OutputPass())

    const keyLight = new THREE.PointLight(0xff69b4, 40, 30)
    keyLight.position.set(4, 3.5, 6)
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(0x00e5ff, 20, 25)
    fillLight.position.set(-5, -1.5, 4)
    scene.add(fillLight)

    const rimLight = new THREE.PointLight(0xaa44ff, 35, 22)
    rimLight.position.set(0, 2.5, -5)
    scene.add(rimLight)

    scene.add(new THREE.AmbientLight(0xffffff, 0.2))

    let mesh: THREE.Mesh | null = null
    let geometry: TextGeometry | null = null
    let font: Font | null = null

    const material = new THREE.MeshStandardMaterial({
      color: 0xff6bbd,
      emissive: 0xff2d9a,
      emissiveIntensity: 0.35,
      metalness: 0.15,
      roughness: 0.35,
    })

    function buildText(text: string) {
      if (!font) return
      if (mesh) {
        scene.remove(mesh)
        geometry?.dispose()
      }
      geometry = new TextGeometry(text, {
        font,
        size: 2.6,
        depth: 1.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.07,
        bevelSize: 0.045,
        bevelSegments: 8,
      })
      geometry.computeBoundingBox()
      geometry.center()
      mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
    }

    rebuildText = buildText

    const loader = new FontLoader()
    loader.load(
      "/fonts/helvetiker_bold.typeface.json",
      (loadedFont: Font) => {
        font = loadedFont
        buildText(String(props.number))
        setReady(true)
      },
      undefined,
      () => {},
    )

    let angularVelocity = 0.004
    const BASE_SPEED = 0.004
    let dragging = false
    let lastX = 0

    function onPointerDown(e: PointerEvent) {
      dragging = true
      lastX = e.clientX
    }
    function onPointerMove(e: PointerEvent) {
      if (!dragging) return
      const dx = e.clientX - lastX
      angularVelocity = dx * 0.01
      lastX = e.clientX
    }
    function onPointerUp() {
      dragging = false
    }

    container.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)

    function onResize() {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer.setSize(w, h)
    }
    window.addEventListener("resize", onResize)

    let frame = 0
    let rafId: number

    function animate() {
      rafId = requestAnimationFrame(animate)
      frame++

      if (mesh) {
        if (!dragging) {
          angularVelocity += (BASE_SPEED - angularVelocity) * 0.03
        }
        mesh.rotation.y += angularVelocity
      }

      material.emissiveIntensity = 0.32 + Math.sin(frame * 0.03) * 0.08
      keyLight.position.x = 4 + Math.sin(frame * 0.01) * 0.4
      fillLight.position.y = -1.5 + Math.cos(frame * 0.015) * 0.25

      composer.render()
    }
    animate()

    onCleanup(() => {
      cancelAnimationFrame(rafId)
      container.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("resize", onResize)
      geometry?.dispose()
      material.dispose()
      renderer.dispose()
      composer.dispose()
    })
  })

  return (
    <div
      id="hero-3d-container"
      ref={(el) => (container = el)}
      style={{
        width: "100%",
        height: "clamp(180px, 30vw, 320px)",
        "touch-action": "none",
        cursor: "grab",
        position: "relative",
      }}
    >
      <canvas
        ref={(el) => (canvas = el)}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      {!ready() && (
        <div
          class="hero-age glow font-mono"
          style={{
            "font-size": "clamp(6rem, 25vw, 12rem)",
            "font-weight": "700",
            "line-height": "1",
            color: "var(--primary)",
            "text-align": "center",
            position: "absolute",
            inset: "0",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
          }}
        >
          {props.number}
        </div>
      )}
    </div>
  )
}
