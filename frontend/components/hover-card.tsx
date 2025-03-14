"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hoverScale?: number
  hoverRotate?: number
  transitionDuration?: number
}

export function HoverCard({
  children,
  className,
  hoverScale = 1.02,
  hoverRotate = 0,
  transitionDuration = 0.3,
  ...props
}: HoverCardProps) {
  return (
    <div
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm transition-all", className)}
      style={{
        transitionDuration: `${transitionDuration}s`,
        transformOrigin: "center",
      }}
      {...props}
    >
      <div
        className="h-full w-full"
        style={{
          transition: `transform ${transitionDuration}s ease-out`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = `scale(${hoverScale}) rotate(${hoverRotate}deg)`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1) rotate(0deg)"
        }}
      >
        {children}
      </div>
    </div>
  )
}

