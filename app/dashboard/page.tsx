'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Clock, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { ScoreRing } from '@/components/dashboard/ScoreRing';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { ScoreBreakdown } from '@/components/dashboard/ScoreBreakdown';
import { ScoreInsights } from '@/components/dashboard/ScoreInsights';
import { ActionCards, QuickActions } from '@/components/dashboard/ActionCards';
import { Navigation } from '@/components/landing/Navigation';
import { ProofGenerationModal } from '@/components/ProofGenerationModal';
import { ScoringEngine } from '@/lib/sdk';
import type { CreditAssessment } from '@/types/sdk';
import { usePuzzleWallet } from '@/lib/hooks/usePuzzleWallet';
import { useWalletMetricsWithCache } from '@/hooks/useWalletMetrics';

export default function DashboardPage() {
    const { address, isConnected } = usePuzzleWallet();
    const { metrics, loading: metricsLoading, error: metricsError, refetch } = useWalletMetricsWithCache(address);
    const [assessment, setAssessment] = useState<CreditAssessment | null>(null);
    const [isGeneratingScore, setIsGeneratingScore] = useState(false);
    const [isProofModalOpen, setIsProofModalOpen] = useState(false);

    // Generate credit score when metrics are available
    useEffect(() => {
        if (metrics && !assessment) {
            setIsGeneratingScore(true);
            // Simulate score generation delay for better UX
            setTimeout(() => {
                const calculatedAssessment = ScoringEngine.calculateScore(metrics);
                setAssessment(calculatedAssessment);
                setIsGeneratingScore(false);
            }, 1000);
        }
    }, [metrics, assessment]);

    // Handle refresh
    const handleRefresh = async () => {
        setAssessment(null);
        await refetch();
    };

    // Check if wallet is connected
    if (!isConnected || !address) {
        return (
            <div className="min-h-screen bg-deep-black flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="text-2xl font-bold text-pure-white">Wallet Not Connected</div>
                    <div className="text-text-secondary">Please connect your Puzzle Wallet to view your credit score</div>
                    <Link href="/" className="btn-primary inline-block px-6 py-3 mt-4">Go Back Home</Link>
                </div>
            </div>
        );
    }

    // Show loading state
    if (metricsLoading || isGeneratingScore) {
        return (
            <div className="min-h-screen bg-deep-black flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto" />
                    <div className="text-text-secondary">{metricsLoading ? 'Fetching wallet data from blockchain...' : 'Generating your credit score...'}</div>
                </div>
            </div>
        );
    }

    // Show error state
    if (metricsError) {
        return (
            <div className="min-h-screen bg-deep-black flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="text-2xl font-bold text-hot-pink">Error Loading Data</div>
                    <div className="text-text-secondary max-w-md">{metricsError}</div>
                    <button onClick={handleRefresh} className="btn-primary inline-flex items-center gap-2 px-6 py-3 mt-4">
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Show no data state
    if (!metrics || !assessment) {
        return (
            <div className="min-h-screen bg-deep-black flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="text-2xl font-bold text-pure-white">No Score Available</div>
                    <div className="text-text-secondary">Unable to generate credit score. Please try refreshing.</div>
                    <button onClick={handleRefresh} className="btn-primary inline-flex items-center gap-2 px-6 py-3 mt-4">
                        <RefreshCw className="w-4 h-4" />
                        Refresh Data
                    </button>
                </div>
            </div>
        );
    }

    const mockTransactionId = 'at1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc';

    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-deep-black">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="gradient-blur gradient-blur-cyan absolute -top-40 -right-40 opacity-10" />
                <div className="gradient-blur gradient-blur-purple absolute bottom-0 -left-40 opacity-10" />
            </div>
            <div className="absolute inset-0 grid-pattern opacity-20" />

            {/* Navigation */}
            <Navigation />

            {/* Main Content */}
            <div className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-text-secondary hover:text-neon-cyan transition-colors mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-pure-white mb-2">
                                    Your Credit Dashboard
                                </h1>
                                <p className="text-text-secondary">
                                    Track your on-chain credit score and metrics
                                </p>
                            </div>

                            {/* Last Updated */}
                            <div className="flex items-center gap-2 text-sm text-text-muted">
                                <Clock className="w-4 h-4" />
                                <span>
                                    Updated{' '}
                                    {new Date(assessment.timestamp).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Score Ring Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mb-12"
                    >
                        <div className="glass-card p-12">
                            <div className="flex flex-col lg:flex-row items-center gap-12">
                                {/* Score Ring */}
                                <div className="flex-shrink-0">
                                    <ScoreRing
                                        score={assessment.finalScore}
                                        riskLevel={assessment.riskLevel}
                                        size="lg"
                                        animated={true}
                                    />
                                </div>

                                {/* Score Info */}
                                <div className="flex-1 space-y-6 text-center lg:text-left">
                                    <div>
                                        <h2 className="text-3xl font-bold text-pure-white mb-2">
                                            Excellent Credit Score!
                                        </h2>
                                        <p className="text-text-secondary text-lg">
                                            You're in the top{' '}
                                            <span className="text-neon-green font-semibold">
                                                {Math.round(
                                                    ((assessment.finalScore - 300) / 550) * 100
                                                )}
                                                %
                                            </span>{' '}
                                            of all Aleo users
                                        </p>
                                    </div>

                                    {/* Score Range */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-text-muted">Score Range</span>
                                            <span className="text-pure-white font-medium">
                                                300 - 850
                                            </span>
                                        </div>
                                        <div className="h-2 bg-charcoal rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-hot-pink via-neon-yellow via-neon-cyan to-neon-green rounded-full"
                                                style={{
                                                    width: `${((assessment.finalScore - 300) / 550) * 100
                                                        }%`,
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-text-muted">
                                            <span>Poor</span>
                                            <span>Fair</span>
                                            <span>Good</span>
                                            <span>Excellent</span>
                                        </div>
                                    </div>

                                    {/* Transaction Link */}
                                    {mockTransactionId && (
                                        <a
                                            href={`https://explorer.aleo.org/transaction/${mockTransactionId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-green transition-colors text-sm"
                                        >
                                            <span>View on Aleo Explorer</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}

                                    {/* Generate Proof Button */}
                                    <button
                                        onClick={() => setIsProofModalOpen(true)}
                                        className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Generate ZK Proof
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Metrics Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-bold text-pure-white mb-6">
                            Key Metrics
                        </h2>
                        <MetricsGrid metrics={metrics} />
                    </motion.div>

                    {/* Two Column Layout */}
                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        {/* Score Breakdown */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="lg:col-span-2"
                        >
                            <ScoreBreakdown assessment={assessment} />
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <QuickActions
                                address={metrics.address}
                                transactionId={mockTransactionId}
                                score={assessment.finalScore}
                            />
                        </motion.div>
                    </div>

                    {/* Action Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold text-pure-white mb-6">
                            Actions
                        </h2>
                        <ActionCards
                            transactionId={mockTransactionId}
                            onUpdateScore={() => console.log('Update score')}
                            onShareScore={() => console.log('Share score')}
                            onVerifyScore={() =>
                                window.open(
                                    `https://explorer.aleo.org/transaction/${mockTransactionId}`,
                                    '_blank'
                                )
                            }
                        />
                    </motion.div>
                </div>
            </div>

            {/* Proof Generation Modal */}
            <ProofGenerationModal
                isOpen={isProofModalOpen}
                onClose={() => setIsProofModalOpen(false)}
                assessment={assessment}
                walletAddress={address || ''}
                onProofGenerated={(proof) => {
                    console.log('Proof generated:', proof);
                }}
                onSubmissionComplete={(transactionId) => {
                    console.log('Submission complete:', transactionId);
                    // Could update mockTransactionId here
                }}
            />
        </div>
    );
}
