#magicui- animated beam fallback.tsx
"use client"

import type React from "react"
import { type RefObject, useEffect, useId, useState } from "react"
import { cn } from "@/lib/utils"

export interface AnimatedBeamFallbackProps {
  className?: string
  containerRef: RefObject<HTMLElement | null>
  fromRef: RefObject<HTMLElement | null>
  toRef: RefObject<HTMLElement | null>
  curvature?: number
  reverse?: boolean
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
  delay?: number
  duration?: number
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
}

export const AnimatedBeamFallback: React.FC<AnimatedBeamFallbackProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 2,
  delay = 0,
  pathColor = "#e5e7eb",
  pathWidth = 2,
  pathOpacity = 0.5,
  gradientStartColor = "#3b82f6",
  gradientStopColor = "#f59e0b",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}) => {
  const id = useId()
  const [pathD, setPathD] = useState("")
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const rectA = fromRef.current.getBoundingClientRect()
        const rectB = toRef.current.getBoundingClientRect()

        const svgWidth = containerRect.width
        const svgHeight = containerRect.height
        setSvgDimensions({ width: svgWidth, height: svgHeight })

        const startX = rectA.left - containerRect.left + rectA.width / 2 + startXOffset
        const startY = rectA.top - containerRect.top + rectA.height / 2 + startYOffset
        const endX = rectB.left - containerRect.left + rectB.width / 2 + endXOffset
        const endY = rectB.top - containerRect.top + rectB.height / 2 + endYOffset

        const controlX = (startX + endX) / 2
        const controlY = startY - curvature
        const d = `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`
        setPathD(d)
        setIsVisible(true)
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      updatePath()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    updatePath()

    return () => {
      resizeObserver.disconnect()
    }
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset])

  if (!isVisible || !pathD) {
    return null
  }

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none absolute left-0 top-0 z-10", className)}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={gradientStartColor} />
          <stop offset="100%" stopColor={gradientStopColor} />
        </linearGradient>
      </defs>

      {/* Background path */}
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
        fill="none"
      />

      {/* Animated beam */}
      <path
        d={pathD}
        stroke={`url(#gradient-${id})`}
        strokeWidth={pathWidth + 1}
        strokeLinecap="round"
        fill="none"
        strokeDasharray="20 20"
        className={cn("animate-beam-dash", reverse && "animate-beam-dash-reverse")}
        style={{
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          filter: `drop-shadow(0 0 6px ${gradientStartColor})`,
        }}
      />

      {/* Glowing effect */}
      <path
        d={pathD}
        stroke={gradientStartColor}
        strokeWidth={pathWidth + 3}
        strokeLinecap="round"
        fill="none"
        strokeDasharray="10 30"
        opacity="0.6"
        className="animate-pulse"
        style={{
          animationDuration: `${duration * 0.8}s`,
          animationDelay: `${delay + 0.2}s`,
          filter: `blur(2px)`,
        }}
      />
    </svg>
  )
}
