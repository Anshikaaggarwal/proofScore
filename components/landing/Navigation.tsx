'use client';

/**
 * Enhanced Navigation Component with Puzzle Wallet
 * 
 * Uses Puzzle Wallet SDK for wallet integration
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wallet, ExternalLink, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePuzzleWallet } from '@/lib/hooks/usePuzzleWallet';

export function Navigation() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showWalletMenu, setShowWalletMenu] = useState(false);
    const puzzleWallet = usePuzzleWallet();

    // Check if wallet is connected
    const isConnected = puzzleWallet.isConnected;
    const connectedAddress = puzzleWallet.address;

    const navLinks = [
        { href: '#features', label: 'Features' },
        { href: '#how-it-works', label: 'How It Works' },
        { href: '/docs', label: 'Documentation' },
        { href: 'https://github.com/proofscore', label: 'GitHub', external: true },
    ];

    // Format address for display
    const formatAddress = (address: string | null) => {
        if (!address) return '';
        return `${address.slice(0, 10)}...${address.slice(-8)}`;
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

                        {/* Desktop Wallet Button */}
                        <div className="hidden md:flex items-center gap-4">
                            {isConnected ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowWalletMenu(!showWalletMenu)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 hover:bg-neon-cyan/20 transition-all"
                                    >
                                        <Wallet className="w-4 h-4 text-neon-cyan" />
                                        <span className="text-sm font-medium text-neon-cyan">
                                            {formatAddress(connectedAddress)}
                                        </span>
                                        <ChevronDown className="w-4 h-4 text-neon-cyan" />
                                    </button>

                                    {showWalletMenu && (
                                        <div className="absolute top-full right-0 mt-2 w-48 glass-card p-2 space-y-1 z-50">
                                            <button
                                                onClick={() => {
                                                    puzzleWallet.disconnect();
                                                    setShowWalletMenu(false);
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-neon-cyan hover:bg-neon-cyan/10 rounded-lg transition-all"
                                            >
                                                Disconnect
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={async () => {
                                        try {
                                            await puzzleWallet.connect();
                                        } catch (error) {
                                            console.log('Puzzle Wallet connection failed:', error);
                                        }
                                    }}
                                    className="px-4 py-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 hover:bg-neon-cyan/20 transition-all text-sm font-medium text-neon-cyan"
                                >
                                    <Wallet className="w-4 h-4 inline mr-2" />
                                    Connect Wallet
                                </button>
                            )}
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
                                {isConnected ? (
                                    <button
                                        onClick={() => {
                                            puzzleWallet.disconnect();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 hover:bg-neon-cyan/20 transition-all text-sm font-medium text-neon-cyan"
                                    >
                                        <Wallet className="w-4 h-4 inline mr-2" />
                                        Disconnect ({formatAddress(connectedAddress)})
                                    </button>
                                ) : (
                                    <button
                                        onClick={async () => {
                                            try {
                                                await puzzleWallet.connect();
                                                setMobileMenuOpen(false);
                                            } catch (error) {
                                                console.log('Puzzle Wallet connection failed:', error);
                                            }
                                        }}
                                        className="w-full px-4 py-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 hover:bg-neon-cyan/20 transition-all text-sm font-medium text-neon-cyan"
                                    >
                                        <Wallet className="w-4 h-4 inline mr-2" />
                                        Connect Wallet
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
