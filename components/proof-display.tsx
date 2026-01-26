"use client"

import { useState } from "react"
import { Check, Copy, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProofComponent {
  label: string
  values: string[]
}

interface ProofDisplayProps {
  proofHash: string
  components: ProofComponent[]
  className?: string
}

export function ProofDisplay({ proofHash, components, className }: ProofDisplayProps) {
  const [copiedHash, setCopiedHash] = useState(false)
  const [copiedComponent, setCopiedComponent] = useState<string | null>(null)
  const [expandedComponents, setExpandedComponents] = useState<string[]>([])

  const copyToClipboard = async (text: string, type: "hash" | string) => {
    await navigator.clipboard.writeText(text)
    if (type === "hash") {
      setCopiedHash(true)
      setTimeout(() => setCopiedHash(false), 2000)
    } else {
      setCopiedComponent(type)
      setTimeout(() => setCopiedComponent(null), 2000)
    }
  }

  const toggleExpand = (label: string) => {
    setExpandedComponents((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Proof Hash */}
      <div className="premium-card p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Proof Hash
          </h4>
          <span className="text-xs text-text-muted font-mono">On-Chain Reference</span>
        </div>
        <div className="flex items-center gap-3">
          <code className="flex-1 font-mono text-sm md:text-base text-aleo-teal bg-soft-cream px-4 py-3 rounded-xl overflow-x-auto">
            {proofHash}
          </code>
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(proofHash, "hash")}
            className="shrink-0 border-pearl-gray hover:border-aleo-teal/40 hover:bg-aleo-teal/10 bg-transparent"
          >
            {copiedHash ? (
              <Check className="w-4 h-4 text-neon-green" />
            ) : (
              <Copy className="w-4 h-4 text-text-secondary" />
            )}
          </Button>
        </div>
        <p className="text-xs text-text-muted mt-2">
          This hash commits to your proof on-chain
        </p>
      </div>

      {/* Proof Components */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
          Proof Components
        </h4>
        <div className="grid gap-3 md:grid-cols-3">
          {components.map((component, index) => {
            const isExpanded = expandedComponents.includes(component.label)
            return (
              <div
                key={component.label}
                className="premium-card p-4 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-abyss">{component.label}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-aleo-teal/10"
                      onClick={() => copyToClipboard(component.values.join("\n"), component.label)}
                    >
                      {copiedComponent === component.label ? (
                        <Check className="w-3 h-3 text-neon-green" />
                      ) : (
                        <Copy className="w-3 h-3 text-text-secondary" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-aleo-teal/10"
                      onClick={() => toggleExpand(component.label)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-3 h-3 text-text-secondary" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-text-secondary" />
                      )}
                    </Button>
                  </div>
                </div>
                <div
                  className={cn(
                    "font-mono text-xs text-text-secondary bg-soft-cream rounded-lg p-2 overflow-hidden transition-all duration-300",
                    isExpanded ? "max-h-40" : "max-h-16"
                  )}
                >
                  {component.values.map((value, i) => (
                    <div key={i} className="truncate">
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-text-muted text-center">
          Total size: ~300 bytes (highly compressed)
        </p>
      </div>
    </div>
  )
}
