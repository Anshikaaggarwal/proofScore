"use client"

import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  label: string
  description?: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isPending = index > currentStep

          return (
            <div key={step.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                {/* Step circle */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                    isCompleted && "bg-neon-green text-white",
                    isCurrent && "bg-aleo-teal text-white",
                    isPending && "bg-soft-cream border-2 border-pearl-gray text-text-muted"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Step label */}
                <span
                  className={cn(
                    "mt-2 text-xs sm:text-sm font-medium text-center transition-colors duration-300",
                    isCompleted && "text-neon-green",
                    isCurrent && "text-aleo-teal",
                    isPending && "text-text-muted"
                  )}
                >
                  {step.label}
                </span>

                {/* Step description */}
                {step.description && isCurrent && (
                  <span className="mt-1 text-xs text-text-muted text-center max-w-[100px] animate-slide-up">
                    {step.description}
                  </span>
                )}
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 sm:mx-4">
                  <div
                    className={cn(
                      "h-full transition-all duration-500 rounded-full",
                      isCompleted ? "bg-neon-green" : "bg-pearl-gray"
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
