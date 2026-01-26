"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Shield, Zap, Globe, Sparkles, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeroSectionProps {
  onLaunchApp: () => void
}

export function HeroSection({ onLaunchApp }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const highlights = [
    {
      icon: Shield,
      label: "Pure On-Chain Credit Scoring",
      description: "100% verifiable, 100% on-chain. No off-chain data, no trust assumptions.",
      gradient: "from-neon-cyan to-neon-blue",
    },
    {
      icon: Sparkles,
      label: "First Credit SDK on Aleo",
      description: "Pioneer the future of privacy-preserving financial reputation.",
      gradient: "from-neon-green to-neon-cyan",
    },
  ]

  const stats = [
    { value: "10s", label: "Proof Generation", color: "text-neon-cyan" },
    { value: "100%", label: "On-Chain", color: "text-neon-green" },
    { value: "0", label: "Data Exposed", color: "text-electric-purple" },
  ]

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-20">
      {/* Background gradient blurs */}
      <div className="gradient-blur gradient-blur-cyan absolute -top-40 -left-40 opacity-20" />
      <div className="gradient-blur gradient-blur-green absolute top-1/3 -right-60 opacity-15" />
      <div className="gradient-blur gradient-blur-purple absolute -bottom-40 left-1/3 opacity-15" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern" />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Top Badge */}
        <div
          className={cn(
            "inline-flex items-center gap-2 mb-8 transition-all duration-700 badge-neon",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green" />
          </span>
          <span>Powered by Zero-Knowledge Proofs</span>
          <ChevronRight className="w-4 h-4" />
        </div>

        {/* Main Headline - zkPass Style */}
        <h1
          className={cn(
            "text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.95] tracking-tight mb-6 transition-all duration-700 delay-100",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <span className="text-pure-white">Your </span>
          <span className="gradient-text-hero">Credit Score</span>
          <br />
          <span className="text-pure-white">On-Chain</span>
        </h1>

        {/* Subtitle */}
        <p
          className={cn(
            "text-lg sm:text-xl text-light-gray max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          Prove creditworthiness without revealing your data.
          <br className="hidden sm:block" />
          <span className="text-neon-cyan">Privacy-preserving.</span>{" "}
          <span className="text-neon-green">Instant.</span>{" "}
          <span className="text-electric-purple">Universal.</span>
        </p>

        {/* Key Highlights - Two Main Points */}
        <div
          className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 transition-all duration-700 delay-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {highlights.map((item, index) => (
            <div
              key={item.label}
              className="group relative card-gradient-border p-[1px] max-w-md"
            >
              <div className="bg-carbon rounded-[19px] px-6 py-5 flex items-center gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br",
                  item.gradient
                )}>
                  <item.icon className="w-7 h-7 text-void-black" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-pure-white text-lg">{item.label}</h3>
                  <p className="text-sm text-light-gray">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div
          className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-400",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <Button
            size="lg"
            onClick={onLaunchApp}
            className="group relative h-14 px-10 text-base font-semibold bg-gradient-to-r from-neon-cyan to-neon-green hover:opacity-90 text-void-black rounded-lg transition-all duration-300 uppercase tracking-wide"
          >
            Launch App
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-10 text-base font-semibold border border-white/20 hover:border-neon-cyan/50 text-pure-white hover:text-neon-cyan bg-transparent rounded-lg transition-all uppercase tracking-wide"
          >
            Documentation
          </Button>
        </div>

        {/* Stats Row */}
        <div
          className={cn(
            "flex items-center justify-center gap-8 sm:gap-20 mb-20 transition-all duration-700 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={cn("text-4xl sm:text-5xl font-bold mb-1 number-counter", stat.color)}>
                {stat.value}
              </div>
              <div className="text-xs text-text-muted font-medium uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Value Props Grid */}
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto transition-all duration-700 delay-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {[
            {
              icon: Shield,
              title: "Privacy First",
              description: "Generate proofs locally. Your wallet data never leaves your device.",
              color: "neon-cyan",
              number: "01",
            },
            {
              icon: Zap,
              title: "Instant Verification",
              description: "Get your credit score in 10 seconds. No documents. No delays.",
              color: "neon-green",
              number: "02",
            },
            {
              icon: Globe,
              title: "Universal & Portable",
              description: "Use your score across any Web3 protocol. Truly interoperable.",
              color: "electric-purple",
              number: "03",
            },
          ].map((prop) => (
            <div
              key={prop.title}
              className="card-dark p-6 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center",
                    prop.color === "neon-cyan" && "bg-neon-cyan/10",
                    prop.color === "neon-green" && "bg-neon-green/10",
                    prop.color === "electric-purple" && "bg-electric-purple/10"
                  )}
                >
                  <prop.icon className={cn(
                    "w-6 h-6",
                    prop.color === "neon-cyan" && "text-neon-cyan",
                    prop.color === "neon-green" && "text-neon-green",
                    prop.color === "electric-purple" && "text-electric-purple"
                  )} />
                </div>
                <span className={cn(
                  "text-sm font-mono",
                  prop.color === "neon-cyan" && "text-neon-cyan/50",
                  prop.color === "neon-green" && "text-neon-green/50",
                  prop.color === "electric-purple" && "text-electric-purple/50"
                )}>
                  {prop.number}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-pure-white mb-2">{prop.title}</h3>
              <p className="text-sm text-light-gray leading-relaxed">{prop.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 delay-[800ms]",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <span className="text-xs text-text-muted font-medium uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5">
          <div className="w-1 h-2.5 rounded-full bg-neon-cyan animate-bounce" />
        </div>
      </div>
    </section>
  )
}
