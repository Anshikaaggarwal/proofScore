/**
 * Use Wallet Metrics Hook
 * 
 * Fetches and manages wallet metrics from Aleo blockchain
 * Provides real-time data for credit score calculation
 * 
 * @module hooks/useWalletMetrics
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { aleoDataService, type WalletMetricsRaw } from '@/lib/services/AleoDataService';
import type { WalletMetrics } from '@/types/sdk';

interface UseWalletMetricsReturn {
    metrics: WalletMetrics | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Hook to fetch wallet metrics from Aleo blockchain
 * 
 * @param address - Aleo wallet address (null if not connected)
 * @param autoFetch - Whether to automatically fetch on mount (default: true)
 * @returns Wallet metrics, loading state, error, and refetch function
 * 
 * @example
 * ```tsx
 * const { metrics, loading, error, refetch } = useWalletMetrics(address);
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 * if (!metrics) return <div>No data</div>;
 * 
 * return <div>Score: {metrics.defiScore}</div>;
 * ```
 */
export function useWalletMetrics(
    address: string | null,
    autoFetch: boolean = true
): UseWalletMetricsReturn {
    const [metrics, setMetrics] = useState<WalletMetrics | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch wallet metrics from blockchain
     */
    const fetchMetrics = useCallback(async () => {
        if (!address) {
            setMetrics(null);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('[useWalletMetrics] Fetching metrics for:', address);

            // Fetch raw metrics from Aleo blockchain
            const rawMetrics = await aleoDataService.getWalletMetrics(address);

            // Transform to WalletMetrics format
            const walletMetrics: WalletMetrics = {
                address: rawMetrics.address,
                transactionCount: rawMetrics.transactionCount,
                walletAgeMonths: rawMetrics.walletAgeMonths,
                defiScore: await aleoDataService.calculateDefiScore(address),
                repaymentRate: calculateRepaymentRate(rawMetrics), // Calculate from transaction history
                tokenBalance: rawMetrics.balance.total,
                lastTransactionDate: rawMetrics.lastTransactionDate,
            };

            setMetrics(walletMetrics);
            console.log('[useWalletMetrics] Metrics fetched successfully:', walletMetrics);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wallet metrics';
            setError(errorMessage);
            console.error('[useWalletMetrics] Error:', err);
        } finally {
            setLoading(false);
        }
    }, [address]);

    /**
     * Auto-fetch on address change
     */
    useEffect(() => {
        if (autoFetch && address) {
            fetchMetrics();
        }
    }, [address, autoFetch, fetchMetrics]);

    /**
     * Refetch function for manual updates
     */
    const refetch = useCallback(async () => {
        await fetchMetrics();
    }, [fetchMetrics]);

    return {
        metrics,
        loading,
        error,
        refetch,
    };
}

/**
 * Calculate repayment rate from transaction history
 * 
 * This is a simplified calculation. In production, this would analyze
 * actual lending/borrowing transactions to determine repayment behavior.
 * 
 * @param rawMetrics - Raw wallet metrics
 * @returns Repayment rate (0-100)
 */
function calculateRepaymentRate(rawMetrics: WalletMetricsRaw): number {
    // Simplified calculation based on wallet activity
    // In production, this would analyze actual loan repayment history

    const { transactionCount, walletAgeMonths, defiInteractions } = rawMetrics;

    // Base score on wallet maturity and activity
    let score = 50; // Start at 50%

    // Bonus for wallet age (older = more reliable)
    if (walletAgeMonths > 12) score += 20;
    else if (walletAgeMonths > 6) score += 10;
    else if (walletAgeMonths > 3) score += 5;

    // Bonus for transaction history
    if (transactionCount > 100) score += 15;
    else if (transactionCount > 50) score += 10;
    else if (transactionCount > 20) score += 5;

    // Bonus for DeFi activity
    if (defiInteractions > 50) score += 15;
    else if (defiInteractions > 20) score += 10;
    else if (defiInteractions > 10) score += 5;

    // Cap at 100
    return Math.min(100, score);
}

/**
 * Hook to fetch wallet metrics with caching
 * 
 * Uses localStorage to cache metrics for better performance
 * Cache expires after 5 minutes
 */
export function useWalletMetricsWithCache(
    address: string | null,
    cacheKey: string = 'wallet_metrics_cache'
): UseWalletMetricsReturn {
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    const [metrics, setMetrics] = useState<WalletMetrics | null>(() => {
        // Try to load from cache on mount
        if (typeof window === 'undefined' || !address) return null;

        try {
            const cached = localStorage.getItem(`${cacheKey}_${address}`);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_DURATION) {
                    console.log('[useWalletMetricsWithCache] Using cached data');
                    return data;
                }
            }
        } catch (err) {
            console.error('[useWalletMetricsWithCache] Cache read error:', err);
        }

        return null;
    });

    const [loading, setLoading] = useState<boolean>(!metrics && !!address);
    const [error, setError] = useState<string | null>(null);

    const fetchMetrics = useCallback(async () => {
        if (!address) {
            setMetrics(null);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const rawMetrics = await aleoDataService.getWalletMetrics(address);

            const walletMetrics: WalletMetrics = {
                address: rawMetrics.address,
                transactionCount: rawMetrics.transactionCount,
                walletAgeMonths: rawMetrics.walletAgeMonths,
                defiScore: await aleoDataService.calculateDefiScore(address),
                repaymentRate: calculateRepaymentRate(rawMetrics),
                tokenBalance: rawMetrics.balance.total,
                lastTransactionDate: rawMetrics.lastTransactionDate,
            };

            setMetrics(walletMetrics);

            // Cache the result
            try {
                localStorage.setItem(
                    `${cacheKey}_${address}`,
                    JSON.stringify({
                        data: walletMetrics,
                        timestamp: Date.now(),
                    })
                );
            } catch (err) {
                console.error('[useWalletMetricsWithCache] Cache write error:', err);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wallet metrics';
            setError(errorMessage);
            console.error('[useWalletMetricsWithCache] Error:', err);
        } finally {
            setLoading(false);
        }
    }, [address, cacheKey]);

    useEffect(() => {
        if (address && !metrics) {
            fetchMetrics();
        }
    }, [address, metrics, fetchMetrics]);

    const refetch = useCallback(async () => {
        await fetchMetrics();
    }, [fetchMetrics]);

    return {
        metrics,
        loading,
        error,
        refetch,
    };
}
