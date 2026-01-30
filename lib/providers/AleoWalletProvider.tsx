'use client';

/**
 * Aleo Wallet Adapter Provider
 * 
 * Production-ready wallet integration for Aleo blockchain
 * Supports multiple wallet types with automatic detection
 * 
 * Supported Wallets:
 * - Leo Wallet (Browser Extension)
 * - Puzzle Wallet (Browser Extension)
 * - Fox Wallet (Browser Extension)
 * - Soter Wallet (Browser Extension)
 * 
 * @module lib/providers/AleoWalletProvider
 */

import { WalletProvider } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletModalProvider } from '@demox-labs/aleo-wallet-adapter-reactui';
import { DecryptPermission, WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base';
import { useMemo, type ReactNode } from 'react';

// Import wallet adapter CSS
import '@demox-labs/aleo-wallet-adapter-reactui/styles.css';

interface AleoWalletProviderProps {
    children: ReactNode;
    network?: WalletAdapterNetwork;
    autoConnect?: boolean;
}

/**
 * Aleo Wallet Provider Component
 * 
 * Wraps the application with Aleo wallet adapter functionality
 * Provides wallet connection, signing, and transaction capabilities
 * 
 * How it works:
 * 1. The WalletProvider automatically detects installed browser extension wallets
 * 2. Users can connect via the WalletMultiButton component
 * 3. Once connected, wallet state is available via useWallet() hook
 * 
 * @example
 * ```tsx
 * <AleoWalletProvider network={WalletAdapterNetwork.TestnetBeta} autoConnect>
 *   <App />
 * </AleoWalletProvider>
 * ```
 */
export function AleoWalletProvider({
    children,
    network = WalletAdapterNetwork.TestnetBeta,
    autoConnect = true,
}: AleoWalletProviderProps) {
    // Wallet configuration
    // Empty array allows auto-detection of browser extension wallets
    // The adapter will automatically find: Leo Wallet, Puzzle Wallet, Fox Wallet, etc.
    const wallets = useMemo(() => [], []);

    // Decrypt permission for ZK proof generation
    // UponRequest = wallet will ask user permission when needed
    const decryptPermission = DecryptPermission.UponRequest;

    // Programs that require decryption permission
    // This allows the wallet to decrypt records from these programs
    const programs = useMemo(() => {
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'credit_score.aleo';
        return [contractAddress];
    }, []);

    return (
        <WalletProvider
            wallets={wallets}
            network={network}
            decryptPermission={decryptPermission}
            programs={programs}
            autoConnect={autoConnect}
        >
            <WalletModalProvider>
                {children}
            </WalletModalProvider>
        </WalletProvider>
    );
}

/**
 * Network Configuration
 * 
 * Helper to get network configuration based on environment
 */
export function getAleoNetwork(): WalletAdapterNetwork {
    const envNetwork = process.env.NEXT_PUBLIC_ALEO_NETWORK;

    if (envNetwork === 'mainnet') {
        return WalletAdapterNetwork.Mainnet;
    } else if (envNetwork === 'testnet') {
        return WalletAdapterNetwork.Testnet;
    }

    // Default to TestnetBeta (most commonly used for development)
    return WalletAdapterNetwork.TestnetBeta;
}

/**
 * RPC URL Configuration
 * 
 * Get RPC URL based on network
 */
export function getAleoRpcUrl(): string {
    // Use environment variable if available
    if (process.env.NEXT_PUBLIC_ALEO_RPC) {
        return process.env.NEXT_PUBLIC_ALEO_RPC;
    }

    // Default RPC endpoints based on network
    const network = getAleoNetwork();

    switch (network) {
        case WalletAdapterNetwork.Mainnet:
            return 'https://api.explorer.aleo.org/v1';
        case WalletAdapterNetwork.Testnet:
            return 'https://api.explorer.provable.com/v1';
        case WalletAdapterNetwork.TestnetBeta:
        default:
            return 'https://api.explorer.provable.com/v1';
    }
}

/**
 * Explorer URL Configuration
 * 
 * Get block explorer URL based on network
 */
export function getAleoExplorerUrl(): string {
    const network = getAleoNetwork();

    switch (network) {
        case WalletAdapterNetwork.Mainnet:
            return 'https://explorer.aleo.org';
        case WalletAdapterNetwork.Testnet:
        case WalletAdapterNetwork.TestnetBeta:
        default:
            return 'https://explorer.provable.com';
    }
}
