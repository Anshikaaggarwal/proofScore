import { useState, useCallback } from 'react';
import { WalletMetrics } from '@/types/sdk';
import { AleoDataService } from '@/lib/services/AleoDataService';

interface UseWalletMetricsResult {
    metrics: WalletMetrics | null;
    loading: boolean;
    error: string | null;
    fetchMetrics: (address: string) => Promise<void>;
    resetMetrics: () => void;
}

export function useWalletMetrics(): UseWalletMetricsResult {
    const [metrics, setMetrics] = useState<WalletMetrics | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMetrics = useCallback(async (address: string) => {
        if (!address) return;

        setLoading(true);
        setError(null);

        try {
            const service = AleoDataService.getInstance();
            const data = await service.fetchAllMetrics(address);
            setMetrics(data);
        } catch (err) {
            console.error('Failed to fetch wallet metrics:', err);
            setError('Failed to load wallet data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    const resetMetrics = useCallback(() => {
        setMetrics(null);
        setError(null);
        setLoading(false);
    }, []);

    return {
        metrics,
        loading,
        error,
        fetchMetrics,
        resetMetrics
    };
}
