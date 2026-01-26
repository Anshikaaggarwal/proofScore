"use client"

import { cn } from "@/lib/utils"

interface AleoLogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "full" | "icon"
  animated?: boolean
}

export function AleoLogo({ 
  className, 
  size = "md", 
  variant = "full",
  animated = false 
}: AleoLogoProps) {
  const sizes = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-xl" },
    lg: { icon: 40, text: "text-2xl" },
    xl: { icon: 56, text: "text-3xl" },
  }

  const iconSize = sizes[size].icon

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Icon Mark */}
      <div className="relative">
        {/* Glow effect */}
        {animated && (
          <div 
            className="absolute inset-0 blur-xl opacity-40 animate-pulse-glow"
            style={{
              background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)",
              borderRadius: "12px",
            }}
          />
        )}
        
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 48 48"
          fill="none"
          className={cn(
            "relative z-10 transition-transform duration-300",
            animated && "hover:scale-105"
          )}
        >
          {/* Background circle with gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="logoGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          
          {/* Outer ring */}
          <circle 
            cx="24" 
            cy="24" 
            r="22" 
            stroke="url(#logoGradient)" 
            strokeWidth="2"
            fill="url(#logoGradientLight)"
            className={cn(animated && "animate-subtle-pulse")}
          />
          
          {/* Inner geometric shape - representing credit/trust */}
          <path
            d="M24 8 L36 18 L36 30 L24 40 L12 30 L12 18 Z"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinejoin="round"
          />
          
          {/* Center diamond */}
          <path
            d="M24 16 L30 24 L24 32 L18 24 Z"
            fill="url(#logoGradient)"
            className={cn(animated && "animate-subtle-pulse")}
          />
          
          {/* Connection lines representing network/proof */}
          <line x1="24" y1="8" x2="24" y2="16" stroke="url(#logoGradient)" strokeWidth="1.5" />
          <line x1="24" y1="32" x2="24" y2="40" stroke="url(#logoGradient)" strokeWidth="1.5" />
          <line x1="12" y1="18" x2="18" y2="24" stroke="url(#logoGradient)" strokeWidth="1.5" />
          <line x1="30" y1="24" x2="36" y2="18" stroke="url(#logoGradient)" strokeWidth="1.5" />
          <line x1="12" y1="30" x2="18" y2="24" stroke="url(#logoGradient)" strokeWidth="1.5" />
          <line x1="30" y1="24" x2="36" y2="30" stroke="url(#logoGradient)" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Wordmark */}
      {variant === "full" && (
        <div className={cn("font-semibold tracking-tight", sizes[size].text)}>
          <span className="text-abyss">aleo</span>
          <span className="gradient-text">credit</span>
        </div>
      )}
    </div>
  )
}

// Alternate minimal logo for favicon/small spaces
export function AleoLogoMark({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="markGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      
      <rect 
        x="2" 
        y="2" 
        width="28" 
        height="28" 
        rx="8" 
        fill="url(#markGradient)" 
      />
      
      <path
        d="M16 6 L24 12 L24 20 L16 26 L8 20 L8 12 Z"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      
      <path
        d="M16 11 L20 16 L16 21 L12 16 Z"
        fill="white"
      />
    </svg>
  )
}
