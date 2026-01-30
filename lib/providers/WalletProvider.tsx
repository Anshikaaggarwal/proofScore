'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

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

    // Check for existing connection on mount
    useEffect(() => {
        const savedAddress = localStorage.getItem('proofscore_wallet_address');
        if (savedAddress) {
            setState((prev) => ({
                ...prev,
                address: savedAddress,
                isConnected: true,
            }));
        }
    }, []);

    // Connect wallet
    const connect = useCallback(async () => {
        setState((prev) => ({ ...prev, isConnecting: true, error: null }));

        try {
            // TODO: Integrate with real Aleo wallet (Leo Wallet, Puzzle Wallet, etc.)
            // For now, generate a mock address
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const mockAddress = 'aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc';

            setState({
                address: mockAddress,
                isConnected: true,
                isConnecting: false,
                error: null,
            });

            // Persist connection
            localStorage.setItem('proofscore_wallet_address', mockAddress);

            console.log('[Wallet] Connected:', mockAddress);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
            setState((prev) => ({
                ...prev,
                isConnecting: false,
                error: errorMessage,
            }));
            console.error('[Wallet] Connection failed:', error);
        }
    }, []);

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
