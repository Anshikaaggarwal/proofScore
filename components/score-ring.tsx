"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface ScoreRingProps {
  score: number
  minScore?: number
  maxScore?: number
  size?: number
  strokeWidth?: number
  className?: string
  showRiskLevel?: boolean
  animated?: boolean
}

export function ScoreRing({
  score,
  minScore = 300,
  maxScore = 850,
  size = 240,
  strokeWidth = 12,
  className,
  showRiskLevel = true,
  animated = true,
}: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score)
  const [isVisible, setIsVisible] = useState(false)
  const ringRef = useRef<HTMLDivElement>(null)

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const normalizedScore = Math.max(minScore, Math.min(maxScore, score))
  const percentage = ((normalizedScore - minScore) / (maxScore - minScore)) * 100
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  // Get color based on score
  const getScoreColor = (s: number) => {
    const pct = ((s - minScore) / (maxScore - minScore)) * 100
    if (pct < 33) return "#FF0080" // hot-pink
    if (pct < 66) return "#FAFF00" // neon-yellow
    return "#00FF88" // neon-green
  }

  // Get risk level
  const getRiskLevel = (s: number) => {
    const pct = ((s - minScore) / (maxScore - minScore)) * 100
    if (pct < 33) return { label: "High Risk", color: "text-hot-pink bg-hot-pink/10 border-hot-pink/30" }
    if (pct < 66) return { label: "Medium Risk", color: "text-neon-yellow bg-neon-yellow/10 border-neon-yellow/30" }
    return { label: "Low Risk", color: "text-neon-green bg-neon-green/10 border-neon-green/30" }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ringRef.current) {
      observer.observe(ringRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!animated || !isVisible) return

    const duration = 2000
    const steps = 100
    const stepDuration = duration / steps
    const increment = score / steps
    let current = 0

    const interval = setInterval(() => {
      current += increment
      if (current >= score) {
        setDisplayScore(score)
        clearInterval(interval)
      } else {
        setDisplayScore(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [animated, isVisible, score])

  const riskLevel = getRiskLevel(displayScore || score)
  const scoreColor = getScoreColor(displayScore || score)

  return (
    <div ref={ringRef} className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background ring */}
        <svg
          className="absolute inset-0 -rotate-90"
          width={size}
          height={size}
        >
          <defs>
            <linearGradient id="scoreGradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF0080" />
              <stop offset="50%" stopColor="#FAFF00" />
              <stop offset="100%" stopColor="#00FF88" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2A2A2A"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={isVisible ? strokeDashoffset : circumference}
            className="transition-all duration-[2000ms] ease-out"
            style={{
              filter: `drop-shadow(0 0 12px ${scoreColor}60)`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-5xl md:text-6xl font-bold text-pure-white tabular-nums number-counter">
            {displayScore}
          </span>
          <span className="text-sm text-text-muted font-medium">
            out of {maxScore}
          </span>
        </div>

        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-xl transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle, ${scoreColor} 0%, transparent 70%)`,
            opacity: isVisible ? 0.3 : 0,
          }}
        />
      </div>

      {/* Risk level badge */}
      {showRiskLevel && (
        <div
          className={cn(
            "px-4 py-2 rounded-full text-sm font-semibold border",
            riskLevel.color,
            "opacity-0 transition-opacity duration-500",
            isVisible && "opacity-100"
          )}
          style={{ transitionDelay: "1500ms" }}
        >
          {riskLevel.label}
        </div>
      )}
    </div>
  )
}
