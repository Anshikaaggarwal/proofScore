"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Wallet, ChevronDown, Copy, ExternalLink, LogOut, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { AleoLogo } from "./aleo-logo"

interface NavbarProps {
  isConnected?: boolean
  address?: string
  onConnect?: () => void
  onDisconnect?: () => void
}

export function Navbar({ isConnected = false, address, onConnect, onDisconnect }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const navLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Docs", href: "#docs" },
    { label: "SDK", href: "#sdk" },
  ]

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-deep-black/90 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <AleoLogo size="md" variant="full" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-light-gray hover:text-pure-white transition-colors duration-200 text-sm font-medium relative group uppercase tracking-wide"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-green transition-all duration-200 group-hover:w-full rounded-full" />
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Wallet Button */}
            {isConnected && address ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="hidden sm:flex items-center gap-2 bg-charcoal/80 border-white/10 hover:border-neon-cyan/40 hover:bg-charcoal text-pure-white rounded-lg"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green" />
                    </span>
                    <span className="font-mono text-sm">{truncateAddress(address)}</span>
                    <ChevronDown className="w-4 h-4 text-light-gray" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-carbon border-white/10 rounded-lg"
                >
                  <DropdownMenuItem
                    onClick={copyAddress}
                    className="cursor-pointer hover:bg-charcoal rounded-lg text-pure-white"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 mr-2 text-neon-green" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2 text-light-gray" />
                    )}
                    {copied ? "Copied!" : "Copy Address"}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-charcoal rounded-lg text-pure-white">
                    <ExternalLink className="w-4 h-4 mr-2 text-light-gray" />
                    View on Explorer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={onDisconnect}
                    className="cursor-pointer hover:bg-hot-pink/10 text-hot-pink rounded-lg"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={onConnect}
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-neon-cyan to-neon-green hover:opacity-90 text-void-black font-semibold transition-all duration-200 rounded-lg uppercase tracking-wide text-sm"
              >
                <Wallet className="w-4 h-4" />
                Connect
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-pure-white hover:text-neon-cyan transition-colors rounded-lg hover:bg-charcoal"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isMobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-light-gray hover:text-pure-white hover:bg-charcoal transition-colors duration-200 text-base font-medium py-3 px-4 rounded-lg uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-white/5">
              {isConnected && address ? (
                <div className="flex flex-col gap-3 px-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-neon-green" />
                    <span className="font-mono text-light-gray">{truncateAddress(address)}</span>
                  </div>
                  <Button
                    onClick={onDisconnect}
                    variant="outline"
                    className="w-full border-hot-pink/30 text-hot-pink hover:bg-hot-pink/10 bg-transparent rounded-lg"
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <div className="px-4">
                  <Button
                    onClick={onConnect}
                    className="w-full bg-gradient-to-r from-neon-cyan to-neon-green text-void-black font-semibold rounded-lg uppercase tracking-wide"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
