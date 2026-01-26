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
  iconColor = "text-aleo-teal",
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
      case "text-aleo-teal": return "bg-aleo-teal/10"
      case "text-electric-violet": return "bg-electric-violet/10"
      case "text-warm-amber": return "bg-warm-amber/10"
      case "text-neon-green": return "bg-neon-green/10"
      default: return "bg-aleo-teal/10"
    }
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "premium-card p-6 group cursor-default",
        "opacity-0",
        isVisible && "animate-slide-up"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-text-muted font-medium uppercase tracking-wider mb-2">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-bold font-mono text-abyss tabular-nums">
              {displayValue.toLocaleString()}
            </span>
            {suffix && (
              <span className="text-xl text-text-secondary font-mono">{suffix}</span>
            )}
            {isPercentage && (
              <span className="text-xl text-text-secondary font-mono">%</span>
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
            "p-3 rounded-xl transition-all duration-200",
            getBgColor(iconColor),
            "group-hover:scale-110"
          )}
        >
          <Icon className={cn("w-6 h-6 md:w-8 md:h-8", iconColor)} />
        </div>
      </div>
      
      {/* Subtle progress indicator */}
      <div className="mt-4 h-1.5 bg-soft-cream rounded-full overflow-hidden">
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
