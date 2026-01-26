"use client"

import Link from "next/link"
import { Github, Twitter, MessageCircle } from "lucide-react"
import { AleoLogo } from "./aleo-logo"

const footerLinks = {
  product: [
    { label: "Dashboard", href: "/" },
    { label: "Documentation", href: "#docs" },
    { label: "API Reference", href: "#api" },
    { label: "Changelog", href: "#changelog" },
  ],
  developers: [
    { label: "Getting Started", href: "#start" },
    { label: "SDK", href: "#sdk" },
    { label: "Examples", href: "#examples" },
    { label: "GitHub", href: "https://github.com" },
  ],
  resources: [
    { label: "Blog", href: "#blog" },
    { label: "Community", href: "#community" },
    { label: "Support", href: "#support" },
    { label: "Status", href: "#status" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Cookie Policy", href: "#cookies" },
  ],
}

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: MessageCircle, href: "https://discord.com", label: "Discord" },
]

export function Footer() {
  return (
    <footer className="bg-void-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <AleoLogo size="sm" variant="full" />
            </Link>
            <p className="text-sm text-light-gray mb-4 leading-relaxed">
              The first credit SDK on Aleo. Privacy-preserving credit scoring powered by zero-knowledge proofs.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-charcoal flex items-center justify-center text-light-gray hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all duration-200 border border-white/5 hover:border-neon-cyan/30"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4 text-text-muted">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-light-gray hover:text-neon-cyan transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4 text-text-muted">
              Developers
            </h4>
            <ul className="space-y-3">
              {footerLinks.developers.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-light-gray hover:text-neon-cyan transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4 text-text-muted">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-light-gray hover:text-neon-cyan transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4 text-text-muted">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-light-gray hover:text-neon-cyan transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            {new Date().getFullYear()} Aleo Credit. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green" />
            </span>
            <p className="text-sm text-light-gray">
              All systems operational
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
