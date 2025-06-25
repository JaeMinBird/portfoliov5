'use client'

import React, { useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default function Logo() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const pivotRef = useRef<THREE.Group | null>(null)
  const frameId = useRef<number | null>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })
  const isMobile = useRef(false)
  const mobileTime = useRef(0)
  const isVisible = useRef(true)

  // Memoized mouse handler with distance-based optimization
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isMobile.current || !mountRef.current) return
    
    const rect = mountRef.current.getBoundingClientRect()
    
    // Calculate distance from logo center
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = event.clientX
    const mouseY = event.clientY
    
    // Define interaction radius (e.g., 1.5x the logo size)
    const interactionRadius = Math.max(rect.width, rect.height) * 1.5
    const distance = Math.sqrt(
      Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
    )
    
    // Only update if mouse is within interaction radius
    if (distance > interactionRadius) {
      // Gradually return to neutral position when outside radius
      targetRotation.current.y *= 0.95
      targetRotation.current.x *= 0.95
      return
    }
    
    // Calculate normalized coordinates relative to logo bounds
    const x = ((mouseX - rect.left) / rect.width) * 2 - 1
    const y = -((mouseY - rect.top) / rect.height) * 2 + 1
    mousePosition.current = { x, y }
    
    // Apply distance-based dampening for smoother interaction
    const dampening = 1 - (distance / interactionRadius)
    targetRotation.current.y = x * dampening * 1
    targetRotation.current.x = -y * dampening * 0.4
  }, [])

  // Memoized resize handler
  const handleResize = useCallback(() => {
    if (cameraRef.current && rendererRef.current && mountRef.current) {
      const newIsMobile = window.innerWidth <= 768
      
      // Only update if mobile state changed to prevent unnecessary work
      if (isMobile.current !== newIsMobile) {
        isMobile.current = newIsMobile
      }
      
      const width = mountRef.current.clientWidth
      const height = mountRef.current.clientHeight
      
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(width, height)
    }
  }, [])

  // Intersection Observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting
      },
      { threshold: 0.1 }
    )

    if (mountRef.current) {
      observer.observe(mountRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!mountRef.current) return

    isMobile.current = window.innerWidth <= 768

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 3.5) // Moved closer from 5 to 3.5
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Mobile-optimized renderer settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile.current, // Disable antialiasing on mobile
      alpha: true,
      powerPreference: isMobile.current ? "default" : "high-performance",
      stencil: false,
      depth: false,
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: true
    })
    
    // Aggressive pixel ratio optimization for mobile
    const pixelRatio = isMobile.current ? 1 : Math.min(window.devicePixelRatio, 2)
    renderer.setPixelRatio(pixelRatio)
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    
    // Disable shadows and advanced features for mobile
    renderer.shadowMap.enabled = false
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Minimal lighting for mobile performance
    const ambientLight = new THREE.AmbientLight(0xffffff, isMobile.current ? 0.8 : 0.6)
    scene.add(ambientLight)

    // Skip directional light on mobile
    if (!isMobile.current) {
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(1, 1, 2)
      scene.add(directionalLight)
    }

    const loader = new GLTFLoader()
    loader.load(
      '/logo.glb',
      (gltf) => {
        const model = gltf.scene

        // Ultra-optimized material for mobile
        const material = new THREE.MeshBasicMaterial({
          color: 0xF8C46F,
          wireframe: true,
          transparent: false, // Disable transparency on mobile for performance
          opacity: 1,
        })

        // If mobile, use even simpler material
        if (isMobile.current) {
          material.transparent = false
          material.opacity = 1
        }

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = material
            child.frustumCulled = false
            // Disable casting/receiving shadows
            child.castShadow = false
            child.receiveShadow = false
          }
        })

        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        model.position.sub(center)

        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 3.5 / maxDim // Increased from 4 to 5.5 for larger model
        model.scale.setScalar(scale)

        const pivot = new THREE.Group()
        pivot.add(model)
        scene.add(pivot)
        pivotRef.current = pivot
      },
      undefined,
      (error) => console.error('Model load error:', error)
    )

    let lastTime = 0
    // Reduce FPS target for mobile
    const targetFPS = isMobile.current ? 30 : 60
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime: number) => {
      frameId.current = requestAnimationFrame(animate)

      // Skip rendering if not visible for performance
      if (!isVisible.current) return

      // Throttle to target FPS
      if (currentTime - lastTime < frameInterval) return
      lastTime = currentTime

      if (pivotRef.current) {
        if (isMobile.current) {
          // Simplified mobile animation - no delta time calculations
          mobileTime.current += 0.016 // Fixed timestep for consistency
          
          // Much simpler rotation calculation
          const time = mobileTime.current * 0.8
          pivotRef.current.rotation.y = Math.sin(time) * 0.3
          pivotRef.current.rotation.x = Math.cos(time * 0.7) * 0.2
        } else {
          // Desktop interpolation
          const lerpFactor = 0.08
          
          pivotRef.current.rotation.y += (targetRotation.current.y - pivotRef.current.rotation.y) * lerpFactor
          pivotRef.current.rotation.x += (targetRotation.current.x - pivotRef.current.rotation.x) * lerpFactor
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }

    // Use document listener but with distance checking for optimization
    if (!isMobile.current) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true })
    }
    window.addEventListener('resize', handleResize, { passive: true })
    animate(0)

    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current)
      if (!isMobile.current) {
        document.removeEventListener('mousemove', handleMouseMove)
      }
      window.removeEventListener('resize', handleResize)
      
      // Fix: Store the current reference before cleanup
      const currentMountRef = mountRef.current
      if (currentMountRef && rendererRef.current?.domElement) {
        currentMountRef.removeChild(rendererRef.current.domElement)
      }
      rendererRef.current?.dispose()
      
      // Clean up materials and geometries
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry?.dispose()
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose())
            } else {
              object.material?.dispose()
            }
          }
        })
      }
    }
  }, [handleMouseMove, handleResize])

  return (
    <div 
      ref={mountRef} 
      className="w-full h-80 md:h-96 rounded-2xl overflow-hidden" // Reduced from h-96 md:h-[500px] to h-80 md:h-96
      style={{ pointerEvents: 'auto' }}
    />
  )
}