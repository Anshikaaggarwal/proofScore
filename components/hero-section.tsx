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
    },
    {
      icon: Sparkles,
      label: "First Credit SDK on Aleo",
      description: "Pioneer the future of privacy-preserving financial reputation.",
    },
  ]

  const stats = [
    { value: "10s", label: "Proof Generation" },
    { value: "100%", label: "On-Chain" },
    { value: "0", label: "Data Exposed" },
  ]

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-background opacity-50" />
      
      {/* Gradient orbs */}
      <div 
        className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full animate-float opacity-60"
        style={{
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, transparent 70%)",
          animationDelay: "0s",
        }}
      />
      <div 
        className="absolute bottom-20 left-1/4 w-[400px] h-[400px] rounded-full animate-float opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
          animationDelay: "2s",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Top Badge */}
        <div
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 transition-all duration-700 badge-primary",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green" />
          </span>
          <span className="text-sm font-medium text-deep-slate">Powered by Zero-Knowledge Proofs</span>
          <ChevronRight className="w-4 h-4 text-aleo-teal" />
        </div>

        {/* Main Headline */}
        <h1
          className={cn(
            "text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight mb-6 transition-all duration-700 delay-100",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <span className="text-abyss">Your </span>
          <span className="gradient-text-animated">Credit Score</span>
          <br />
          <span className="text-abyss">On-Chain</span>
        </h1>

        {/* Subtitle */}
        <p
          className={cn(
            "text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          Prove creditworthiness without revealing your data.
          <br className="hidden sm:block" />
          <span className="text-aleo-teal font-medium">Privacy-preserving.</span>{" "}
          <span className="text-electric-violet font-medium">Instant.</span>{" "}
          <span className="text-abyss font-medium">Universal.</span>
        </p>

        {/* Key Highlights - Two Main Points */}
        <div
          className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 transition-all duration-700 delay-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {highlights.map((item, index) => (
            <div
              key={item.label}
              className="group relative glass-card px-6 py-4 flex items-center gap-4 max-w-md"
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                index === 0 ? "bg-aleo-teal/10 group-hover:bg-aleo-teal/20" : "bg-electric-violet/10 group-hover:bg-electric-violet/20"
              )}>
                <item.icon className={cn(
                  "w-6 h-6",
                  index === 0 ? "text-aleo-teal" : "text-electric-violet"
                )} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-abyss">{item.label}</h3>
                <p className="text-sm text-text-secondary">{item.description}</p>
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
            className="group relative h-14 px-8 text-lg font-semibold bg-gradient-to-r from-aleo-teal to-electric-violet hover:from-aleo-teal/90 hover:to-electric-violet/90 text-white rounded-xl transition-all duration-300 btn-glow"
          >
            Launch App
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-8 text-lg font-semibold border-2 border-pearl-gray hover:border-aleo-teal/40 text-abyss hover:bg-soft-cream bg-transparent rounded-xl transition-all"
          >
            View Documentation
          </Button>
        </div>

        {/* Stats Row */}
        <div
          className={cn(
            "flex items-center justify-center gap-8 sm:gap-16 transition-all duration-700 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className={cn(
                "text-3xl sm:text-4xl font-bold mb-1",
                index === 0 ? "text-aleo-teal" : index === 1 ? "gradient-text" : "text-electric-violet"
              )}>
                {stat.value}
              </div>
              <div className="text-sm text-text-muted font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Value Props Grid */}
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20 transition-all duration-700 delay-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {[
            {
              icon: Shield,
              title: "Privacy First",
              description: "Generate proofs locally. Your wallet data never leaves your device.",
              color: "aleo-teal",
            },
            {
              icon: Zap,
              title: "Instant Verification",
              description: "Get your credit score in 10 seconds. No documents. No delays.",
              color: "electric-violet",
            },
            {
              icon: Globe,
              title: "Universal & Portable",
              description: "Use your score across any Web3 protocol. Truly interoperable.",
              color: "neon-green",
            },
          ].map((prop, index) => (
            <div
              key={prop.title}
              className="feature-card"
              style={{ transitionDelay: `${600 + index * 100}ms` }}
            >
              <div className="feature-card-inner p-6">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                    prop.color === "aleo-teal" && "bg-aleo-teal/10",
                    prop.color === "electric-violet" && "bg-electric-violet/10",
                    prop.color === "neon-green" && "bg-neon-green/10"
                  )}
                >
                  <prop.icon className={cn(
                    "w-6 h-6",
                    prop.color === "aleo-teal" && "text-aleo-teal",
                    prop.color === "electric-violet" && "text-electric-violet",
                    prop.color === "neon-green" && "text-neon-green"
                  )} />
                </div>
                <h3 className="text-lg font-semibold text-abyss mb-2">{prop.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{prop.description}</p>
              </div>
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
        <span className="text-xs text-text-muted font-medium">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-slate-200 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-2.5 rounded-full bg-aleo-teal animate-bounce" />
        </div>
      </div>
    </section>
  )
}
