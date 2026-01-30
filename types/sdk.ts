/**
 * ProofScore SDK Type Definitions
 * Production-grade types for credit scoring platform
 */

// ============================================================================
// WALLET METRICS
// ============================================================================

export interface Transaction {
    id: string;
    type: 'transfer' | 'execution' | 'fee';
    amount: number;
    timestamp: number;
}

export interface WalletMetrics {
    address: string;
    transactionCount: number;
    walletAgeMonths: number;
    defiScore: number; // 0-100
    repaymentRate: number; // 0-100 percentage
    tokenBalance: number;
    lastTransactionDate: number; // Unix timestamp
}

// ============================================================================
// CREDIT ASSESSMENT
// ============================================================================

export type RiskLevel = 'low' | 'medium' | 'high';

export interface CreditAssessment {
    address: string;
    metrics: WalletMetrics;
    baseScore: number;
    bonusPoints: number;
    finalScore: number; // 300-850
    riskLevel: RiskLevel;
    timestamp: number;
}

// ============================================================================
// ZERO-KNOWLEDGE PROOF
// ============================================================================

export interface ZKProof {
    proofHash: string;
    publicInputs: string[];
    proof: {
        a: string[];
        b: string[][];
        c: string[];
    };
}

// ============================================================================
// CREDIT ISSUANCE
// ============================================================================

export interface CreditIssuanceResult {
    success: boolean;
    transactionId: string;
    creditRecord?: CreditRecord;
    error?: string;
}

export interface CreditRecord {
    owner: string;
    score: number;
    threshold: number;
    issuedBlock: number;
    issuedAt: number; // Unix timestamp
}

// ============================================================================
// SDK CONFIGURATION
// ============================================================================

export interface SDKConfig {
    rpcUrl: string;
    indexerUrl?: string;
    contractAddress: string;
    chainId: 'mainnet' | 'testnet';
    enableCache?: boolean;
    cacheTTL?: number;
}

// ============================================================================
// RPC TYPES
// ============================================================================

export interface AleoTransaction {
    id: string;
    status: 'pending' | 'confirmed' | 'failed';
    blockHeight?: number;
    timestamp?: number;
}

export interface AleoAccount {
    address: string;
    balance: number;
    transactionCount: number;
    firstSeen: number;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class SDKError extends Error {
    constructor(
        message: string,
        public code: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'SDKError';
    }
}

export class RPCError extends SDKError {
    constructor(message: string, details?: unknown) {
        super(message, 'RPC_ERROR', details);
        this.name = 'RPCError';
    }
}

export class ProofGenerationError extends SDKError {
    constructor(message: string, details?: unknown) {
        super(message, 'PROOF_GENERATION_ERROR', details);
        this.name = 'ProofGenerationError';
    }
}

export class TransactionError extends SDKError {
    constructor(message: string, details?: unknown) {
        super(message, 'TRANSACTION_ERROR', details);
        this.name = 'TransactionError';
    }
}
