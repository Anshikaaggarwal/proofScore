'use client';

/**
 * Client-side Providers Wrapper
 * 
 * This component wraps all client-side providers (Puzzle Wallet, Aleo Wallet, etc.)
 * It's separated from the root layout to allow the layout to remain a server component
 * 
 * @module lib/providers/ClientProviders
 */

import { PuzzleWalletProvider } from '@puzzlehq/sdk';
import { WalletProvider } from '@/lib/providers/WalletProvider';
import { AleoWalletProvider } from '@/lib/providers/AleoWalletProvider';
import type { ReactNode } from 'react';

interface ClientProvidersProps {
    children: ReactNode;
}

/**
 * Client Providers Component
 * 
 * Wraps the application with all necessary client-side providers
 * Order matters: PuzzleWalletProvider > AleoWalletProvider > WalletProvider
 */
export function ClientProviders({ children }: ClientProvidersProps) {
    return (
        <PuzzleWalletProvider>
            <AleoWalletProvider autoConnect>
                <WalletProvider>
                    {children}
                </WalletProvider>
            </AleoWalletProvider>
        </PuzzleWalletProvider>
    );
}
