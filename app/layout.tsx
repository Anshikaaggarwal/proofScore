import React from "react"
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Aleo Credit | Pure On-Chain Credit Scoring',
  description: 'The first credit SDK on Aleo. Generate your on-chain credit score with zero-knowledge proofs. Privacy-first, instant verification, universally portable.',
  keywords: ['Aleo', 'credit score', 'Web3', 'zero-knowledge', 'zkSNARK', 'DeFi', 'blockchain', 'privacy', 'on-chain', 'SDK'],
  authors: [{ name: 'Aleo Credit' }],
  generator: 'Next.js',
  openGraph: {
    title: 'Aleo Credit | Pure On-Chain Credit Scoring',
    description: 'The first credit SDK on Aleo. Pure on-chain credit scoring with zero-knowledge proofs.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aleo Credit | First Credit SDK on Aleo',
    description: 'Pure on-chain credit scoring with zero-knowledge proofs. Privacy-first, universally portable.',
  },
}

export const viewport: Viewport = {
  themeColor: '#FAFBFC',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
