"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const stats = [
  { value: 2.5, suffix: "M+", label: "TVL Protected", prefix: "$" },
  { value: 150, suffix: "+", label: "Protocols Integrated" },
  { value: 45000, suffix: "+", label: "Proofs Generated" },
  { value: 99.9, suffix: "%", label: "Uptime" },
]

const partners = [
  { name: "Aleo Network", logo: "A" },
  { name: "zkPass", logo: "Z" },
  { name: "Reclaim Protocol", logo: "R" },
  { name: "Polygon ID", logo: "P" },
  { name: "Worldcoin", logo: "W" },
  { name: "Sismo", logo: "S" },
]

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0))
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    stats.forEach((stat, index) => {
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps
      const increment = stat.value / steps
      let current = 0

      const interval = setInterval(() => {
        current += increment
        if (current >= stat.value) {
          setAnimatedValues((prev) => {
            const next = [...prev]
            next[index] = stat.value
            return next
          })
          clearInterval(interval)
        } else {
          setAnimatedValues((prev) => {
            const next = [...prev]
            next[index] = Number(current.toFixed(1))
            return next
          })
        }
      }, stepDuration)
    })
  }, [isVisible])

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-pure-white via-soft-cream/50 to-pure-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-aleo-teal/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-electric-violet/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "text-center p-6 premium-card transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono mb-2">
                <span className="text-abyss">{stat.prefix}</span>
                <span className="gradient-text">{animatedValues[index].toLocaleString()}</span>
                <span className="text-aleo-teal">{stat.suffix}</span>
              </div>
              <div className="text-sm text-text-secondary font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Partners */}
        <div className="text-center">
          <p className="text-sm text-text-muted uppercase tracking-wider mb-8 font-medium">
            Trusted by leading protocols
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {partners.map((partner, index) => (
              <div
                key={partner.name}
                className={cn(
                  "flex items-center gap-3 px-5 py-3 rounded-xl bg-pure-white border border-pearl-gray hover:border-aleo-teal/30 hover:shadow-md transition-all duration-300 cursor-default",
                  isVisible ? "opacity-100" : "opacity-0"
                )}
                style={{ transitionDelay: `${600 + index * 100}ms` }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aleo-teal/10 to-electric-violet/10 flex items-center justify-center">
                  <span className="text-sm font-bold gradient-text">{partner.logo}</span>
                </div>
                <span className="text-sm font-semibold text-abyss">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
