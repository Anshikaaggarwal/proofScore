import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { WalletProvider } from '@/lib/providers/WalletProvider';
import './globals.css';

// Primary font: Inter (modern, clean, professional)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

// Monospace font: JetBrains Mono (code, addresses, numbers)
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'ProofScore | Privacy-First Web3 Credit Scoring on Aleo',
  description:
    'The first production-ready credit scoring platform on Aleo blockchain. Generate verifiable credit scores with zero-knowledge proofs. Privacy-first, instant verification, universally portable.',
  keywords: [
    'ProofScore',
    'Aleo',
    'credit score',
    'Web3',
    'zero-knowledge proofs',
    'zkSNARK',
    'DeFi',
    'blockchain',
    'privacy',
    'on-chain',
    'undercollateralized loans',
  ],
  authors: [{ name: 'ProofScore Team' }],
  creator: 'ProofScore',
  publisher: 'ProofScore',
  generator: 'Next.js',
  applicationName: 'ProofScore',
  referrer: 'origin-when-cross-origin',
  metadataBase: new URL('https://proofscore.io'),
  openGraph: {
    title: 'ProofScore | Privacy-First Web3 Credit Scoring',
    description:
      'Generate verifiable credit scores with zero-knowledge proofs on Aleo blockchain. Privacy-first, instant verification.',
    type: 'website',
    locale: 'en_US',
    url: 'https://proofscore.io',
    siteName: 'ProofScore',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProofScore | Privacy-First Credit Scoring on Aleo',
    description:
      'Generate verifiable credit scores with zero-knowledge proofs. Privacy-first, universally portable.',
    creator: '@proofscore',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0E27',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {/* Noise overlay for texture */}
        <div className="noise-overlay" />

        {/* Global Providers */}
        <WalletProvider>
          {/* Main content */}
          <main className="relative min-h-screen">
            {children}
          </main>
        </WalletProvider>

        {/* Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
