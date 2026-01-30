'use client';

/**
 * Proof Generation Modal
 * 
 * Beautiful modal for generating zero-knowledge proofs
 * Shows progress, handles errors, and displays results
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, CheckCircle, AlertCircle, Loader2, Copy, ExternalLink, Send } from 'lucide-react';
import { useProofGeneration } from '@/hooks/useProofGeneration';
import { useOnChainSubmission } from '@/hooks/useOnChainSubmission';
import type { CreditAssessment } from '@/types/sdk';

interface ProofGenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    assessment: CreditAssessment;
    walletAddress: string;
    onProofGenerated?: (proof: string) => void;
    onSubmissionComplete?: (transactionId: string) => void;
}

export function ProofGenerationModal({
    isOpen,
    onClose,
    assessment,
    walletAddress,
    onProofGenerated,
    onSubmissionComplete,
}: ProofGenerationModalProps) {
    const { proof, isGenerating, progress, error, generateProof, reset } = useProofGeneration();
    const {
        result: submissionResult,
        isSubmitting,
        progress: submissionProgress,
        transactionDetails,
        error: submissionError,
        submitProof,
        reset: resetSubmission,
    } = useOnChainSubmission();
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        reset();
        resetSubmission();
        await generateProof(assessment);
        if (onProofGenerated && proof) {
            onProofGenerated(proof.proof);
        }
    };

    const handleSubmit = async () => {
        if (!proof) return;

        await submitProof(assessment, proof, walletAddress);

        if (submissionResult?.success && submissionResult.transactionId && onSubmissionComplete) {
            onSubmissionComplete(submissionResult.transactionId);
        }
    };

    const handleCopy = async () => {
        if (proof) {
            await navigator.clipboard.writeText(proof.proof);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleClose = () => {
        reset();
        resetSubmission();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-void-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-glass-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-electric-purple flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-void-black" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-pure-white">
                                            Generate ZK Proof
                                        </h2>
                                        <p className="text-sm text-text-muted">
                                            Privacy-preserving credit verification
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="w-8 h-8 rounded-lg hover:bg-glass-border transition-colors flex items-center justify-center"
                                >
                                    <X className="w-5 h-5 text-text-muted" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Score Info */}
                                <div className="glass-card p-4 border border-neon-cyan/20">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm text-text-secondary mb-1">
                                                Your Credit Score
                                            </div>
                                            <div className="text-3xl font-bold gradient-text">
                                                {assessment.finalScore}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-text-secondary mb-1">
                                                Risk Level
                                            </div>
                                            <div className={`text-lg font-semibold ${assessment.riskLevel === 'low' ? 'text-neon-green' :
                                                assessment.riskLevel === 'medium' ? 'text-electric-purple' :
                                                    'text-hot-pink'
                                                }`}>
                                                {assessment.riskLevel.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* What is ZK Proof */}
                                {!isGenerating && !proof && !error && (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-pure-white">
                                            What is a Zero-Knowledge Proof?
                                        </h3>
                                        <ul className="space-y-2 text-sm text-text-secondary">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                                                <span>Prove your creditworthiness without revealing your exact score</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                                                <span>Cryptographically secure and verifiable on-chain</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                                                <span>Maintain complete privacy while building trust</span>
                                            </li>
                                        </ul>
                                    </div>
                                )}

                                {/* Progress */}
                                {isGenerating && progress && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-text-secondary">{progress.message}</span>
                                            <span className="text-neon-cyan font-medium">{progress.progress}%</span>
                                        </div>
                                        <div className="h-2 bg-glass-border rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress.progress}%` }}
                                                transition={{ duration: 0.3 }}
                                                className="h-full bg-gradient-to-r from-neon-cyan to-electric-purple"
                                            />
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-neon-cyan">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span className="text-sm">Generating proof...</span>
                                        </div>
                                    </div>
                                )}

                                {/* Success */}
                                {proof && !error && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-neon-green">
                                            <CheckCircle className="w-5 h-5" />
                                            <span className="font-medium">Proof generated successfully!</span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-text-secondary">Proof Data</span>
                                                <button
                                                    onClick={handleCopy}
                                                    className="flex items-center gap-1 text-xs text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                    {copied ? 'Copied!' : 'Copy'}
                                                </button>
                                            </div>
                                            <div className="glass-card p-3 bg-void-black/50 border border-neon-cyan/20">
                                                <code className="text-xs text-neon-cyan font-mono break-all">
                                                    {proof.proof}
                                                </code>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <div className="text-text-muted mb-1">Score Commitment</div>
                                                <div className="text-pure-white font-mono text-xs truncate">
                                                    {proof.scoreCommitment}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-text-muted mb-1">Timestamp</div>
                                                <div className="text-pure-white">
                                                    {new Date(proof.timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Error */}
                                {error && (
                                    <div className="glass-card p-4 bg-hot-pink/10 border border-hot-pink/30">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="w-5 h-5 text-hot-pink flex-shrink-0 mt-0.5" />
                                            <div>
                                                <div className="font-medium text-hot-pink mb-1">
                                                    Proof Generation Failed
                                                </div>
                                                <div className="text-sm text-text-secondary">
                                                    {error}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-glass-border">
                                {!proof && !isGenerating && (
                                    <>
                                        <button
                                            onClick={handleClose}
                                            className="px-4 py-2 rounded-xl text-text-secondary hover:text-pure-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleGenerate}
                                            className="btn-primary px-6 py-2 flex items-center gap-2"
                                        >
                                            <Shield className="w-4 h-4" />
                                            Generate Proof
                                        </button>
                                    </>
                                )}

                                {proof && !submissionResult && (
                                    <>
                                        <button
                                            onClick={handleClose}
                                            className="px-4 py-2 rounded-xl text-text-secondary hover:text-pure-white transition-colors"
                                            disabled={isSubmitting}
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="btn-primary px-6 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    {submissionProgress?.message || 'Submitting...'}
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Submit On-Chain
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}

                                {submissionResult?.success && transactionDetails && (
                                    <>
                                        <button
                                            onClick={handleClose}
                                            className="px-4 py-2 rounded-xl text-text-secondary hover:text-pure-white transition-colors"
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={() => window.open(transactionDetails.explorerUrl, '_blank')}
                                            className="btn-primary px-6 py-2 flex items-center gap-2"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            View on Explorer
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
