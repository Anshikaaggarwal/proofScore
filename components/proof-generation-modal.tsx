"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Check, Loader2, Shield, Lock, ArrowRight, ExternalLink, Twitter, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProofDisplay } from "@/components/proof-display"
import { TxStatus } from "@/components/tx-status"
import { cn } from "@/lib/utils"

type ProofStep = "witness" | "generating" | "verifying" | "ready" | "submitting" | "success"

interface ProofGenerationModalProps {
  open: boolean
  onClose: () => void
  score: number
  threshold: number
}

const generateMockProof = () => ({
  hash: "0x4a7f2c19e8b3d5a6f1c9e2b4d7a8c3f5e6b9d2a1c4f7e8b3d6a9c2f5e8b1d4a7",
  components: [
    {
      label: "a (Field[2])",
      values: ["0x2c3f8a1b4e6d9c7f0a3b5e8d1c4f7a9b", "0x5a1b3c7d9e2f4a6b8c0d3e5f7a9b1c3d"],
    },
    {
      label: "b (Field[2][2])",
      values: [
        "0x7e2d4f6a8c0b3e5d7f9a1c3b5e7d9f1a",
        "0x9c4f6e8a0b2d4f6a8c0e2d4f6a8b0c2d",
        "0x3b5e7d9f1a3c5e7d9f1b3c5e7d9f1a3c",
        "0x1f8a3c5e7d9f1b3c5e7d9f1a3c5e7d9f",
      ],
    },
    {
      label: "c (Field[2])",
      values: ["0x6d9a2c4e6f8b0d2e4f6a8c0b2d4f6e8a", "0xc2e7d9f1a3b5c7e9d1f3a5b7c9e1d3f5"],
    },
  ],
})

export function ProofGenerationModal({ open, onClose, score, threshold }: ProofGenerationModalProps) {
  const [step, setStep] = useState<ProofStep>("witness")
  const [proof, setProof] = useState<ReturnType<typeof generateMockProof> | null>(null)
  const [verificationChecks, setVerificationChecks] = useState<string[]>([])

  const proofSteps = [
    { id: "witness", label: "Create Witness", description: "Building private witness data..." },
    { id: "generating", label: "Generate Proof", description: "Creating Groth16 proof..." },
    { id: "verifying", label: "Verify Locally", description: "Checking proof validity..." },
    { id: "ready", label: "Ready", description: "Proof is ready!" },
  ]

  const getStepIndex = (s: ProofStep) => {
    const map: Record<ProofStep, number> = {
      witness: 0,
      generating: 1,
      verifying: 2,
      ready: 3,
      submitting: 3,
      success: 3,
    }
    return map[s]
  }

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setStep("witness")
      setProof(null)
      setVerificationChecks([])
    }
  }, [open])

  // Auto-advance through proof generation steps
  useEffect(() => {
    if (!open) return

    if (step === "witness") {
      const timer = setTimeout(() => setStep("generating"), 2000)
      return () => clearTimeout(timer)
    }
    if (step === "generating") {
      const timer = setTimeout(() => {
        setProof(generateMockProof())
        setStep("verifying")
      }, 3000)
      return () => clearTimeout(timer)
    }
    if (step === "verifying") {
      const checks = [
        "Proof structure valid",
        "Public inputs valid",
        "Score within range",
        "Ready for blockchain",
      ]
      let i = 0
      const interval = setInterval(() => {
        if (i < checks.length) {
          setVerificationChecks((prev) => [...prev, checks[i]])
          i++
        } else {
          clearInterval(interval)
          setTimeout(() => setStep("ready"), 500)
        }
      }, 400)
      return () => clearInterval(interval)
    }
  }, [step, open])

  const handleIssueToBlockchain = useCallback(() => {
    setStep("submitting")
  }, [])

  const handleTxFinalized = useCallback(() => {
    setStep("success")
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-abyss/60 backdrop-blur-sm"
        onClick={step === "success" ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-pure-white border border-pearl-gray rounded-2xl shadow-xl animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-abyss transition-colors z-10 hover:bg-soft-cream rounded-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          {/* Success State */}
          {step === "success" && (
            <div className="space-y-8 animate-slide-up">
              {/* Success Header */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-neon-green/10 flex items-center justify-center">
                  <Check className="w-10 h-10 text-neon-green" />
                </div>
                <h3 className="text-2xl font-bold text-abyss mb-2">Credit Issued Successfully!</h3>
                <p className="text-text-secondary">
                  Your credit score has been verified and recorded on the Aleo blockchain
                </p>
              </div>

              {/* Credit Record */}
              <div className="premium-card p-6">
                <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                  Your Credit Record (Private)
                </h4>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Record Address</span>
                    <span className="text-aleo-teal">record1qz7k...5j8m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Score</span>
                    <span className="text-abyss font-semibold">{score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Threshold</span>
                    <span className="text-abyss">{threshold}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Issued Block</span>
                    <span className="text-abyss">1,000,103</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Expires Block</span>
                    <span className="text-abyss">1,100,103 (~6 months)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="h-12 border-pearl-gray hover:border-aleo-teal/40 hover:bg-aleo-teal/5 bg-transparent text-abyss"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Score
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-pearl-gray hover:border-aleo-teal/40 hover:bg-aleo-teal/5 bg-transparent text-abyss"
                  onClick={() => {
                    const text = encodeURIComponent(`Just verified my on-chain credit score with @AleoCredit! ${score}/850. Privacy-first verification.`)
                    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
                  }}
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button className="h-12 bg-gradient-to-r from-aleo-teal to-electric-violet text-white font-semibold">
                  Use in DeFi
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Transaction Submission State */}
          {step === "submitting" && (
            <div className="space-y-6 animate-slide-up">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-abyss mb-2">
                  Issuing to Blockchain
                </h3>
                <p className="text-text-secondary">
                  Submitting your proof to the Aleo network...
                </p>
              </div>

              <TxStatus
                txId="at1qz7kf9x4p8z3r2m5n6v7b8c9d0e1f2g3h4j5k6l7m8n9p0q1r2s3t4u5v6"
                onFinalized={handleTxFinalized}
              />
            </div>
          )}

          {/* Proof Generation States */}
          {(step === "witness" || step === "generating" || step === "verifying" || step === "ready") && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-abyss mb-2">
                  {step === "ready" ? "Your ZK Proof is Ready" : "Generating Your ZK Proof"}
                </h3>
                <p className="text-text-secondary">
                  {step === "ready"
                    ? "Proof verified locally and ready for blockchain submission"
                    : "Creating on-device proof... this takes 3-5 seconds"}
                </p>
              </div>

              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  {proofSteps.map((ps, index) => {
                    const currentIndex = getStepIndex(step)
                    const isCompleted = index < currentIndex
                    const isCurrent = index === currentIndex
                    return (
                      <div key={ps.id} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                              isCompleted && "bg-neon-green text-white",
                              isCurrent && "bg-aleo-teal text-white",
                              !isCompleted && !isCurrent && "bg-soft-cream border border-pearl-gray text-text-muted"
                            )}
                          >
                            {isCompleted ? (
                              <Check className="w-5 h-5" />
                            ) : isCurrent ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <span className="text-sm">{index + 1}</span>
                            )}
                          </div>
                          <span
                            className={cn(
                              "mt-2 text-xs font-medium text-center max-w-[80px]",
                              isCompleted && "text-neon-green",
                              isCurrent && "text-aleo-teal",
                              !isCompleted && !isCurrent && "text-text-muted"
                            )}
                          >
                            {ps.label}
                          </span>
                        </div>
                        {index < proofSteps.length - 1 && (
                          <div
                            className={cn(
                              "w-8 sm:w-16 h-0.5 mx-1 rounded-full",
                              index < currentIndex ? "bg-neon-green" : "bg-pearl-gray"
                            )}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Witness Visualization */}
              {(step === "witness" || step === "generating") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-slide-up">
                  {/* Private Witness */}
                  <div className="premium-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Lock className="w-4 h-4 text-warm-amber" />
                      <h4 className="text-sm font-semibold text-abyss">Private Witness</h4>
                    </div>
                    <pre className="font-mono text-xs text-text-secondary bg-soft-cream p-3 rounded-lg overflow-x-auto">
{`{
  score: ${score},
  metrics: {...},
  timestamp: ${Date.now()},
  userSecret: "0x7a3c..."
}`}
                    </pre>
                    <p className="text-xs text-warm-amber mt-2 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Never leaves your device
                    </p>
                  </div>

                  {/* Groth16 Process */}
                  <div className="premium-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-4 h-4 text-aleo-teal" />
                      <h4 className="text-sm font-semibold text-abyss">Groth16 Prover</h4>
                    </div>
                    <div className="flex flex-col items-center py-4">
                      <div className="w-12 h-12 rounded-xl bg-aleo-teal/10 flex items-center justify-center mb-3">
                        <Loader2 className="w-6 h-6 text-aleo-teal animate-spin" />
                      </div>
                      <div className="text-sm text-text-secondary text-center">
                        {step === "witness" ? "Preparing witness..." : "Computing proof..."}
                      </div>
                    </div>
                    <p className="text-xs text-aleo-teal text-center">
                      Runs locally in your browser
                    </p>
                  </div>
                </div>
              )}

              {/* Verification Checks */}
              {step === "verifying" && (
                <div className="premium-card p-4 mb-8 animate-slide-up">
                  <h4 className="text-sm font-semibold text-abyss mb-4">Local Verification</h4>
                  <div className="space-y-2">
                    {["Proof structure valid", "Public inputs valid", "Score within range", "Ready for blockchain"].map(
                      (check, i) => (
                        <div
                          key={check}
                          className={cn(
                            "flex items-center gap-2 transition-all duration-300",
                            verificationChecks.includes(check)
                              ? "opacity-100 translate-x-0"
                              : "opacity-30 translate-x-2"
                          )}
                        >
                          {verificationChecks.includes(check) ? (
                            <Check className="w-4 h-4 text-neon-green" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-pearl-gray" />
                          )}
                          <span
                            className={cn(
                              "text-sm",
                              verificationChecks.includes(check) ? "text-neon-green" : "text-text-muted"
                            )}
                          >
                            {check}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Proof Display */}
              {step === "ready" && proof && (
                <>
                  <ProofDisplay
                    proofHash={proof.hash}
                    components={proof.components}
                    className="mb-8"
                  />

                  {/* Issue CTA */}
                  <div className="space-y-3">
                    <Button
                      size="lg"
                      onClick={handleIssueToBlockchain}
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-aleo-teal to-electric-violet hover:from-aleo-teal/90 hover:to-electric-violet/90 text-white rounded-xl transition-all duration-300 btn-glow"
                    >
                      Issue Credit to Blockchain
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="text-xs text-text-muted text-center">
                      Network fee: 1000 credits (testnet)
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
