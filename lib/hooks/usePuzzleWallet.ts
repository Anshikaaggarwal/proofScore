'use client';

/**
 * Puzzle Wallet Integration Hook
 * 
 * Provides a unified interface for Puzzle Wallet SDK
 * Integrates with the existing wallet provider architecture
 * 
 * @module lib/hooks/usePuzzleWallet
 */

import { useAccount, useConnect, useDisconnect } from '@puzzlehq/sdk';
import { Network } from '@puzzlehq/types';
import { useCallback } from 'react';

export interface PuzzleWalletState {
    address: string | null;
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
}

export interface PuzzleWalletActions {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
}

/**
 * Hook to interact with Puzzle Wallet
 * 
 * Provides wallet connection state and actions
 * Automatically syncs with Puzzle Wallet browser extension
 * 
 * @example
 * ```tsx
 * const { address, isConnected, connect, disconnect } = usePuzzleWallet();
 * 
 * // Connect wallet
 * await connect();
 * 
 * // Disconnect wallet
 * await disconnect();
 * ```
 */
export function usePuzzleWallet(): PuzzleWalletState & PuzzleWalletActions {
    // Get account information from Puzzle SDK
    const { account, loading: accountLoading, error: accountError } = useAccount();

    // Get connection functionality
    const {
        connect: puzzleConnect,
        loading: connectLoading,
        error: connectError,
        isConnected
    } = useConnect({
        dAppInfo: {
            name: 'ProofScore',
            description: 'Privacy-first Web3 credit scoring platform on Aleo blockchain',
        },
        permissions: {
            programIds: {
                [Network.AleoTestnet]: ['credit_score.aleo'],
            },
        },
    });

    // Get disconnect functionality
    const { disconnect: puzzleDisconnect } = useDisconnect();

    // Unified connect function
    const connect = useCallback(async () => {
        try {
            await puzzleConnect();
        } catch (error) {
            console.error('[PuzzleWallet] Connection failed:', error);
            throw error;
        }
    }, [puzzleConnect]);

    // Unified disconnect function
    const disconnect = useCallback(async () => {
        try {
            await puzzleDisconnect();
        } catch (error) {
            console.error('[PuzzleWallet] Disconnect failed:', error);
            throw error;
        }
    }, [puzzleDisconnect]);

    // Determine loading state
    const loading = accountLoading || connectLoading;

    // Determine error state
    const error = accountError || (connectError ? String(connectError) : null);

    // Get address from account
    const address = account?.address || null;

    return {
        address,
        isConnected: isConnected || false,
        isConnecting: loading,
        error,
        connect,
        disconnect,
    };
}

/**
 * Format Aleo address for display
 * Shows first 12 and last 8 characters
 */
export function formatAleoAddress(address: string | null): string {
    if (!address) return '';
    return `${address.slice(0, 12)}...${address.slice(-8)}`;
}
