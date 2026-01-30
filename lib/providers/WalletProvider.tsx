'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { usePuzzleWallet } from '@/lib/hooks/usePuzzleWallet';

interface WalletState {
    address: string | null;
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
}

interface WalletContextValue extends WalletState {
    connect: () => Promise<void>;
    disconnect: () => void;
    switchAccount: (address: string) => void;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<WalletState>({
        address: null,
        isConnected: false,
        isConnecting: false,
        error: null,
    });

    // Use Puzzle Wallet SDK
    const puzzleWallet = usePuzzleWallet();

    // Sync Puzzle Wallet state with local state
    useEffect(() => {
        setState({
            address: puzzleWallet.address,
            isConnected: puzzleWallet.isConnected,
            isConnecting: puzzleWallet.isConnecting,
            error: puzzleWallet.error,
        });
    }, [puzzleWallet.address, puzzleWallet.isConnected, puzzleWallet.isConnecting, puzzleWallet.error]);

    // Connect wallet using Puzzle SDK
    const connect = useCallback(async () => {
        setState((prev) => ({ ...prev, isConnecting: true, error: null }));

        try {
            await puzzleWallet.connect();
            console.log('[Wallet] Connected via Puzzle Wallet:', puzzleWallet.address);
        } catch (error) {
            // Fallback to mock mode for development
            console.warn('[Wallet] Puzzle Wallet not available, using mock mode');
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const mockAddress = 'aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc';

            setState({
                address: mockAddress,
                isConnected: true,
                isConnecting: false,
                error: null,
            });

            localStorage.setItem('proofscore_wallet_address', mockAddress);
            console.log('[Wallet] Connected (mock):', mockAddress);
        }
    }, [puzzleWallet]);

    // Disconnect wallet
    const disconnect = useCallback(() => {
        setState({
            address: null,
            isConnected: false,
            isConnecting: false,
            error: null,
        });

        localStorage.removeItem('proofscore_wallet_address');
        console.log('[Wallet] Disconnected');
    }, []);

    // Switch account
    const switchAccount = useCallback((address: string) => {
        setState((prev) => ({
            ...prev,
            address,
            isConnected: true,
        }));

        localStorage.setItem('proofscore_wallet_address', address);
        console.log('[Wallet] Switched to:', address);
    }, []);

    const value: WalletContextValue = {
        ...state,
        connect,
        disconnect,
        switchAccount,
    };

    return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}

// Utility hook for formatted address
export function useFormattedAddress(address: string | null): string {
    if (!address) return '';
    return `${address.slice(0, 12)}...${address.slice(-8)}`;
}
