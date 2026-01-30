'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2, AlertCircle } from 'lucide-react';
import { CreditScoreSDK } from '@/lib/sdk';
import type { CreditIssuanceResult } from '@/types/sdk';

interface CreditIssuanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    userAddress: string;
    onSuccess?: (result: CreditIssuanceResult) => void;
}

type FlowStep = 'connect' | 'fetch' | 'calculate' | 'prove' | 'submit' | 'success' | 'error';

interface StepStatus {
    step: FlowStep;
    status: 'pending' | 'loading' | 'success' | 'error';
    message: string;
    progress?: number;
}

export function CreditIssuanceModal({
    isOpen,
    onClose,
    userAddress,
    onSuccess,
}: CreditIssuanceModalProps) {
    const [currentStep, setCurrentStep] = useState<FlowStep>('connect');
    const [steps, setSteps] = useState<StepStatus[]>([
        { step: 'connect', status: 'pending', message: 'Connect wallet' },
        { step: 'fetch', status: 'pending', message: 'Fetch on-chain metrics' },
        { step: 'calculate', status: 'pending', message: 'Calculate credit score' },
        { step: 'prove', status: 'pending', message: 'Generate zero-knowledge proof' },
        { step: 'submit', status: 'pending', message: 'Submit to blockchain' },
    ]);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<CreditIssuanceResult | null>(null);

    // Update step status
    const updateStep = (step: FlowStep, status: StepStatus['status'], message?: string, progress?: number) => {
        setSteps((prev) =>
            prev.map((s) =>
                s.step === step
                    ? { ...s, status, message: message || s.message, progress }
                    : s
            )
        );
    };

    // Execute credit issuance flow
    const executeFlow = async () => {
        try {
            const sdk = new CreditScoreSDK();

            // Step 1: Connect
            setCurrentStep('connect');
            updateStep('connect', 'loading');
            await sdk.init(userAddress);
            await new Promise((resolve) => setTimeout(resolve, 500));
            updateStep('connect', 'success');

            // Step 2: Fetch metrics
            setCurrentStep('fetch');
            updateStep('fetch', 'loading', 'Fetching wallet metrics...');
            const metrics = await sdk.fetchWalletMetrics();
            updateStep('fetch', 'success', `Found ${metrics.transactionCount} transactions`);

            // Step 3: Calculate score
            setCurrentStep('calculate');
            updateStep('calculate', 'loading', 'Calculating credit score...');
            const assessment = sdk.calculateScore(metrics);
            await new Promise((resolve) => setTimeout(resolve, 500));
            updateStep('calculate', 'success', `Score: ${assessment.finalScore}/850`);

            // Step 4: Generate proof
            setCurrentStep('prove');
            updateStep('prove', 'loading', 'Generating ZK proof (2-3s)...', 0);

            // Simulate progress
            const proofInterval = setInterval(() => {
                setSteps((prev) =>
                    prev.map((s) =>
                        s.step === 'prove' && s.progress !== undefined
                            ? { ...s, progress: Math.min((s.progress || 0) + 10, 90) }
                            : s
                    )
                );
            }, 200);

            const proof = await sdk.generateProof(assessment);
            clearInterval(proofInterval);
            updateStep('prove', 'success', 'Proof generated', 100);

            // Step 5: Submit transaction
            setCurrentStep('submit');
            updateStep('submit', 'loading', 'Submitting to Aleo blockchain...');

            // Mock private key (in production, this comes from wallet)
            const mockPrivateKey = 'APrivateKey1zkp...';
            const issuanceResult = await sdk.issueCredit(proof, mockPrivateKey);

            if (issuanceResult.success) {
                updateStep('submit', 'success', 'Transaction confirmed');
                setResult(issuanceResult);
                setCurrentStep('success');
                onSuccess?.(issuanceResult);
            } else {
                throw new Error(issuanceResult.error || 'Transaction failed');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            setCurrentStep('error');
            updateStep(currentStep, 'error', errorMessage);
        }
    };

    // Auto-start flow when modal opens
    useEffect(() => {
        if (isOpen && userAddress) {
            executeFlow();
        }
    }, [isOpen, userAddress]);

    // Reset on close
    const handleClose = () => {
        setCurrentStep('connect');
        setSteps([
            { step: 'connect', status: 'pending', message: 'Connect wallet' },
            { step: 'fetch', status: 'pending', message: 'Fetch on-chain metrics' },
            { step: 'calculate', status: 'pending', message: 'Calculate credit score' },
            { step: 'prove', status: 'pending', message: 'Generate zero-knowledge proof' },
            { step: 'submit', status: 'pending', message: 'Submit to blockchain' },
        ]);
        setError(null);
        setResult(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-void-black/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-2xl glass-card p-8"
                >
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-charcoal transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-text-muted" />
                    </button>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-pure-white mb-2">
                            {currentStep === 'success' ? 'Credit Score Issued!' : 'Issuing Credit Score'}
                        </h2>
                        <p className="text-text-secondary">
                            {currentStep === 'success'
                                ? 'Your credit score has been successfully recorded on the Aleo blockchain'
                                : 'Generating your verifiable credit score with zero-knowledge proofs'}
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-4 mb-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`
                  flex items-start gap-4 p-4 rounded-lg transition-colors
                  ${step.status === 'loading' ? 'bg-neon-cyan/5 border border-neon-cyan/20' : ''}
                  ${step.status === 'success' ? 'bg-neon-green/5 border border-neon-green/20' : ''}
                  ${step.status === 'error' ? 'bg-hot-pink/5 border border-hot-pink/20' : ''}
                  ${step.status === 'pending' ? 'bg-charcoal/30' : ''}
                `}
                            >
                                {/* Icon */}
                                <div className="flex-shrink-0 mt-0.5">
                                    {step.status === 'pending' && (
                                        <div className="w-6 h-6 rounded-full border-2 border-text-muted/30" />
                                    )}
                                    {step.status === 'loading' && (
                                        <Loader2 className="w-6 h-6 text-neon-cyan animate-spin" />
                                    )}
                                    {step.status === 'success' && (
                                        <div className="w-6 h-6 rounded-full bg-neon-green/20 border-2 border-neon-green flex items-center justify-center">
                                            <Check className="w-4 h-4 text-neon-green" />
                                        </div>
                                    )}
                                    {step.status === 'error' && (
                                        <div className="w-6 h-6 rounded-full bg-hot-pink/20 border-2 border-hot-pink flex items-center justify-center">
                                            <AlertCircle className="w-4 h-4 text-hot-pink" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-pure-white mb-1">
                                        {step.message}
                                    </div>

                                    {/* Progress bar for proof generation */}
                                    {step.step === 'prove' && step.status === 'loading' && step.progress !== undefined && (
                                        <div className="mt-2">
                                            <div className="h-1.5 bg-charcoal rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${step.progress}%` }}
                                                    transition={{ duration: 0.3 }}
                                                    className="h-full bg-gradient-to-r from-neon-cyan to-neon-green"
                                                />
                                            </div>
                                            <div className="text-xs text-text-muted mt-1">
                                                {step.progress}% complete
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Success state */}
                    {currentStep === 'success' && result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 bg-neon-green/5 border-neon-green/20"
                        >
                            <div className="text-center space-y-4">
                                <div className="text-5xl font-bold gradient-text">
                                    {result.creditRecord?.score || 'N/A'}
                                </div>
                                <div className="text-sm text-text-secondary">
                                    Your Credit Score
                                </div>
                                <div className="text-xs text-text-muted font-mono">
                                    TX: {result.transactionId.slice(0, 16)}...
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="btn-primary w-full mt-4"
                                >
                                    View Dashboard
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Error state */}
                    {currentStep === 'error' && error && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 bg-hot-pink/5 border-hot-pink/20"
                        >
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-hot-pink flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <div className="font-semibold text-pure-white mb-1">
                                        Error Occurred
                                    </div>
                                    <div className="text-sm text-text-secondary">
                                        {error}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setError(null);
                                            setCurrentStep('connect');
                                            executeFlow();
                                        }}
                                        className="btn-outline mt-4"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
