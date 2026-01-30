'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wallet, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useAleoWallet, useFormattedAddress } from '@/hooks/useAleoWallet';
import { useWalletModal } from '@demox-labs/aleo-wallet-adapter-reactui';

export function Navigation() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { address, isConnected, isConnecting, disconnect, walletName } = useAleoWallet();
    const formattedAddress = useFormattedAddress();
    const { setVisible } = useWalletModal();

    const navLinks = [
        { href: '#features', label: 'Features' },
        { href: '#how-it-works', label: 'How It Works' },
        { href: '/docs', label: 'Documentation' },
        { href: 'https://github.com/proofscore', label: 'GitHub', external: true },
    ];

    const handleWalletAction = () => {
        if (isConnected) {
            disconnect();
        } else {
            setVisible(true); // Open wallet selection modal
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
            <div className="max-w-7xl mx-auto">
                <div className="glass-card px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-green flex items-center justify-center font-bold text-void-black text-xl">
                                P
                            </div>
                            <span className="text-xl font-bold gradient-text-static">
                                ProofScore
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    target={link.external ? '_blank' : undefined}
                                    rel={link.external ? 'noopener noreferrer' : undefined}
                                    className="text-sm font-medium text-text-secondary hover:text-neon-cyan transition-colors flex items-center gap-1"
                                >
                                    {link.label}
                                    {link.external && <ExternalLink className="w-3 h-3" />}
                                </a>
                            ))}
                        </div>

                        {/* Desktop CTA */}
                        <div className="hidden md:flex items-center gap-4">
                            <button
                                onClick={handleWalletAction}
                                disabled={isConnecting}
                                className={`
                  px-6 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2
                  ${isConnected
                                        ? 'bg-neon-green/10 border border-neon-green/30 text-neon-green'
                                        : 'btn-primary'
                                    }
                  ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                            >
                                <Wallet className="w-4 h-4" />
                                {isConnecting ? 'Connecting...' : isConnected ? formattedAddress : 'Connect Wallet'}
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-text-secondary hover:text-pure-white transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden mt-2 max-w-7xl mx-auto overflow-hidden"
                    >
                        <div className="glass-card p-6 space-y-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    target={link.external ? '_blank' : undefined}
                                    rel={link.external ? 'noopener noreferrer' : undefined}
                                    className="block text-text-secondary hover:text-neon-cyan transition-colors py-2 flex items-center gap-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                    {link.external && <ExternalLink className="w-4 h-4" />}
                                </a>
                            ))}
                            <div className="pt-4 border-t border-glass-border">
                                <button
                                    onClick={() => {
                                        handleWalletAction();
                                        setMobileMenuOpen(false);
                                    }}
                                    disabled={isConnecting}
                                    className={`
                    w-full px-6 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2
                    ${isConnected
                                            ? 'bg-neon-green/10 border border-neon-green/30 text-neon-green'
                                            : 'btn-primary'
                                        }
                    ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                                >
                                    <Wallet className="w-4 h-4" />
                                    {isConnecting ? 'Connecting...' : isConnected ? formattedAddress : 'Connect Wallet'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
