'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Navigation } from '@/components/landing/Navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative w-full overflow-hidden bg-deep-black">
      {/* Navigation */}
      <Navigation />
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="gradient-blur gradient-blur-cyan absolute -top-40 -left-40 opacity-20" />
        <div className="gradient-blur gradient-blur-green absolute top-1/2 -right-40 opacity-15" />
        <div className="gradient-blur gradient-blur-purple absolute -bottom-40 left-1/2 opacity-10" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm font-medium text-neon-cyan">
                First Production-Ready Credit Scoring on Aleo
              </span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="gradient-text-hero animate-gradient-flow">
                  Privacy-First
                </span>
                <br />
                <span className="text-pure-white">Credit Scoring</span>
                <br />
                <span className="text-text-secondary">for Web3</span>
              </h1>

              <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
                Generate verifiable credit scores with{' '}
                <span className="text-neon-cyan font-semibold">zero-knowledge proofs</span>.
                <br />
                Your data stays private. Your score stays portable.
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-primary group px-8 py-4 text-lg flex items-center gap-2"
              >
                Generate Your Score
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link href="/docs">
                <button className="btn-outline px-8 py-4 text-lg">
                  View Documentation
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12"
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-neon-cyan">
                  <span className="number-counter">10s</span>
                </div>
                <div className="text-sm text-text-muted mt-1">Score Generation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-neon-green">
                  <span className="number-counter">100%</span>
                </div>
                <div className="text-sm text-text-muted mt-1">Private</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-electric-purple">
                  <span className="number-counter">∞</span>
                </div>
                <div className="text-sm text-text-muted mt-1">Portable</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-text-muted">
            <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-text-muted/30 rounded-full flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 bg-neon-cyan rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Why ProofScore?</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              The first production-ready credit scoring platform built for the Aleo ecosystem
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Privacy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card p-8 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7 text-neon-cyan" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-pure-white">
                True Privacy
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Zero-knowledge proofs ensure your wallet data never leaves your device.
                Only the proof is submitted on-chain.
              </p>
            </motion.div>

            {/* Feature 2: Speed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-8 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-neon-green" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-pure-white">
                Lightning Fast
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Generate your credit score in under 10 seconds.
                Optimized proof generation with parallel processing.
              </p>
            </motion.div>

            {/* Feature 3: Verifiable */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-card p-8 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-electric-purple/10 border border-electric-purple/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-electric-purple" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-pure-white">
                Universally Verifiable
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Your credit score is stored on Aleo blockchain.
                Verifiable by any DeFi protocol, anywhere.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-32 px-6 bg-carbon/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">How It Works</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Four simple steps to generate your verifiable credit score
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Wallet',
                description: 'Connect your Aleo wallet to get started',
                color: 'neon-cyan',
              },
              {
                step: '02',
                title: 'Fetch Metrics',
                description: 'We analyze your on-chain activity privately',
                color: 'neon-green',
              },
              {
                step: '03',
                title: 'Generate Proof',
                description: 'Create a zero-knowledge proof on your device',
                color: 'electric-purple',
              },
              {
                step: '04',
                title: 'Issue Credit',
                description: 'Submit proof and receive your score on-chain',
                color: 'hot-pink',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  <div className={`text-6xl font-bold text-${item.color} opacity-20 mb-4`}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-pure-white">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {item.description}
                  </p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-text-muted/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card p-12 space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to <span className="gradient-text">Prove Your Credit</span>?
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Join the future of decentralized finance with privacy-preserving credit scores
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary group px-10 py-5 text-lg mt-6"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform inline-block" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-glass-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold gradient-text mb-3">ProofScore</h3>
              <p className="text-text-secondary text-sm max-w-md">
                The first production-ready credit scoring platform on Aleo blockchain.
                Privacy-first, verifiable, and universally portable.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-pure-white">Product</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-pure-white">Community</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-neon-cyan transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="divider-gradient mb-8" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
            <p>© 2026 ProofScore. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-neon-cyan transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-neon-cyan transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
