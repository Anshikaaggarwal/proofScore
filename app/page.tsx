"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { StatsSection } from "@/components/stats-section"
import { Footer } from "@/components/footer"
import { DashboardView } from "@/components/dashboard-view"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [address] = useState("aleo1qz7kf9x4p8z3r2m5n6v7b8c9d0e1f2g3h4j5k6")

  const handleConnect = () => {
    setIsConnected(true)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setShowDashboard(false)
  }

  const handleLaunchApp = () => {
    if (isConnected) {
      setShowDashboard(true)
    } else {
      handleConnect()
      setShowDashboard(true)
    }
  }

  if (showDashboard) {
    return (
      <main className="min-h-screen bg-deep-black">
        <Navbar
          isConnected={isConnected}
          address={address}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
        <DashboardView
          address={address}
          onBack={() => setShowDashboard(false)}
        />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-deep-black">
      <Navbar
        isConnected={isConnected}
        address={address}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
      <HeroSection onLaunchApp={handleLaunchApp} />
      <FeaturesSection />
      <StatsSection />
      
      {/* Final CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-deep-black">
        {/* Background elements */}
        <div className="gradient-blur gradient-blur-cyan absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="badge-neon mb-6 inline-flex">
            <span>Get Started Today</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pure-white mb-6">
            Ready to prove your{" "}
            <span className="gradient-text-static">creditworthiness</span>?
          </h2>
          <p className="text-lg text-light-gray mb-8 max-w-xl mx-auto">
            Join thousands of users who have already generated their on-chain credit scores
            with complete privacy protection.
          </p>
          <button
            onClick={handleLaunchApp}
            className="group inline-flex items-center gap-2 h-14 px-10 text-base font-semibold bg-gradient-to-r from-neon-cyan to-neon-green hover:opacity-90 text-void-black rounded-lg transition-all duration-300 uppercase tracking-wide"
          >
            Connect Wallet & Start
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
          <p className="mt-4 text-sm text-text-muted">
            No sign up required. Just connect your wallet.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
