/**
 * On-Chain Submission Service
 * 
 * Handles submission of credit score proofs to the Aleo blockchain
 * Uses Puzzle Wallet for transaction signing and submission
 * 
 * @module lib/services/OnChainService
 */

import type { CreditAssessment } from '@/types/sdk';
import type { ProofResult } from '@/lib/zk/ProofGenerator';

/**
 * Transaction status
 */
export type TransactionStatus = 'pending' | 'confirming' | 'confirmed' | 'failed';

/**
 * Submission result
 */
export interface SubmissionResult {
    success: boolean;
    transactionId?: string;
    status: TransactionStatus;
    blockHeight?: number;
    timestamp: number;
    error?: string;
}

/**
 * Transaction details
 */
export interface TransactionDetails {
    id: string;
    status: TransactionStatus;
    blockHeight?: number;
    confirmations: number;
    timestamp: number;
    explorerUrl: string;
}

/**
 * Submission progress
 */
export interface SubmissionProgress {
    stage: 'preparing' | 'signing' | 'broadcasting' | 'confirming' | 'complete' | 'error';
    message: string;
    progress: number; // 0-100
    transactionId?: string;
}

/**
 * On-Chain Service Class
 * 
 * Manages all blockchain interactions for credit score proofs
 */
export class OnChainService {
    private static instance: OnChainService;
    private readonly explorerBaseUrl: string;
    private readonly confirmationsRequired: number = 1;

    private constructor() {
        // Use environment variable or default to testnet
        this.explorerBaseUrl = process.env.NEXT_PUBLIC_ALEO_EXPLORER_URL ||
            'https://explorer.aleo.org/testnet3';
    }

    /**
     * Get singleton instance
     */
    static getInstance(): OnChainService {
        if (!OnChainService.instance) {
            OnChainService.instance = new OnChainService();
        }
        return OnChainService.instance;
    }

    /**
     * Submit a credit score proof to the blockchain
     * 
     * @param assessment - Credit assessment
     * @param proof - Generated ZK proof
     * @param walletAddress - User's wallet address
     * @param onProgress - Progress callback
     * @returns Submission result
     */
    async submitProof(
        assessment: CreditAssessment,
        proof: ProofResult,
        walletAddress: string,
        onProgress?: (progress: SubmissionProgress) => void
    ): Promise<SubmissionResult> {
        try {
            // Stage 1: Prepare transaction
            this.updateProgress(onProgress, {
                stage: 'preparing',
                message: 'Preparing transaction data...',
                progress: 10,
            });

            await this.delay(500);

            const txData = this.prepareTransactionData(assessment, proof, walletAddress);

            // Stage 2: Sign transaction with Puzzle Wallet
            this.updateProgress(onProgress, {
                stage: 'signing',
                message: 'Waiting for wallet signature...',
                progress: 30,
            });

            await this.delay(800);

            // In production, this would use Puzzle Wallet SDK to sign
            const signedTx = await this.signTransaction(txData, walletAddress);

            // Stage 3: Broadcast to network
            this.updateProgress(onProgress, {
                stage: 'broadcasting',
                message: 'Broadcasting to Aleo network...',
                progress: 60,
            });

            await this.delay(1000);

            const transactionId = await this.broadcastTransaction(signedTx);

            // Stage 4: Wait for confirmation
            this.updateProgress(onProgress, {
                stage: 'confirming',
                message: 'Waiting for confirmation...',
                progress: 80,
                transactionId,
            });

            await this.delay(1500);

            const confirmed = await this.waitForConfirmation(transactionId);

            // Stage 5: Complete
            this.updateProgress(onProgress, {
                stage: 'complete',
                message: 'Transaction confirmed!',
                progress: 100,
                transactionId,
            });

            return {
                success: true,
                transactionId,
                status: 'confirmed',
                timestamp: Date.now(),
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            this.updateProgress(onProgress, {
                stage: 'error',
                message: `Submission failed: ${errorMessage}`,
                progress: 0,
            });

            return {
                success: false,
                status: 'failed',
                timestamp: Date.now(),
                error: errorMessage,
            };
        }
    }

    /**
     * Get transaction details
     * 
     * @param transactionId - Transaction ID
     * @returns Transaction details
     */
    async getTransactionDetails(transactionId: string): Promise<TransactionDetails> {
        try {
            // In production, this would query the Aleo blockchain
            // For now, we simulate the response
            await this.delay(500);

            return {
                id: transactionId,
                status: 'confirmed',
                blockHeight: Math.floor(Math.random() * 1000000) + 1000000,
                confirmations: this.confirmationsRequired,
                timestamp: Date.now(),
                explorerUrl: this.getExplorerUrl(transactionId),
            };
        } catch (error) {
            throw new Error(`Failed to fetch transaction details: ${error}`);
        }
    }

    /**
     * Check if a transaction is confirmed
     * 
     * @param transactionId - Transaction ID
     * @returns True if confirmed
     */
    async isTransactionConfirmed(transactionId: string): Promise<boolean> {
        try {
            const details = await this.getTransactionDetails(transactionId);
            return details.status === 'confirmed' &&
                details.confirmations >= this.confirmationsRequired;
        } catch (error) {
            console.error('[OnChainService] Error checking confirmation:', error);
            return false;
        }
    }

    /**
     * Get explorer URL for a transaction
     * 
     * @param transactionId - Transaction ID
     * @returns Explorer URL
     */
    getExplorerUrl(transactionId: string): string {
        return `${this.explorerBaseUrl}/transaction/${transactionId}`;
    }

    /**
     * Prepare transaction data
     * 
     * In production, this would format data for Aleo program execution
     */
    private prepareTransactionData(
        assessment: CreditAssessment,
        proof: ProofResult,
        walletAddress: string
    ): any {
        return {
            program: 'credit_score.aleo',
            function: 'submit_score',
            inputs: [
                walletAddress,
                assessment.finalScore.toString(),
                proof.scoreCommitment,
                proof.proof,
                JSON.stringify(proof.publicInputs),
            ],
            fee: 1000000, // 1 credit (in microcredits)
        };
    }

    /**
     * Sign transaction with Puzzle Wallet
     * 
     * In production, this would use Puzzle Wallet SDK
     */
    private async signTransaction(txData: any, walletAddress: string): Promise<any> {
        // Simulate signing delay
        await this.delay(1000);

        // In production, this would call:
        // const { signature } = await puzzleWallet.signTransaction(txData);

        return {
            ...txData,
            signature: this.generateMockSignature(walletAddress),
            timestamp: Date.now(),
        };
    }

    /**
     * Broadcast transaction to Aleo network
     * 
     * In production, this would submit to Aleo RPC
     */
    private async broadcastTransaction(signedTx: any): Promise<string> {
        // Simulate network delay
        await this.delay(1000);

        // In production, this would call:
        // const { transactionId } = await aleoRPC.broadcastTransaction(signedTx);

        // Generate mock transaction ID
        const txId = this.generateMockTransactionId();

        console.log('[OnChainService] Transaction broadcasted:', txId);

        return txId;
    }

    /**
     * Wait for transaction confirmation
     * 
     * In production, this would poll the blockchain
     */
    private async waitForConfirmation(transactionId: string): Promise<boolean> {
        // Simulate confirmation delay
        await this.delay(2000);

        // In production, this would:
        // 1. Poll the blockchain for transaction status
        // 2. Wait for required confirmations
        // 3. Return true when confirmed

        console.log('[OnChainService] Transaction confirmed:', transactionId);

        return true;
    }

    /**
     * Generate mock transaction ID
     */
    private generateMockTransactionId(): string {
        const prefix = 'at1';
        const randomPart = Array.from({ length: 60 }, () =>
            '0123456789abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 36)]
        ).join('');

        return prefix + randomPart;
    }

    /**
     * Generate mock signature
     */
    private generateMockSignature(address: string): string {
        return `sign1${address.substring(5, 15)}${Date.now().toString(36)}`;
    }

    /**
     * Update progress callback
     */
    private updateProgress(
        callback: ((progress: SubmissionProgress) => void) | undefined,
        progress: SubmissionProgress
    ): void {
        if (callback) {
            callback(progress);
        }
    }

    /**
     * Delay helper
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Estimate submission time
     * 
     * @returns Estimated time in milliseconds
     */
    estimateSubmissionTime(): number {
        // In production, this would consider:
        // - Network congestion
        // - Gas price
        // - Transaction complexity

        return 5000; // 5 seconds for mock
    }

    /**
     * Estimate transaction fee
     * 
     * @returns Fee in microcredits
     */
    estimateFee(): number {
        // In production, this would query current gas prices
        return 1000000; // 1 credit
    }

    /**
     * Format fee for display
     * 
     * @param microcredits - Fee in microcredits
     * @returns Formatted fee string
     */
    formatFee(microcredits: number): string {
        const credits = microcredits / 1000000;
        return `${credits.toFixed(6)} credits`;
    }
}

// Export singleton instance
export const onChainService = OnChainService.getInstance();
