'use client'

import React, { useRef, useEffect, useCallback, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Image from 'next/image'

export default function ThreeJSLogo() {
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
  
  const [modelLoaded, setModelLoaded] = useState(false)

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isMobile.current || !mountRef.current) return
    
    const rect = mountRef.current.getBoundingClientRect()
    
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    
    mousePosition.current = { x, y }
    targetRotation.current.y = x * 1
    targetRotation.current.x = -y * 0.4
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (isMobile.current) return
    
    targetRotation.current.y = 0
    targetRotation.current.x = 0
  }, [])

  const handleResize = useCallback(() => {
    if (cameraRef.current && rendererRef.current && mountRef.current) {
      const newIsMobile = window.innerWidth <= 768
      
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
        failIfMajorPerformanceCaveat: false,
      })
    } catch (error) {
      console.warn('WebGL renderer creation failed:', error)
      return
    }
    
    const pixelRatio = isMobile.current ? 1 : Math.min(window.devicePixelRatio, 2)
    renderer.setPixelRatio(pixelRatio)
    
    try {
      renderer.setSize(currentMountRef.clientWidth, currentMountRef.clientHeight)
      renderer.setClearColor(0x000000, 0) // Keep transparent background
    } catch (error) {
      console.warn('WebGL renderer setup failed:', error)
      renderer.dispose()
      return
    }
    
    renderer.shadowMap.enabled = false
    rendererRef.current = renderer
    currentMountRef.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, isMobile.current ? 0.8 : 0.6)
    scene.add(ambientLight)

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

        const material = new THREE.MeshBasicMaterial({
          color: 0xF8C46F,
          wireframe: true,
          transparent: false,
          opacity: 1,
        })

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
        
        // Set model loaded state - this will trigger the instant swap
        setModelLoaded(true)
      },
      undefined,
      (error) => {
        console.error('Model load error:', error)
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
        }
      }
    }

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
  }, [handleMouseMove, handleMouseLeave, handleResize])

  return (
    <>
      {/* Show placeholder until 3D model is loaded, then instant swap */}
      {!modelLoaded && (
        <div className="absolute inset-0 bg-white flex items-center justify-center">
          <Image 
            src="/logo.svg" 
            alt="Logo" 
            width={128}
            height={128}
            priority
            className="w-32 h-32 md:w-40 md:h-40"
            sizes="(max-width: 768px) 128px, 160px"
          />
        </div>
      )}
      
      {/* 3D Canvas - only visible when model is loaded */}
      <div 
        ref={mountRef} 
        className="w-full h-full"
        style={{ pointerEvents: 'auto' }}
      />
    </>
  )
}
