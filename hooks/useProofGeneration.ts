/**
 * Use Proof Generation Hook
 * 
 * React hook for generating zero-knowledge proofs for credit scores
 * 
 * @module hooks/useProofGeneration
 */

'use client';

import { useState, useCallback } from 'react';
import { proofGenerator, type ProofResult, type ProofProgress } from '@/lib/zk/ProofGenerator';
import type { CreditAssessment } from '@/types/sdk';

interface UseProofGenerationReturn {
    proof: ProofResult | null;
    isGenerating: boolean;
    progress: ProofProgress | null;
    error: string | null;
    generateProof: (assessment: CreditAssessment) => Promise<void>;
    generateRangeProof: (assessment: CreditAssessment, min: number, max: number) => Promise<void>;
    generateThresholdProof: (assessment: CreditAssessment, threshold: number) => Promise<void>;
    reset: () => void;
}

/**
 * Hook for generating zero-knowledge proofs
 * 
 * @returns Proof generation state and functions
 * 
 * @example
 * ```tsx
 * const { proof, isGenerating, progress, generateProof } = useProofGeneration();
 * 
 * const handleGenerate = async () => {
 *   await generateProof(assessment);
 * };
 * 
 * if (isGenerating) {
 *   return <div>Generating proof: {progress?.message}</div>;
 * }
 * 
 * if (proof) {
 *   return <div>Proof generated: {proof.proof}</div>;
 * }
 * ```
 */
export function useProofGeneration(): UseProofGenerationReturn {
    const [proof, setProof] = useState<ProofResult | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState<ProofProgress | null>(null);
    const [error, setError] = useState<string | null>(null);

    /**
     * Generate a standard proof
     */
    const generateProof = useCallback(async (assessment: CreditAssessment) => {
        setIsGenerating(true);
        setError(null);
        setProof(null);
        setProgress(null);

        try {
            console.log('[useProofGeneration] Starting proof generation...');

            const result = await proofGenerator.generateProof(
                assessment,
                (progressUpdate) => {
                    setProgress(progressUpdate);
                }
            );

            setProof(result);
            console.log('[useProofGeneration] Proof generated successfully:', result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate proof';
            setError(errorMessage);
            console.error('[useProofGeneration] Error:', err);
        } finally {
            setIsGenerating(false);
        }
    }, []);

    /**
     * Generate a range proof
     */
    const generateRangeProof = useCallback(
        async (assessment: CreditAssessment, min: number, max: number) => {
            setIsGenerating(true);
            setError(null);
            setProof(null);
            setProgress(null);

            try {
                console.log(`[useProofGeneration] Generating range proof (${min}-${max})...`);

                const result = await proofGenerator.generateRangeProof(
                    assessment,
                    min,
                    max,
                    (progressUpdate) => {
                        setProgress(progressUpdate);
                    }
                );

                setProof(result);
                console.log('[useProofGeneration] Range proof generated:', result);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to generate range proof';
                setError(errorMessage);
                console.error('[useProofGeneration] Error:', err);
            } finally {
                setIsGenerating(false);
            }
        },
        []
    );

    /**
     * Generate a threshold proof
     */
    const generateThresholdProof = useCallback(
        async (assessment: CreditAssessment, threshold: number) => {
            setIsGenerating(true);
            setError(null);
            setProof(null);
            setProgress(null);

            try {
                console.log(`[useProofGeneration] Generating threshold proof (≥${threshold})...`);

                const result = await proofGenerator.generateThresholdProof(
                    assessment,
                    threshold,
                    (progressUpdate) => {
                        setProgress(progressUpdate);
                    }
                );

                setProof(result);
                console.log('[useProofGeneration] Threshold proof generated:', result);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to generate threshold proof';
                setError(errorMessage);
                console.error('[useProofGeneration] Error:', err);
            } finally {
                setIsGenerating(false);
            }
        },
        []
    );

    /**
     * Reset state
     */
    const reset = useCallback(() => {
        setProof(null);
        setIsGenerating(false);
        setProgress(null);
        setError(null);
    }, []);

    return {
        proof,
        isGenerating,
        progress,
        error,
        generateProof,
        generateRangeProof,
        generateThresholdProof,
        reset,
    };
}
