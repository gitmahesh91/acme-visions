'use client'

import { useState, useRef, useEffect } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  loading?: 'lazy' | 'eager'
  priority?: boolean
}

/**
 * Optimized image with:
 * - Lazy loading via IntersectionObserver
 * - Smooth fade-in when loaded
 * - Subtle zoom on load
 * - Skeleton placeholder while loading
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  style,
  loading = 'lazy',
  priority = false,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(priority)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (priority) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Skeleton placeholder while loading */}
      {!loaded && (
        <div
          className="absolute inset-0 skeleton"
          style={{ background: 'linear-gradient(90deg, rgba(42,42,42,0.3) 25%, rgba(42,42,42,0.6) 50%, rgba(42,42,42,0.3) 75%)', backgroundSize: '200% 100%' }}
        />
      )}

      {/* Actual image - only loads when in view */}
      {inView && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      )}
    </div>
  )
}
