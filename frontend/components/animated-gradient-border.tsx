"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface AnimatedGradientBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  borderWidth?: number
  gradientColors?: string[]
  animationDuration?: number
  borderRadius?: string
}

export function AnimatedGradientBorder({
  children,
  className,
  borderWidth = 2,
  gradientColors = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))"],
  animationDuration = 3,
  borderRadius = "1rem",
  ...props
}: AnimatedGradientBorderProps) {
  return (
    <div className={cn("relative p-[2px] overflow-hidden group", className)} style={{ borderRadius }} {...props}>
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, ${gradientColors.join(", ")})`,
          backgroundSize: "200% 200%",
          animation: `gradient ${animationDuration}s ease infinite`,
        }}
      />
      <div
        className="relative bg-background h-full w-full"
        style={{ borderRadius: `calc(${borderRadius} - ${borderWidth}px)` }}
      >
        {children}
      </div>
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `}</style>
    </div>
  )
}

