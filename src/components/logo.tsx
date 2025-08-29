'use client'

import React, { useRef, useEffect, useCallback, useState } from 'react'
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
  
  // Add state for WebGL support and loading
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Check WebGL support safely
  const checkWebGLSupport = useCallback(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') as WebGLRenderingContext | null || 
                 canvas.getContext('experimental-webgl') as WebGLRenderingContext | null
      const supported = !!gl
      
      // Clean up
      if (gl) {
        const loseContext = gl.getExtension('WEBGL_lose_context')
        if (loseContext) {
          loseContext.loseContext()
        }
      }
      canvas.remove()
      
      return supported
    } catch (e) {
      return false
    }
  }, [])

  // Client-side mounting check
  useEffect(() => {
    setIsClient(true)
    setWebglSupported(checkWebGLSupport())
  }, [checkWebGLSupport])

  // Simplified mouse handler for canvas-only tracking
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isMobile.current || !mountRef.current) return
    
    const rect = mountRef.current.getBoundingClientRect()
    
    // Simple normalized coordinates calculation
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    
    mousePosition.current = { x, y }
    targetRotation.current.y = x * 1
    targetRotation.current.x = -y * 0.4
  }, [])

  // Handle mouse leave to smoothly return to neutral position
  const handleMouseLeave = useCallback(() => {
    if (isMobile.current) return
    
    // Gradually return to neutral position
    targetRotation.current.y = 0
    targetRotation.current.x = 0
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

    const currentElement = mountRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    // Only run on client-side with WebGL support
    if (!isClient || webglSupported === false) return
    
    const currentMountRef = mountRef.current
    if (!currentMountRef) return

    isMobile.current = window.innerWidth <= 768

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      currentMountRef.clientWidth / currentMountRef.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 3.5)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Enhanced WebGL renderer creation with better error handling
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ 
        antialias: !isMobile.current,
        alpha: true,
        powerPreference: isMobile.current ? "default" : "high-performance",
        stencil: false,
        depth: false,
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: false, // Changed to false for better compatibility
      })
    } catch (error) {
      console.warn('WebGL renderer creation failed, falling back to fallback UI:', error)
      setWebglSupported(false)
      return
    }
    
    // Aggressive pixel ratio optimization for mobile
    const pixelRatio = isMobile.current ? 1 : Math.min(window.devicePixelRatio, 2)
    renderer.setPixelRatio(pixelRatio)
    
    try {
      renderer.setSize(currentMountRef.clientWidth, currentMountRef.clientHeight)
      renderer.setClearColor(0x000000, 0)
    } catch (error) {
      console.warn('WebGL renderer setup failed:', error)
      setWebglSupported(false)
      renderer.dispose()
      return
    }
    
    // Disable shadows and advanced features for mobile
    renderer.shadowMap.enabled = false
    rendererRef.current = renderer
    currentMountRef.appendChild(renderer.domElement)

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
          transparent: false,
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
            child.castShadow = false
            child.receiveShadow = false
          }
        })

        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        model.position.sub(center)

        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 3.5 / maxDim
        model.scale.setScalar(scale)

        const pivot = new THREE.Group()
        pivot.add(model)
        scene.add(pivot)
        pivotRef.current = pivot
      },
      undefined,
      (error) => {
        console.error('Model load error:', error)
        // Don't set webglSupported to false here, as the model loading is separate
      }
    )

    let lastTime = 0
    const targetFPS = isMobile.current ? 30 : 60
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime: number) => {
      frameId.current = requestAnimationFrame(animate)

      if (!isVisible.current) return

      if (currentTime - lastTime < frameInterval) return
      lastTime = currentTime

      if (pivotRef.current) {
        if (isMobile.current) {
          mobileTime.current += 0.016
          
          const time = mobileTime.current * 0.8
          pivotRef.current.rotation.y = Math.sin(time) * 0.3
          pivotRef.current.rotation.x = Math.cos(time * 0.7) * 0.2
        } else {
          const lerpFactor = 0.08
          
          pivotRef.current.rotation.y += (targetRotation.current.y - pivotRef.current.rotation.y) * lerpFactor
          pivotRef.current.rotation.x += (targetRotation.current.x - pivotRef.current.rotation.x) * lerpFactor
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        try {
          rendererRef.current.render(sceneRef.current, cameraRef.current)
        } catch (error) {
          console.warn('WebGL render error:', error)
          setWebglSupported(false)
        }
      }
    }

    // Attach mouse events to canvas only
    if (!isMobile.current && currentMountRef) {
      currentMountRef.addEventListener('mousemove', handleMouseMove, { passive: true })
      currentMountRef.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    }
    window.addEventListener('resize', handleResize, { passive: true })
    animate(0)

    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current)
      
      if (!isMobile.current && currentMountRef) {
        currentMountRef.removeEventListener('mousemove', handleMouseMove)
        currentMountRef.removeEventListener('mouseleave', handleMouseLeave)
      }
      window.removeEventListener('resize', handleResize)
      
      if (currentMountRef && rendererRef.current?.domElement) {
        currentMountRef.removeChild(rendererRef.current.domElement)
      }
      rendererRef.current?.dispose()
      
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
  }, [isClient, webglSupported, handleMouseMove, handleMouseLeave, handleResize])

  // Fallback UI for when WebGL is not supported or available
  const FallbackLogo = () => (
    <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <img 
        src="/logo.svg" 
        alt="Logo" 
        className="w-32 h-32 md:w-40 md:h-40 opacity-80"
        style={{ filter: 'sepia(1) saturate(2) hue-rotate(25deg) brightness(1.1)' }}
      />
    </div>
  )

  // Show loading state during initial mount
  if (!isClient) {
    return <FallbackLogo />
  }

  // Show fallback if WebGL is not supported
  if (webglSupported === false) {
    return <FallbackLogo />
  }

  return (
    <div 
      ref={mountRef} 
      className="w-full h-80 md:h-96 rounded-2xl overflow-hidden"
      style={{ pointerEvents: 'auto' }}
    />
  )
}