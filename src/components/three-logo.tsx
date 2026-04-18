'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import {
  AmbientLight,
  Box3,
  DirectionalLight,
  Group,
  Mesh,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { COLORS, BREAKPOINTS, EASE_DEFAULT } from '@/lib/constants'

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Camera field-of-view and positioning. */
const CAMERA_FOV = 75;
const CAMERA_Z = 3.5;

/** Scales the loaded GLTF model to fit uniformly in the viewport. */
const MODEL_TARGET_SIZE = 3.5;

/** Desktop: mouse-follow rotation sensitivity (radians per unit). */
const MOUSE_SENSITIVITY_Y = 1;
const MOUSE_SENSITIVITY_X = 0.4;

/** Desktop: interpolation speed for mouse-follow rotation (0–1). */
const MOUSE_LERP_FACTOR = 0.08;

/** Mobile: amplitude and speed of the idle oscillation. */
const MOBILE_OSCILLATION_SPEED = 0.8;
const MOBILE_OSCILLATION_Y = 0.3;
const MOBILE_OSCILLATION_X = 0.2;

/** Mobile tap: how long the logo stays aimed at the tap position (ms). */
const TAP_HOLD_DURATION = 200;
/** Mobile tap: how quickly the logo blends back to idle after the hold (0–1 per frame). */
const TAP_BLEND_BACK_SPEED = 0.02;
/** Mobile tap: how quickly the logo drifts toward the tap target (0–1 per frame). */
const TAP_SNAP_SPEED = 0.03;
/** Mobile tap: rotation sensitivity — barely perceptible nudge. */
const TAP_SENSITIVITY_Y = 0.03;
const TAP_SENSITIVITY_X = 0.015;

/** Hex-encoded accent color as a number — precomputed to avoid re-parsing
 *  `COLORS.accent` on every model load. */
const ACCENT_HEX = parseInt(COLORS.accent.replace('#', ''), 16);

/** World-space diameter of each rendered vertex. With `sizeAttenuation`
 *  enabled, points further from the camera render smaller. */
const POINT_SIZE = 0.01;

// ---------------------------------------------------------------------------
// ThreeJSLogo (default export)
//
// Renders the 3D logo loaded from `/logo.glb` as a fixed point cloud.
//
// Desktop: the model follows the cursor via smooth linear interpolation.
// Mobile:  the model gently oscillates using sine/cosine functions.
//
// Performance optimisations:
//   - Frame-rate capped to 30fps on mobile, 60fps on desktop.
//   - Rendering pauses entirely when the component scrolls out of view
//     (tracked via IntersectionObserver).
//   - Pixel ratio capped at 2 to avoid unnecessary GPU load on Retina.
//   - GLTF geometries are reused as-is — Points objects share the source
//     buffers rather than cloning vertex data.
// ---------------------------------------------------------------------------

export default function ThreeJSLogo() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<Scene | null>(null)
  const rendererRef = useRef<WebGLRenderer | null>(null)
  const cameraRef = useRef<PerspectiveCamera | null>(null)
  const pivotRef = useRef<Group | null>(null)
  const frameId = useRef<number | null>(null)
  const targetRotation = useRef({ x: 0, y: 0 })
  const isMobileRef = useRef(false)
  const mobileTime = useRef(0)
  const isVisibleRef = useRef(true)

  // Mobile tap state
  const tapTarget = useRef({ x: 0, y: 0 })
  const tapBlend = useRef(0)          // 1 = fully aimed at tap, 0 = fully idle
  const tapHoldUntil = useRef(0)      // timestamp when the hold phase ends
  const isTapActive = useRef(false)   // whether a tap interaction is in progress

  // Holds the loaded (and mutated-in-place) GLTF scene so we can dispose
  // its geometries and our generated Points materials on unmount.
  const gltfSceneRef = useRef<Group | null>(null)

  const [modelLoaded, setModelLoaded] = useState(false)

  // ── Mouse handlers (desktop only) ──────────────────────────────────────
  // Tracks the cursor across the entire viewport — not just the canvas —
  // so the logo reacts wherever the user moves their mouse on the page.

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isMobileRef.current) return

    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = -(event.clientY / window.innerHeight) * 2 + 1

    targetRotation.current.y = x * MOUSE_SENSITIVITY_Y
    targetRotation.current.x = -y * MOUSE_SENSITIVITY_X
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (isMobileRef.current) return
    targetRotation.current = { x: 0, y: 0 }
  }, [])

  // ── Touch handler (mobile only) ────────────────────────────────────────

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!isMobileRef.current || !mountRef.current) return

    const touch = event.touches[0]
    if (!touch) return

    const rect = mountRef.current.getBoundingClientRect()
    const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1

    tapTarget.current.y = x * TAP_SENSITIVITY_Y
    tapTarget.current.x = -y * TAP_SENSITIVITY_X
    isTapActive.current = true
    tapHoldUntil.current = performance.now() + TAP_HOLD_DURATION
  }, [])

  // ── Resize handler ─────────────────────────────────────────────────────
  // rAF-throttled so resize drags don't thrash `setSize`/`setPixelRatio`.

  const resizeTicking = useRef(false)
  const handleResize = useCallback(() => {
    if (resizeTicking.current) return
    resizeTicking.current = true
    requestAnimationFrame(() => {
      resizeTicking.current = false
      if (!cameraRef.current || !rendererRef.current || !mountRef.current) return

      isMobileRef.current = window.innerWidth <= BREAKPOINTS.md

      const { clientWidth: w, clientHeight: h } = mountRef.current
      cameraRef.current.aspect = w / h
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(w, h)
    })
  }, [])

  // ── Visibility observer (pauses the entire RAF loop when off-screen) ───
  // The loop restart is wired from the main effect below via `resumeLoop`.

  const resumeLoopRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisibleRef.current
        isVisibleRef.current = entry.isIntersecting
        if (!wasVisible && entry.isIntersecting) {
          resumeLoopRef.current?.()
        }
      },
      { threshold: 0.1 },
    )

    const el = mountRef.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
      observer.disconnect()
    }
  }, [])

  // ── Scene setup & animation loop ───────────────────────────────────────

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const mobile = window.innerWidth <= BREAKPOINTS.md
    isMobileRef.current = mobile

    // --- Scene & camera ---
    const scene = new Scene()
    sceneRef.current = scene

    const camera = new PerspectiveCamera(
      CAMERA_FOV,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(0, 0, CAMERA_Z)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // --- Renderer ---
    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({
        antialias: !mobile,
        alpha: true,
        powerPreference: mobile ? 'default' : 'high-performance',
        stencil: false,
        depth: false,
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: false,
      })
    } catch (error) {
      console.warn('WebGL renderer creation failed:', error)
      return
    }

    renderer.setPixelRatio(mobile ? 1 : Math.min(window.devicePixelRatio, 2))

    try {
      renderer.setSize(mount.clientWidth, mount.clientHeight)
      renderer.setClearColor(0x000000, 0) // transparent background
    } catch (error) {
      console.warn('WebGL renderer setup failed:', error)
      renderer.dispose()
      return
    }

    renderer.shadowMap.enabled = false
    rendererRef.current = renderer
    mount.appendChild(renderer.domElement)

    // --- Lighting ---
    // These only affect lit materials (currently none of the styles use
    // one), but we keep them so swapping in a lit material later works
    // without reconfiguring the scene.
    scene.add(new AmbientLight(0xffffff, mobile ? 0.8 : 0.6))

    if (!mobile) {
      const dirLight = new DirectionalLight(0xffffff, 0.8)
      dirLight.position.set(1, 1, 2)
      scene.add(dirLight)
    }

    // Pivot is populated below once the GLTF finishes loading.
    const pivot = new Group()
    scene.add(pivot)
    pivotRef.current = pivot

    // --- Model loading ---
    const loader = new GLTFLoader()
    loader.load(
      '/logo.glb',
      (gltf) => {
        const model = gltf.scene

        // Centre and normalise scale so the model fills the viewport.
        const box = new Box3().setFromObject(model)
        const center = box.getCenter(new Vector3())
        const size = box.getSize(new Vector3())
        model.position.sub(center)

        const maxDim = Math.max(size.x, size.y, size.z)
        model.scale.setScalar(MODEL_TARGET_SIZE / maxDim)

        // Replace every Mesh in the loaded scene with a Points object that
        // shares the same geometry. The original GLTF materials are
        // discarded; geometries are reused (no clone) since we never
        // mutate vertex data.
        const meshes: Mesh[] = []
        model.traverse((child) => {
          if (child instanceof Mesh) meshes.push(child)
        })

        for (const mesh of meshes) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose())
          } else {
            mesh.material?.dispose()
          }

          const material = new PointsMaterial({
            color: ACCENT_HEX,
            size: POINT_SIZE,
            sizeAttenuation: true,
            transparent: true,
            depthWrite: false,
          })
          const points = new Points(mesh.geometry, material)
          points.position.copy(mesh.position)
          points.rotation.copy(mesh.rotation)
          points.scale.copy(mesh.scale)
          points.frustumCulled = false

          const parent = mesh.parent
          if (parent) {
            parent.add(points)
            parent.remove(mesh)
          }
        }

        pivot.add(model)
        gltfSceneRef.current = model
        setModelLoaded(true)
      },
      undefined,
      (error) => console.error('Model load error:', error),
    )

    // --- Animation loop (frame-rate capped) ---
    let lastTime = 0
    const frameInterval = 1000 / (mobile ? 30 : 60)

    const animate = (currentTime: number) => {
      // Fully stop when off-screen — no rAF reschedule. The
      // IntersectionObserver will call `resumeLoop` when we return.
      if (!isVisibleRef.current) {
        frameId.current = null
        return
      }

      frameId.current = requestAnimationFrame(animate)

      if (currentTime - lastTime < frameInterval) return
      lastTime = currentTime

      if (pivotRef.current) {
        if (isMobileRef.current) {
          // Idle oscillation on mobile.
          mobileTime.current += 0.016
          const t = mobileTime.current * MOBILE_OSCILLATION_SPEED
          const idleY = Math.sin(t) * MOBILE_OSCILLATION_Y
          const idleX = Math.cos(t * 0.7) * MOBILE_OSCILLATION_X

          // ── Tap interaction blending ──
          if (isTapActive.current) {
            if (currentTime < tapHoldUntil.current) {
              // Hold phase: snap toward the tap target.
              tapBlend.current = Math.min(tapBlend.current + TAP_SNAP_SPEED, 1)
            } else {
              // Blend-back phase: ease back to idle.
              tapBlend.current = Math.max(tapBlend.current - TAP_BLEND_BACK_SPEED, 0)
              if (tapBlend.current <= 0) {
                isTapActive.current = false
              }
            }
          }

          const b = tapBlend.current
          pivotRef.current.rotation.y = idleY * (1 - b) + tapTarget.current.y * b
          pivotRef.current.rotation.x = idleX * (1 - b) + tapTarget.current.x * b
        } else {
          // Mouse-follow with linear interpolation on desktop.
          pivotRef.current.rotation.y +=
            (targetRotation.current.y - pivotRef.current.rotation.y) * MOUSE_LERP_FACTOR
          pivotRef.current.rotation.x +=
            (targetRotation.current.x - pivotRef.current.rotation.x) * MOUSE_LERP_FACTOR
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        try {
          rendererRef.current.render(sceneRef.current, cameraRef.current)
        } catch (error) {
          console.warn('WebGL render error:', error)
        }
      }
    }

    // --- Event listeners ---
    if (mobile) {
      mount.addEventListener('touchstart', handleTouchStart, { passive: true })
    } else {
      // Listen on window so the logo tracks the cursor anywhere on the page.
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
      // mouseleave on the document element fires when the cursor exits the viewport.
      document.documentElement.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    }
    window.addEventListener('resize', handleResize, { passive: true })

    // --- Loop resume hook (consumed by IntersectionObserver) ---
    const resumeLoop = () => {
      if (frameId.current == null) {
        frameId.current = requestAnimationFrame(animate)
      }
    }
    resumeLoopRef.current = resumeLoop

    animate(0)

    // --- Cleanup ---
    // Use the `mobile` closure captured at mount time — not `isMobileRef.current`,
    // which may have flipped if the viewport crossed the breakpoint since setup.
    return () => {
      resumeLoopRef.current = null
      if (frameId.current) cancelAnimationFrame(frameId.current)

      if (mobile) {
        mount.removeEventListener('touchstart', handleTouchStart)
      } else {
        window.removeEventListener('mousemove', handleMouseMove)
        document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
      }
      window.removeEventListener('resize', handleResize)

      const rendererCanvas = rendererRef.current?.domElement
      if (mount && rendererCanvas && rendererCanvas.parentNode === mount) {
        mount.removeChild(rendererCanvas)
      }
      rendererRef.current?.dispose()

      // Walk the loaded scene (with Meshes already swapped for Points) and
      // release the materials we allocated plus the shared GLTF geometries.
      gltfSceneRef.current?.traverse((object) => {
        if (object instanceof Points) {
          object.geometry?.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose())
          } else {
            object.material?.dispose()
          }
        } else if (object instanceof Mesh) {
          object.geometry?.dispose()
        }
      })
      gltfSceneRef.current = null
    }
  }, [handleMouseMove, handleMouseLeave, handleTouchStart, handleResize])

  return (
    <>
      {/* Static SVG placeholder — cross-fades out as the 3D model loads in.
          A subtle scale-up on exit makes the handoff feel intentional rather
          than a hard swap. */}
      <AnimatePresence>
        {!modelLoaded && (
          <motion.div
            key="placeholder"
            className="absolute inset-0 bg-white flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.7, ease: EASE_DEFAULT }}
          >
            <Image
              src="/logo.svg"
              alt="Logo"
              width={128}
              height={128}
              priority
              className="w-32 h-32 md:w-40 md:h-40"
              sizes="(max-width: 768px) 128px, 160px"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Three.js canvas — fades + gently scales up when the model is ready. */}
      <motion.div
        ref={mountRef}
        className="w-full h-full"
        style={{ pointerEvents: 'auto' }}
        initial={false}
        animate={
          modelLoaded
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.96 }
        }
        transition={{ duration: 0.9, ease: EASE_DEFAULT, delay: modelLoaded ? 0.15 : 0 }}
      />
    </>
  )
}
