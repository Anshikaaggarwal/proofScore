"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  label: string
  value: number
  suffix?: string
  icon: LucideIcon
  iconColor?: string
  delay?: number
  isPercentage?: boolean
  description?: string
}

export function MetricCard({
  label,
  value,
  suffix = "",
  icon: Icon,
  iconColor = "text-neon-cyan",
  delay = 0,
  isPercentage = false,
  description,
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

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

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(() => {
      const duration = 1500
      const steps = 60
      const stepDuration = duration / steps
      const increment = value / steps
      let current = 0

      const interval = setInterval(() => {
        current += increment
        if (current >= value) {
          setDisplayValue(value)
          clearInterval(interval)
        } else {
          setDisplayValue(Math.floor(current))
        }
      }, stepDuration)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [isVisible, value, delay])

  const getBgColor = (color: string) => {
    switch (color) {
      case "text-neon-cyan": return "bg-neon-cyan/10"
      case "text-electric-purple": return "bg-electric-purple/10"
      case "text-neon-yellow": return "bg-neon-yellow/10"
      case "text-neon-green": return "bg-neon-green/10"
      case "text-neon-blue": return "bg-neon-blue/10"
      case "text-hot-pink": return "bg-hot-pink/10"
      default: return "bg-neon-cyan/10"
    }
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "card-dark p-6 group cursor-default",
        "opacity-0",
        isVisible && "animate-slide-up"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-text-muted font-medium uppercase tracking-widest mb-2">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-bold font-mono text-pure-white tabular-nums number-counter">
              {displayValue.toLocaleString()}
            </span>
            {suffix && (
              <span className="text-xl text-light-gray font-mono">{suffix}</span>
            )}
            {isPercentage && (
              <span className="text-xl text-light-gray font-mono">%</span>
            )}
          </div>
          {description && (
            <p className="text-xs text-text-muted mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {description}
            </p>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-lg transition-all duration-200 border border-white/5",
            getBgColor(iconColor),
            "group-hover:scale-110"
          )}
        >
          <Icon className={cn("w-6 h-6 md:w-8 md:h-8", iconColor)} />
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-4 h-1 bg-charcoal rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            iconColor.replace("text-", "bg-")
          )}
          style={{
            width: isVisible ? `${Math.min((displayValue / value) * 100, 100)}%` : "0%",
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  )
}
