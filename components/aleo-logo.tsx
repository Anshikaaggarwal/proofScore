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
    sm: { icon: 28, text: "text-lg", subtext: "text-[9px]" },
    md: { icon: 36, text: "text-xl", subtext: "text-[10px]" },
    lg: { icon: 44, text: "text-2xl", subtext: "text-xs" },
    xl: { icon: 56, text: "text-3xl", subtext: "text-sm" },
  }

  const iconSize = sizes[size].icon

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Icon Mark */}
      <div className="relative">
        {/* Glow effect */}
        {animated && (
          <div 
            className="absolute inset-0 blur-xl opacity-50"
            style={{
              background: "linear-gradient(135deg, #00F0FF, #00FF88)",
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
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#00FF88" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Outer hexagon */}
          <path
            d="M24 4L42 14V34L24 44L6 34V14L24 4Z"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
          />
          
          {/* Inner hexagon filled */}
          <path
            d="M24 12L34 18V30L24 36L14 30V18L24 12Z"
            fill="url(#logoGradient)"
          />
          
          {/* Credit symbol */}
          <g>
            <path
              d="M24 20C22.3431 20 21 21.3431 21 23C21 24.6569 22.3431 26 24 26"
              stroke="#0A0A0A"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <line x1="20" y1="24" x2="27" y2="24" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="27" x2="27" y2="27" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" />
          </g>
          
          {/* Top accent */}
          <circle cx="24" cy="8" r="2" fill="#00F0FF" />
        </svg>
      </div>

      {/* Wordmark */}
      {variant === "full" && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-bold tracking-tight text-pure-white", sizes[size].text)}>
            ALEO
          </span>
          <span className={cn("font-semibold tracking-[0.25em] text-neon-cyan uppercase", sizes[size].subtext)}>
            CREDIT
          </span>
        </div>
      )}
    </div>
  )
}

export function AleoLogoMark({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="markGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="50%" stopColor="#00FF88" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <path
        d="M24 4L42 14V34L24 44L6 34V14L24 4Z"
        stroke="url(#markGradient)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M24 12L34 18V30L24 36L14 30V18L24 12Z"
        fill="url(#markGradient)"
      />
    </svg>
  )
}
