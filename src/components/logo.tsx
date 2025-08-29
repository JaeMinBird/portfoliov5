'use client'

import React, { useRef, useEffect, useCallback, useState, lazy, Suspense } from 'react'
import Image from 'next/image'

// Lazy load Three.js components to reduce initial bundle size
const ThreeJSLogo = lazy(() => import('./three-logo'))

export default function Logo() {
  const [isClient, setIsClient] = useState(false)
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null)
  const [shouldLoadThreeJS, setShouldLoadThreeJS] = useState(false)
  const intersectionRef = useRef<HTMLDivElement>(null)

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
    } catch {
      return false
    }
  }, [])

  // Client-side mounting check
  useEffect(() => {
    setIsClient(true)
    setWebglSupported(checkWebGLSupport())
  }, [checkWebGLSupport])

  // Intersection Observer for lazy loading Three.js
  useEffect(() => {
    if (!isClient || webglSupported !== true) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !shouldLoadThreeJS) {
          setShouldLoadThreeJS(true)
          observer.disconnect()
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading when 50px away from viewport
      }
    )

    const currentRef = intersectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
      observer.disconnect()
    }
  }, [isClient, webglSupported, shouldLoadThreeJS])

  // Fallback UI for when WebGL is not supported or available
  const FallbackLogo = () => (
    <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden bg-white flex items-center justify-center">
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
  )

  // Loading placeholder - removed pulse animation
  const LoadingPlaceholder = () => (
    <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden bg-white flex items-center justify-center">
      <Image 
        src="/logo.svg" 
        alt="Logo Loading" 
        width={128}
        height={128}
        priority
        className="w-32 h-32 md:w-40 md:h-40"
        sizes="(max-width: 768px) 128px, 160px"
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
      ref={intersectionRef}
      className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden bg-white"
    >
      {webglSupported === true && shouldLoadThreeJS ? (
        <Suspense fallback={<LoadingPlaceholder />}>
          <ThreeJSLogo />
        </Suspense>
      ) : (
        <FallbackLogo />
      )}
    </div>
  )
}