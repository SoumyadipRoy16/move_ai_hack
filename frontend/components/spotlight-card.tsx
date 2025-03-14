"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  spotlightSize?: number
  spotlightOpacity?: number
  borderRadius?: string
  background?: string
}

export function SpotlightCard({
  children,
  className,
  spotlightSize = 400,
  spotlightOpacity = 0.15,
  borderRadius = "1rem",
  background = "white",
  ...props
}: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setPosition({ x, y })
    setOpacity(spotlightOpacity)
  }

  const handleMouseLeave = () => {
    setOpacity(0)
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-[1rem] border p-6 shadow-md transition-all duration-300 hover:shadow-lg",
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ borderRadius }}
      {...props}
    >
      {isMounted && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, rgba(var(--primary-rgb), ${opacity}), transparent 40%)`,
            opacity,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

