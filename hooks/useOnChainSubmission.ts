/**
 * Use On-Chain Submission Hook
 * 
 * React hook for submitting proofs to the Aleo blockchain
 * 
 * @module hooks/useOnChainSubmission
 */

'use client';

import { useState, useCallback } from 'react';
import { onChainService, type SubmissionResult, type SubmissionProgress, type TransactionDetails } from '@/lib/services/OnChainService';
import type { CreditAssessment } from '@/types/sdk';
import type { ProofResult } from '@/lib/zk/ProofGenerator';

interface UseOnChainSubmissionReturn {
    result: SubmissionResult | null;
    isSubmitting: boolean;
    progress: SubmissionProgress | null;
    transactionDetails: TransactionDetails | null;
    error: string | null;
    submitProof: (assessment: CreditAssessment, proof: ProofResult, walletAddress: string) => Promise<void>;
    getTransactionDetails: (transactionId: string) => Promise<void>;
    reset: () => void;
}

/**
 * Hook for on-chain proof submission
 * 
 * @returns Submission state and functions
 * 
 * @example
 * ```tsx
 * const { result, isSubmitting, progress, submitProof } = useOnChainSubmission();
 * 
 * const handleSubmit = async () => {
 *   await submitProof(assessment, proof, walletAddress);
 * };
 * 
 * if (isSubmitting) {
 *   return <div>Submitting: {progress?.message}</div>;
 * }
 * 
 * if (result?.success) {
 *   return <div>Transaction ID: {result.transactionId}</div>;
 * }
 * ```
 */
export function useOnChainSubmission(): UseOnChainSubmissionReturn {
    const [result, setResult] = useState<SubmissionResult | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progress, setProgress] = useState<SubmissionProgress | null>(null);
    const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
    const [error, setError] = useState<string | null>(null);

    /**
     * Submit proof to blockchain
     */
    const submitProof = useCallback(
        async (assessment: CreditAssessment, proof: ProofResult, walletAddress: string) => {
            setIsSubmitting(true);
            setError(null);
            setResult(null);
            setProgress(null);
            setTransactionDetails(null);

            try {
                console.log('[useOnChainSubmission] Starting submission...');

                const submissionResult = await onChainService.submitProof(
                    assessment,
                    proof,
                    walletAddress,
                    (progressUpdate) => {
                        setProgress(progressUpdate);
                    }
                );

                setResult(submissionResult);

                if (submissionResult.success && submissionResult.transactionId) {
                    // Fetch transaction details
                    const details = await onChainService.getTransactionDetails(
                        submissionResult.transactionId
                    );
                    setTransactionDetails(details);
                    console.log('[useOnChainSubmission] Submission successful:', details);
                } else if (submissionResult.error) {
                    setError(submissionResult.error);
                    console.error('[useOnChainSubmission] Submission failed:', submissionResult.error);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to submit proof';
                setError(errorMessage);
                console.error('[useOnChainSubmission] Error:', err);
            } finally {
                setIsSubmitting(false);
            }
        },
        []
    );

    /**
     * Get transaction details by ID
     */
    const getTransactionDetails = useCallback(async (transactionId: string) => {
        try {
            console.log('[useOnChainSubmission] Fetching transaction details...');
            const details = await onChainService.getTransactionDetails(transactionId);
            setTransactionDetails(details);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transaction details';
            setError(errorMessage);
            console.error('[useOnChainSubmission] Error fetching details:', err);
        }
    }, []);

    /**
     * Reset state
     */
    const reset = useCallback(() => {
        setResult(null);
        setIsSubmitting(false);
        setProgress(null);
        setTransactionDetails(null);
        setError(null);
    }, []);

    return {
        result,
        isSubmitting,
        progress,
        transactionDetails,
        error,
        submitProof,
        getTransactionDetails,
        reset,
    };
}
