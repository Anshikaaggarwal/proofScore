"use client"

import { useState } from "react"
import { ArrowLeft, Activity, Clock, TrendingUp, Percent, Sparkles, Copy, Check, Shield, Camera, ChevronRight, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MetricCard } from "@/components/metric-card"
import { ScoringModal } from "@/components/scoring-modal"
import { Level2Verification } from "@/components/level2-verification"
import { cn } from "@/lib/utils"

interface DashboardViewProps {
  address: string
  onBack: () => void
}

export function DashboardView({ address, onBack }: DashboardViewProps) {
  const [showScoringModal, setShowScoringModal] = useState(false)
  const [showLevel2Modal, setShowLevel2Modal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hasExistingScore] = useState(false)
  const [level2Completed, setLevel2Completed] = useState(false)
  const [level2Bonus, setLevel2Bonus] = useState(0)

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`
  }

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLevel2Complete = (bonusPoints: number) => {
    setLevel2Completed(true)
    setLevel2Bonus(bonusPoints)
  }

  const metrics = [
    {
      label: "Transactions",
      value: 25,
      icon: Activity,
      iconColor: "text-neon-cyan",
      description: "Total on-chain transactions",
      delay: 0,
    },
    {
      label: "Wallet Age",
      value: 8,
      suffix: "mo",
      icon: Clock,
      iconColor: "text-electric-purple",
      description: "Months since first transaction",
      delay: 100,
    },
    {
      label: "DeFi Score",
      value: 35,
      icon: TrendingUp,
      iconColor: "text-neon-yellow",
      description: "DeFi protocol interactions",
      delay: 200,
    },
    {
      label: "Repayment Rate",
      value: 85,
      icon: Percent,
      iconColor: "text-neon-green",
      isPercentage: true,
      description: "Loans repaid on time",
      delay: 300,
    },
  ]

  const verificationLevels = [
    {
      level: 1,
      title: "Wallet Verification",
      description: "On-chain activity analysis",
      status: "completed",
      bonus: 0,
    },
    {
      level: 2,
      title: "Identity Verification",
      description: "Photo, Aadhar & PAN",
      status: level2Completed ? "completed" : "available",
      bonus: 150,
    },
    {
      level: 3,
      title: "Financial Verification",
      description: "Bank & income verification",
      status: "locked",
      bonus: 200,
    },
  ]

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="gradient-blur gradient-blur-cyan fixed top-20 -right-60 opacity-10" />
      <div className="gradient-blur gradient-blur-purple fixed bottom-20 -left-40 opacity-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 -ml-2 text-light-gray hover:text-pure-white hover:bg-charcoal"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* User Header Card */}
        <div className="card-dark p-6 md:p-8 mb-8 animate-slide-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-green flex items-center justify-center">
                  <span className="text-2xl font-bold text-void-black">
                    {address.slice(4, 6).toUpperCase()}
                  </span>
                </div>
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-carbon flex items-center justify-center",
                  level2Completed ? "bg-neon-green" : "bg-neon-yellow"
                )}>
                  {level2Completed ? (
                    <Check className="w-3 h-3 text-void-black" />
                  ) : (
                    <span className="text-xs font-bold text-void-black">1</span>
                  )}
                </div>
              </div>

              {/* Address & Status */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <code className="font-mono text-lg text-pure-white">{truncateAddress(address)}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-neon-cyan/10 text-light-gray hover:text-neon-cyan"
                    onClick={copyAddress}
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-neon-green" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green" />
                    </span>
                    <span className="text-sm text-light-gray">Connected to Aleo</span>
                  </div>
                  {level2Completed && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-electric-purple bg-electric-purple/10 px-2 py-0.5 rounded-full border border-electric-purple/30">
                      <Shield className="w-3 h-3" />
                      Level 2 Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Score Display or Generate Button */}
            <div className="flex flex-col items-start md:items-end gap-2">
              {hasExistingScore ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-mono gradient-text-static">{520 + level2Bonus}</span>
                    <span className="text-lg text-light-gray">/850</span>
                  </div>
                  <span className="text-sm text-neon-green font-medium">Score verified on-chain</span>
                </>
              ) : (
                <>
                  <span className="text-lg text-light-gray">No score yet</span>
                  <span className="text-sm text-text-muted">
                    Generate your first credit score below
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Verification Levels Section */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: "50ms" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-pure-white">Verification Levels</h2>
              <p className="text-sm text-light-gray">
                Complete more levels to increase your credit score
              </p>
            </div>
            {level2Bonus > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/30">
                <Sparkles className="w-4 h-4 text-neon-green" />
                <span className="text-sm font-semibold text-neon-green">+{level2Bonus} bonus</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {verificationLevels.map((level, index) => (
              <div
                key={level.level}
                className={cn(
                  "relative p-5 rounded-xl border transition-all duration-300",
                  level.status === "completed"
                    ? "bg-neon-green/5 border-neon-green/30"
                    : level.status === "available"
                    ? "bg-electric-purple/5 border-electric-purple/30 hover:border-electric-purple/50 cursor-pointer"
                    : "bg-charcoal/50 border-white/5 opacity-60"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => level.status === "available" && setShowLevel2Modal(true)}
              >
                {/* Level Badge */}
                <div className={cn(
                  "absolute -top-3 left-4 px-3 py-0.5 rounded-full text-xs font-bold",
                  level.status === "completed"
                    ? "bg-neon-green text-void-black"
                    : level.status === "available"
                    ? "bg-gradient-to-r from-electric-purple to-neon-cyan text-void-black"
                    : "bg-charcoal text-light-gray"
                )}>
                  Level {level.level}
                </div>

                <div className="flex items-start justify-between mt-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {level.status === "completed" ? (
                        <Check className="w-5 h-5 text-neon-green" />
                      ) : level.status === "available" ? (
                        <Camera className="w-5 h-5 text-electric-purple" />
                      ) : (
                        <Lock className="w-5 h-5 text-text-muted" />
                      )}
                      <h3 className="font-semibold text-pure-white">{level.title}</h3>
                    </div>
                    <p className="text-sm text-light-gray">{level.description}</p>
                  </div>

                  {level.bonus > 0 && level.status !== "completed" && (
                    <span className="text-sm font-semibold text-electric-purple bg-electric-purple/10 px-2 py-1 rounded-full border border-electric-purple/30">
                      +{level.bonus}
                    </span>
                  )}
                </div>

                {level.status === "available" && (
                  <Button
                    className="w-full mt-4 h-10 bg-gradient-to-r from-electric-purple to-neon-cyan hover:opacity-90 text-void-black font-semibold rounded-lg uppercase tracking-wide text-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowLevel2Modal(true)
                    }}
                  >
                    Start Verification
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}

                {level.status === "completed" && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-neon-green">
                    <Shield className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "150ms" }}>
          <h2 className="text-2xl md:text-3xl font-bold text-pure-white mb-2">Your Wallet Metrics</h2>
          <p className="text-light-gray">
            These metrics are used to calculate your credit score
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-10">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        {/* Generate Score CTA */}
        <div
          className="text-center animate-slide-up"
          style={{ animationDelay: "500ms" }}
        >
          <Button
            size="lg"
            onClick={() => setShowScoringModal(true)}
            className="group relative w-full sm:w-auto h-16 px-12 text-lg font-semibold bg-gradient-to-r from-neon-cyan to-neon-green hover:opacity-90 text-void-black rounded-lg transition-all duration-300 uppercase tracking-wide"
          >
            <Sparkles className="w-6 h-6 mr-3 transition-transform group-hover:rotate-12" />
            Generate Credit Score
          </Button>
          <p className="mt-4 text-sm text-text-muted">
            This process is entirely local. Your data never leaves your device.
          </p>
        </div>
      </div>

      {/* Scoring Modal */}
      <ScoringModal
        open={showScoringModal}
        onClose={() => setShowScoringModal(false)}
        metrics={{
          transactions: 25,
          walletAge: 8,
          defiScore: 35,
          repaymentRate: 85,
        }}
        bonusPoints={level2Bonus}
      />

      {/* Level 2 Verification Modal */}
      <Level2Verification
        open={showLevel2Modal}
        onClose={() => setShowLevel2Modal(false)}
        onComplete={handleLevel2Complete}
      />
    </div>
  )
}
