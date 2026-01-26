"use client"

import { useState, useEffect, useCallback } from "react"
import { X, ArrowRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StepIndicator } from "@/components/step-indicator"
import { ScoreRing } from "@/components/score-ring"
import { BonusBreakdown } from "@/components/bonus-breakdown"
import { ProofGenerationModal } from "@/components/proof-generation-modal"
import { cn } from "@/lib/utils"

type ModalStep = "fetching" | "calculating" | "complete"

interface ScoringModalProps {
  open: boolean
  onClose: () => void
  metrics: {
    transactions: number
    walletAge: number
    defiScore: number
    repaymentRate: number
  }
  bonusPoints?: number
}

const calculateBonuses = (metrics: ScoringModalProps["metrics"]) => {
  const txBonus = Math.max(0, (metrics.transactions - 10) * 5)
  const ageBonus = Math.max(0, (metrics.walletAge - 3) * 10)
  const defiBonus = Math.min(100, metrics.defiScore * 1.5)
  const repayBonus = Math.max(0, (metrics.repaymentRate - 70) * 1)

  return {
    txBonus: Math.min(txBonus, 150),
    ageBonus: Math.min(ageBonus, 100),
    defiBonus: Math.round(defiBonus),
    repayBonus: Math.min(Math.round(repayBonus), 50),
  }
}

export function ScoringModal({ open, onClose, metrics, bonusPoints = 0 }: ScoringModalProps) {
  const [step, setStep] = useState<ModalStep>("fetching")
  const [showProofModal, setShowProofModal] = useState(false)
  
  const BASE_SCORE = 300
  const bonuses = calculateBonuses(metrics)
  const metricsBonus = bonuses.txBonus + bonuses.ageBonus + bonuses.defiBonus + bonuses.repayBonus
  const totalBonus = metricsBonus + bonusPoints
  const finalScore = BASE_SCORE + totalBonus

  const bonusItems = [
    { label: "TX Bonus", value: bonuses.txBonus, color: "#0EA5E9", description: `${metrics.transactions} transactions` },
    { label: "Age Bonus", value: bonuses.ageBonus, color: "#8B5CF6", description: `${metrics.walletAge} months old` },
    { label: "DeFi Bonus", value: bonuses.defiBonus, color: "#3B82F6", description: `DeFi score: ${metrics.defiScore}` },
    { label: "Repay Bonus", value: bonuses.repayBonus, color: "#10B981", description: `${metrics.repaymentRate}% rate` },
    ...(bonusPoints > 0 ? [{ label: "KYC Bonus", value: bonusPoints, color: "#F59E0B", description: "Level 2 verified" }] : []),
  ]

  const steps = [
    { label: "Fetching", description: "Loading metrics..." },
    { label: "Calculating", description: "Computing score..." },
    { label: "Complete", description: "Score ready!" },
  ]

  const getCurrentStepIndex = () => {
    switch (step) {
      case "fetching": return 0
      case "calculating": return 1
      case "complete": return 2
      default: return 0
    }
  }

  // Reset and start flow when modal opens
  useEffect(() => {
    if (open) {
      setStep("fetching")
      setShowProofModal(false)
    }
  }, [open])

  // Auto-advance through steps
  useEffect(() => {
    if (!open) return

    if (step === "fetching") {
      const timer = setTimeout(() => setStep("calculating"), 2000)
      return () => clearTimeout(timer)
    }
    if (step === "calculating") {
      const timer = setTimeout(() => setStep("complete"), 2500)
      return () => clearTimeout(timer)
    }
  }, [step, open])

  const handleGenerateProof = useCallback(() => {
    setShowProofModal(true)
  }, [])

  const handleProofClose = useCallback(() => {
    setShowProofModal(false)
    onClose()
  }, [onClose])

  if (!open) return null

  if (showProofModal) {
    return (
      <ProofGenerationModal
        open={showProofModal}
        onClose={handleProofClose}
        score={finalScore}
        threshold={600}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-abyss/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-pure-white border border-pearl-gray rounded-2xl shadow-xl animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-abyss transition-colors z-10 hover:bg-soft-cream rounded-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          {/* Step Indicator */}
          <div className="mb-8">
            <StepIndicator steps={steps} currentStep={getCurrentStepIndex()} />
          </div>

          {/* Fetching State */}
          {step === "fetching" && (
            <div className="space-y-6 animate-slide-up">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-aleo-teal/10 flex items-center justify-center mb-4">
                  <Loader2 className="w-8 h-8 text-aleo-teal animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-abyss mb-2">
                  Fetching Wallet Metrics
                </h3>
                <p className="text-text-secondary">
                  Analyzing your on-chain activity...
                </p>
              </div>

              {/* Skeleton Loaders */}
              <div className="space-y-3">
                {["Transaction count", "Wallet age", "DeFi score", "Repayment rate", "Token balance"].map((label, i) => (
                  <div
                    key={label}
                    className="flex items-center justify-between p-4 rounded-xl bg-soft-cream"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <span className="text-sm text-text-secondary">{label}</span>
                    <div className="skeleton w-20 h-6" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calculating State */}
          {step === "calculating" && (
            <div className="space-y-6 animate-slide-up">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-abyss mb-2">
                  Calculating Your Score
                </h3>
                <p className="text-text-secondary">
                  Applying bonus calculations...
                </p>
              </div>

              <BonusBreakdown
                baseScore={BASE_SCORE}
                bonuses={bonusItems}
                totalScore={finalScore}
                showFormula
              />
            </div>
          )}

          {/* Complete State */}
          {step === "complete" && (
            <div className="space-y-8 animate-slide-up">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-abyss mb-2">
                  Score Calculation Complete
                </h3>
                <p className="text-text-secondary">
                  Your credit score has been calculated
                </p>
              </div>

              {/* Score Ring */}
              <div className="flex justify-center">
                <ScoreRing score={finalScore} animated showRiskLevel />
              </div>

              {/* Score Breakdown Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="premium-card p-4 text-center">
                  <div className="text-2xl font-bold font-mono text-text-muted mb-1">
                    {BASE_SCORE}
                  </div>
                  <div className="text-xs text-text-secondary">Base Score</div>
                </div>
                <div className="premium-card p-4 text-center">
                  <div className="text-2xl font-bold font-mono text-aleo-teal mb-1">
                    +{totalBonus}
                  </div>
                  <div className="text-xs text-text-secondary">Total Bonus</div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {bonusItems.map((bonus) => (
                  <div
                    key={bonus.label}
                    className="p-3 rounded-xl bg-soft-cream text-center"
                  >
                    <div
                      className="text-lg font-bold font-mono mb-1"
                      style={{ color: bonus.color }}
                    >
                      +{bonus.value}
                    </div>
                    <div className="text-xs text-text-secondary">{bonus.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button
                size="lg"
                onClick={handleGenerateProof}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-aleo-teal to-electric-violet hover:from-aleo-teal/90 hover:to-electric-violet/90 text-white rounded-xl transition-all duration-300 btn-glow"
              >
                Generate Zero-Knowledge Proof
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
