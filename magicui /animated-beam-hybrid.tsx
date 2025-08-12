"use client"

import type React from "react"
import { type RefObject, useState, useEffect } from "react"
import { AnimatedBeam } from "./animated-beam"
import { AnimatedBeamFallback } from "./animated-beam-fallback"

export interface AnimatedBeamHybridProps {
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

export const AnimatedBeamHybrid: React.FC<AnimatedBeamHybridProps> = (props) => {
  const [useFramerMotion, setUseFramerMotion] = useState(true)

  useEffect(() => {
    // Test if framer-motion is available and working
    const testFramerMotion = async () => {
      try {
        const { motion } = await import("framer-motion")
        if (!motion || !motion.div) {
          setUseFramerMotion(false)
        }
      } catch (error) {
        console.log("Framer Motion not available, using fallback animation")
        setUseFramerMotion(false)
      }
    }

    testFramerMotion()
  }, [])

  // Try framer-motion first, fallback to CSS animation
  if (useFramerMotion) {
    try {
      return <AnimatedBeam {...props} />
    } catch (error) {
      console.log("Framer Motion failed, using fallback")
      return <AnimatedBeamFallback {...props} />
    }
  }

  return <AnimatedBeamFallback {...props} />
}
