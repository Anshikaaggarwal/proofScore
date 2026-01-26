"use client"

import { useState, useEffect } from "react"
import { Check, ExternalLink, Copy, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type TxState = "pending" | "included" | "confirmed" | "finalized"

interface TxStatusProps {
  txId: string
  initialState?: TxState
  onFinalized?: () => void
  className?: string
}

interface TxDetails {
  blockHeight: number
  targetBlock: number
  gasUsed: number
  fee: number
  timestamp: Date
}

const stateConfig: Record<TxState, { label: string; color: string; icon: "spinner" | "check" }> = {
  pending: { label: "Pending", color: "text-warm-amber", icon: "spinner" },
  included: { label: "In Block", color: "text-aleo-teal", icon: "spinner" },
  confirmed: { label: "Confirmed", color: "text-neon-green", icon: "check" },
  finalized: { label: "Finalized", color: "text-neon-green", icon: "check" },
}

export function TxStatus({
  txId,
  initialState = "pending",
  onFinalized,
  className,
}: TxStatusProps) {
  const [state, setState] = useState<TxState>(initialState)
  const [copied, setCopied] = useState(false)
  const [details, setDetails] = useState<TxDetails>({
    blockHeight: 1000100,
    targetBlock: 1000105,
    gasUsed: 247,
    fee: 1000,
    timestamp: new Date(),
  })

  // Simulate state progression
  useEffect(() => {
    if (state === "finalized") return

    const states: TxState[] = ["pending", "included", "confirmed", "finalized"]
    const currentIndex = states.indexOf(state)

    const timer = setTimeout(() => {
      const nextState = states[currentIndex + 1]
      if (nextState) {
        setState(nextState)
        if (nextState === "included" || nextState === "confirmed") {
          setDetails((prev) => ({
            ...prev,
            blockHeight: prev.blockHeight + 1,
          }))
        }
        if (nextState === "finalized" && onFinalized) {
          onFinalized()
        }
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [state, onFinalized])

  const copyTxId = async () => {
    await navigator.clipboard.writeText(txId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentConfig = stateConfig[state]
  const progress = ((details.blockHeight - 1000100) / (details.targetBlock - 1000100)) * 100

  return (
    <div className={cn("space-y-6", className)}>
      {/* Status Header */}
      <div className="premium-card p-6 animate-slide-up">
        <div className="flex items-center justify-center gap-3 mb-4">
          {currentConfig.icon === "spinner" ? (
            <Loader2 className={cn("w-8 h-8 animate-spin", currentConfig.color)} />
          ) : (
            <div
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center",
                "bg-neon-green/10"
              )}
            >
              <Check className="w-5 h-5 text-neon-green" />
            </div>
          )}
          <span className={cn("text-2xl font-bold", currentConfig.color)}>
            {currentConfig.label}
          </span>
        </div>

        {/* State Timeline */}
        <div className="flex items-center justify-between mb-6">
          {(["pending", "included", "confirmed", "finalized"] as TxState[]).map((s, index) => {
            const isCompleted =
              ["pending", "included", "confirmed", "finalized"].indexOf(state) >= index
            const isCurrent = state === s
            return (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted
                      ? "bg-neon-green"
                      : "bg-soft-cream border border-pearl-gray",
                    isCurrent && "ring-2 ring-neon-green/30 ring-offset-2 ring-offset-pure-white"
                  )}
                >
                  {isCompleted && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                {index < 3 && (
                  <div
                    className={cn(
                      "w-12 sm:w-20 h-0.5 mx-1 rounded-full",
                      isCompleted ? "bg-neon-green" : "bg-pearl-gray"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Progress Bar */}
        {state !== "finalized" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Block Confirmation</span>
              <span className="font-mono text-abyss">
                {details.blockHeight}/{details.targetBlock}
              </span>
            </div>
            <div className="h-2 bg-soft-cream rounded-full overflow-hidden">
              <div
                className="h-full bg-aleo-teal rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details */}
      <div className="premium-card p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
          Transaction Details
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Transaction ID</span>
            <div className="flex items-center gap-2">
              <code className="font-mono text-sm text-aleo-teal">
                {txId.slice(0, 8)}...{txId.slice(-6)}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-aleo-teal/10"
                onClick={copyTxId}
              >
                {copied ? (
                  <Check className="w-3 h-3 text-neon-green" />
                ) : (
                  <Copy className="w-3 h-3 text-text-secondary" />
                )}
              </Button>
              <a
                href={`https://explorer.aleo.org/transaction/${txId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-aleo-teal transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Status</span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-lg text-xs font-semibold",
                state === "finalized" || state === "confirmed"
                  ? "bg-neon-green/10 text-neon-green"
                  : "bg-warm-amber/10 text-warm-amber"
              )}
            >
              {currentConfig.label}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Block Height</span>
            <span className="font-mono text-abyss">{details.blockHeight.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Gas Used</span>
            <span className="font-mono text-abyss">{details.gasUsed} credits</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Fee</span>
            <span className="font-mono text-abyss">{details.fee.toLocaleString()} credits</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Timestamp</span>
            <span className="text-abyss">{details.timestamp.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
