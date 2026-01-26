"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface BonusItem {
  label: string
  value: number
  color: string
  description?: string
}

interface BonusBreakdownProps {
  baseScore?: number
  bonuses: BonusItem[]
  totalScore: number
  showFormula?: boolean
  className?: string
}

export function BonusBreakdown({
  baseScore = 300,
  bonuses,
  totalScore,
  showFormula = true,
  className,
}: BonusBreakdownProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedBonuses, setAnimatedBonuses] = useState<number[]>(bonuses.map(() => 0))
  const containerRef = useRef<HTMLDivElement>(null)

  const totalBonus = bonuses.reduce((sum, b) => sum + b.value, 0)
  const maxWidth = baseScore + totalBonus

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

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    bonuses.forEach((bonus, index) => {
      const delay = (index + 1) * 300
      setTimeout(() => {
        setAnimatedBonuses((prev) => {
          const next = [...prev]
          next[index] = bonus.value
          return next
        })
      }, delay)
    })
  }, [isVisible, bonuses])

  return (
    <div ref={containerRef} className={cn("space-y-6", className)}>
      {/* Visual Bar Chart */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
          Score Composition
        </h4>
        
        {/* Stacked bar */}
        <div className="relative h-10 bg-soft-cream rounded-xl overflow-hidden">
          <div className="absolute inset-0 flex">
            {/* Base score */}
            <div
              className="h-full bg-slate-200 transition-all duration-700 ease-out flex items-center justify-center"
              style={{
                width: isVisible ? `${(baseScore / maxWidth) * 100}%` : "0%",
              }}
            >
              <span className="text-xs font-mono text-text-secondary truncate px-2">
                {baseScore}
              </span>
            </div>
            
            {/* Bonus segments */}
            {bonuses.map((bonus, index) => (
              <div
                key={bonus.label}
                className="h-full transition-all duration-500 ease-out flex items-center justify-center"
                style={{
                  width: isVisible ? `${(bonus.value / maxWidth) * 100}%` : "0%",
                  backgroundColor: bonus.color,
                  transitionDelay: `${(index + 1) * 200}ms`,
                }}
              >
                {bonus.value > 30 && (
                  <span className="text-xs font-mono text-white truncate px-1">
                    +{bonus.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-slate-200" />
            <span className="text-xs text-text-secondary">Base ({baseScore})</span>
          </div>
          {bonuses.map((bonus) => (
            <div key={bonus.label} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: bonus.color }}
              />
              <span className="text-xs text-text-secondary">
                {bonus.label} (+{bonus.value})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Formula Display */}
      {showFormula && (
        <div className="premium-card p-4 font-mono text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-text-secondary">baseScore</span>
            <span className="text-abyss">{baseScore}</span>
          </div>
          {bonuses.map((bonus, index) => (
            <div
              key={bonus.label}
              className={cn(
                "flex justify-between transition-all duration-300",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
              )}
              style={{ transitionDelay: `${(index + 1) * 200}ms` }}
            >
              <span className="text-text-secondary">{bonus.label.toLowerCase().replace(/\s/g, "")}Bonus</span>
              <span style={{ color: bonus.color }}>+{animatedBonuses[index]}</span>
            </div>
          ))}
          <div className="border-t border-pearl-gray pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-text-secondary">totalBonus</span>
              <span className="text-aleo-teal">
                {animatedBonuses.reduce((sum, v) => sum + v, 0)}
              </span>
            </div>
          </div>
          <div className="border-t border-pearl-gray pt-2 flex justify-between font-bold">
            <span className="text-abyss">finalScore</span>
            <span className="text-neon-green">{baseScore + animatedBonuses.reduce((sum, v) => sum + v, 0)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
