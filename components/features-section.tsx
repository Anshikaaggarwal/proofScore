"use client"

import { useEffect, useRef, useState } from "react"
import { Wallet, BarChart3, FileCheck, Shield, Send, CheckCircle2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    description: "Link your Aleo wallet securely. We never store your private keys.",
    color: "text-aleo-teal",
    bgColor: "bg-aleo-teal/10",
    borderColor: "border-aleo-teal/20",
  },
  {
    icon: BarChart3,
    title: "Fetch Metrics",
    description: "Analyze on-chain activity: transactions, DeFi history, wallet age.",
    color: "text-electric-violet",
    bgColor: "bg-electric-violet/10",
    borderColor: "border-electric-violet/20",
  },
  {
    icon: FileCheck,
    title: "Calculate Score",
    description: "Generate your credit score locally using our transparent algorithm.",
    color: "text-warm-amber",
    bgColor: "bg-warm-amber/10",
    borderColor: "border-warm-amber/20",
  },
  {
    icon: Shield,
    title: "Generate ZK Proof",
    description: "Create a cryptographic proof that proves your score without revealing data.",
    color: "text-aleo-cyan",
    bgColor: "bg-aleo-cyan/10",
    borderColor: "border-aleo-cyan/20",
  },
  {
    icon: Send,
    title: "Issue on Chain",
    description: "Submit your proof to the Aleo blockchain for permanent verification.",
    color: "text-neon-green",
    bgColor: "bg-neon-green/10",
    borderColor: "border-neon-green/20",
  },
]

export function FeaturesSection() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"))
            setVisibleSteps((prev) => (prev.includes(index) ? prev : [...prev, index]))
          }
        })
      },
      { threshold: 0.2 }
    )

    const stepElements = sectionRef.current?.querySelectorAll("[data-index]")
    stepElements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 px-4 sm:px-6 lg:px-8 relative bg-soft-cream/50">
      {/* Subtle pattern */}
      <div className="absolute inset-0 dot-pattern opacity-30" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-primary mb-6">
            <span className="text-sm font-medium">Simple Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-abyss mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Five simple steps to generate your privacy-preserving credit score
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-px bg-gradient-to-r from-aleo-teal/0 via-aleo-teal/30 to-aleo-teal/0 -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                data-index={index}
                className={cn(
                  "relative transition-all duration-700",
                  visibleSteps.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="premium-card p-6 h-full flex flex-col items-center text-center relative z-10">
                  {/* Step Number */}
                  <div className={cn(
                    "absolute -top-3 -right-3 w-8 h-8 rounded-full bg-pure-white border-2 flex items-center justify-center shadow-sm",
                    step.borderColor
                  )}>
                    <span className={cn("text-sm font-bold", step.color)}>{index + 1}</span>
                  </div>

                  {/* Icon */}
                  <div
                    className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors",
                      step.bgColor
                    )}
                  >
                    <step.icon className={cn("w-7 h-7", step.color)} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-abyss mb-2">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
                </div>

                {/* Connector Arrow (Mobile/Tablet) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <ArrowRight className="w-5 h-5 text-slate-200" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-neon-green/10 border border-neon-green/20">
            <CheckCircle2 className="w-5 h-5 text-neon-green" />
            <span className="text-neon-green font-medium">
              Average scoring time: 10 seconds
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
