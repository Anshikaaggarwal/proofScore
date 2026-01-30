/**
 * Aleo Data Service
 * 
 * Fetches blockchain data from Aleo network
 * Provides wallet metrics, transaction history, and on-chain data
 * 
 * @module lib/services/AleoDataService
 */

import { Network } from '@puzzlehq/types';

// Aleo Explorer API endpoints
const EXPLORER_ENDPOINTS = {
    [Network.AleoTestnet]: 'https://api.explorer.provable.com/v1',
    [Network.AleoMainnet]: 'https://api.explorer.aleo.org/v1',
};

export interface AleoTransaction {
    id: string;
    type: string;
    status: string;
    timestamp: number;
    height: number;
    fee: number;
    program?: string;
    function?: string;
}

export interface WalletBalance {
    public: number;
    private: number;
    total: number;
}

export interface WalletMetricsRaw {
    address: string;
    transactionCount: number;
    walletAgeMonths: number;
    balance: WalletBalance;
    lastTransactionDate: number;
    defiInteractions: number;
    uniquePrograms: string[];
}

/**
 * Aleo Data Service Class
 * 
 * Handles all blockchain data fetching operations
 */
export class AleoDataService {
    private network: Network;
    private baseUrl: string;

    constructor(network: Network = Network.AleoTestnet) {
        this.network = network;
        this.baseUrl = EXPLORER_ENDPOINTS[network];
    }

    /**
     * Fetch wallet transactions from Aleo blockchain
     * 
     * @param address - Aleo wallet address
     * @param limit - Maximum number of transactions to fetch
     * @returns Array of transactions
     */
    async getWalletTransactions(
        address: string,
        limit: number = 100
    ): Promise<AleoTransaction[]> {
        try {
            // Note: This is a placeholder implementation
            // Real implementation would call Aleo Explorer API
            console.log(`[AleoDataService] Fetching transactions for ${address}`);

            // For now, return mock data
            // TODO: Replace with actual API call when Aleo Explorer API is available
            const mockTransactions: AleoTransaction[] = this.generateMockTransactions(address);

            return mockTransactions.slice(0, limit);
        } catch (error) {
            console.error('[AleoDataService] Error fetching transactions:', error);
            throw new Error('Failed to fetch wallet transactions');
        }
    }

    /**
     * Get wallet balance (public + private)
     * 
     * @param address - Aleo wallet address
     * @returns Wallet balance in microcredits
     */
    async getWalletBalance(address: string): Promise<WalletBalance> {
        try {
            console.log(`[AleoDataService] Fetching balance for ${address}`);

            // TODO: Replace with actual API call
            // For now, return mock balance
            return {
                public: Math.floor(Math.random() * 100000),
                private: Math.floor(Math.random() * 50000),
                total: 0, // Will be calculated
            };
        } catch (error) {
            console.error('[AleoDataService] Error fetching balance:', error);
            throw new Error('Failed to fetch wallet balance');
        }
    }

    /**
     * Calculate wallet age in months
     * 
     * @param address - Aleo wallet address
     * @returns Wallet age in months
     */
    async getWalletAge(address: string): Promise<number> {
        try {
            console.log(`[AleoDataService] Calculating wallet age for ${address}`);

            const transactions = await this.getWalletTransactions(address);

            if (transactions.length === 0) {
                return 0;
            }

            // Find oldest transaction
            const oldestTransaction = transactions.reduce((oldest, tx) => {
                return tx.timestamp < oldest.timestamp ? tx : oldest;
            }, transactions[0]);

            // Calculate age in months
            const ageMs = Date.now() - oldestTransaction.timestamp;
            const ageMonths = Math.floor(ageMs / (1000 * 60 * 60 * 24 * 30));

            return Math.max(0, ageMonths);
        } catch (error) {
            console.error('[AleoDataService] Error calculating wallet age:', error);
            return 0;
        }
    }

    /**
     * Calculate DeFi activity score
     * 
     * @param address - Aleo wallet address
     * @returns DeFi score (0-100)
     */
    async calculateDefiScore(address: string): Promise<number> {
        try {
            console.log(`[AleoDataService] Calculating DeFi score for ${address}`);

            const transactions = await this.getWalletTransactions(address);

            // Count DeFi-related transactions
            const defiPrograms = ['credits.aleo', 'token.aleo', 'swap.aleo', 'lending.aleo'];
            const defiTransactions = transactions.filter(tx =>
                tx.program && defiPrograms.some(program => tx.program?.includes(program))
            );

            // Calculate score based on DeFi activity
            const defiRatio = transactions.length > 0
                ? defiTransactions.length / transactions.length
                : 0;

            const uniquePrograms = new Set(
                defiTransactions.map(tx => tx.program).filter(Boolean)
            ).size;

            // Score formula: 50% transaction ratio + 50% program diversity
            const score = Math.min(100, Math.floor(
                (defiRatio * 50) + (uniquePrograms * 10)
            ));

            return score;
        } catch (error) {
            console.error('[AleoDataService] Error calculating DeFi score:', error);
            return 0;
        }
    }

    /**
     * Get comprehensive wallet metrics
     * 
     * @param address - Aleo wallet address
     * @returns Complete wallet metrics
     */
    async getWalletMetrics(address: string): Promise<WalletMetricsRaw> {
        try {
            console.log(`[AleoDataService] Fetching comprehensive metrics for ${address}`);

            // Fetch all data in parallel
            const [transactions, balance, walletAge, defiScore] = await Promise.all([
                this.getWalletTransactions(address),
                this.getWalletBalance(address),
                this.getWalletAge(address),
                this.calculateDefiScore(address),
            ]);

            // Calculate total balance
            balance.total = balance.public + balance.private;

            // Get unique programs
            const uniquePrograms = Array.from(
                new Set(transactions.map(tx => tx.program).filter(Boolean) as string[])
            );

            // Get last transaction date
            const lastTransaction = transactions.length > 0
                ? transactions[0].timestamp
                : Date.now();

            // Count DeFi interactions
            const defiPrograms = ['credits.aleo', 'token.aleo', 'swap.aleo', 'lending.aleo'];
            const defiInteractions = transactions.filter(tx =>
                tx.program && defiPrograms.some(program => tx.program?.includes(program))
            ).length;

            return {
                address,
                transactionCount: transactions.length,
                walletAgeMonths: walletAge,
                balance,
                lastTransactionDate: lastTransaction,
                defiInteractions,
                uniquePrograms,
            };
        } catch (error) {
            console.error('[AleoDataService] Error fetching wallet metrics:', error);
            throw new Error('Failed to fetch wallet metrics');
        }
    }

    /**
     * Generate mock transactions for testing
     * TODO: Remove when real API is available
     */
    private generateMockTransactions(address: string): AleoTransaction[] {
        const programs = ['credits.aleo', 'token.aleo', 'swap.aleo', 'lending.aleo', 'nft.aleo'];
        const functions = ['transfer_public', 'transfer_private', 'mint', 'burn', 'swap'];

        const transactions: AleoTransaction[] = [];
        const count = Math.floor(Math.random() * 150) + 50; // 50-200 transactions

        for (let i = 0; i < count; i++) {
            const daysAgo = Math.floor(Math.random() * 365); // Up to 1 year old
            const timestamp = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);

            transactions.push({
                id: `at1${Math.random().toString(36).substring(2, 15)}`,
                type: 'execute',
                status: 'accepted',
                timestamp,
                height: 1000000 - (daysAgo * 100),
                fee: Math.floor(Math.random() * 10000),
                program: programs[Math.floor(Math.random() * programs.length)],
                function: functions[Math.floor(Math.random() * functions.length)],
            });
        }

        // Sort by timestamp (newest first)
        return transactions.sort((a, b) => b.timestamp - a.timestamp);
    }

    /**
     * Switch network
     */
    setNetwork(network: Network) {
        this.network = network;
        this.baseUrl = EXPLORER_ENDPOINTS[network];
    }

    /**
     * Get current network
     */
    getNetwork(): Network {
        return this.network;
    }
}

// Export singleton instance
export const aleoDataService = new AleoDataService();
