/**
 * Enhanced ScoringEngine - Advanced Credit Score Calculation
 * 
 * Sophisticated scoring algorithm with:
 * - Weighted factor analysis
 * - Historical trend consideration
 * - Risk assessment improvements
 * - Score validation and bounds checking
 * - Detailed factor breakdown
 * 
 * @module lib/sdk/ScoringEngine
 * @version 2.0.0
 */

import { SCORING_CONFIG } from '@/lib/constants';
import type { WalletMetrics, CreditAssessment, RiskLevel } from '@/types/sdk';

/**
 * Factor weights for score calculation
 * Total weight = 100%
 */
const FACTOR_WEIGHTS = {
    TRANSACTION_HISTORY: 0.25,  // 25% - Transaction count and consistency
    WALLET_AGE: 0.20,            // 20% - Account maturity
    DEFI_ACTIVITY: 0.20,         // 20% - DeFi engagement
    REPAYMENT_BEHAVIOR: 0.25,    // 25% - Payment reliability
    BALANCE_STABILITY: 0.10,     // 10% - Financial stability
} as const;

/**
 * Score improvement suggestions based on weak factors
 */
interface ScoreImprovement {
    factor: string;
    currentScore: number;
    potentialGain: number;
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
}

/**
 * Detailed factor analysis
 */
interface FactorAnalysis {
    name: string;
    score: number;
    weight: number;
    contribution: number;
    rating: 'excellent' | 'good' | 'fair' | 'poor';
    description: string;
}

export class ScoringEngine {
    /**
     * Enhanced scoring algorithm with weighted factors
     * 
     * @param metrics - On-chain wallet metrics
     * @returns Comprehensive credit assessment
     */
    static calculateScore(metrics: WalletMetrics): CreditAssessment {
        // Validate input metrics
        this.validateMetrics(metrics);

        const baseScore = SCORING_CONFIG.BASE_SCORE;

        // Calculate individual factor scores (0-100 scale)
        const transactionScore = this.calculateTransactionScore(metrics);
        const ageScore = this.calculateAgeScore(metrics);
        const defiScore = this.calculateDeFiScore(metrics);
        const repaymentScore = this.calculateRepaymentScore(metrics);
        const balanceScore = this.calculateBalanceScore(metrics);

        // Apply weights and calculate weighted bonus (0-100 scale)
        const weightedSum =
            (transactionScore * (FACTOR_WEIGHTS.TRANSACTION_HISTORY * 100)) +
            (ageScore * (FACTOR_WEIGHTS.WALLET_AGE * 100)) +
            (defiScore * (FACTOR_WEIGHTS.DEFI_ACTIVITY * 100)) +
            (repaymentScore * (FACTOR_WEIGHTS.REPAYMENT_BEHAVIOR * 100)) +
            (balanceScore * (FACTOR_WEIGHTS.BALANCE_STABILITY * 100));

        // Normalize weighted sum back to 0-100 (divided by 100 because weights were scaled up)
        const normalizedScore = weightedSum / 100;

        // Convert key performance indicators to credit score points (max 550 points)
        // Formula: Base (300) + (NormalizedScore% of 550)
        const bonusPoints = Math.round((normalizedScore / 100) * 550);

        // Calculate final score (300-850 range)
        const rawScore = baseScore + bonusPoints;
        const finalScore = Math.max(
            SCORING_CONFIG.MIN_SCORE,
            Math.min(SCORING_CONFIG.MAX_SCORE, Math.round(rawScore))
        );

        // Determine risk level
        const riskLevel = this.getRiskLevel(finalScore);

        return {
            address: metrics.address,
            metrics,
            baseScore,
            bonusPoints,
            finalScore,
            riskLevel,
            timestamp: Date.now(),
        };
    }

    /**
     * Calculate transaction history score (0-100)
     * 
     * Considers:
     * - Total transaction count
     * - Transaction consistency
     * - Recent activity
     */
    private static calculateTransactionScore(metrics: WalletMetrics): number {
        const { transactionCount, lastTransactionDate } = metrics;

        // Base score from transaction count
        let score = 0;
        if (transactionCount >= 200) score = 100;
        else if (transactionCount >= 100) score = 85;
        else if (transactionCount >= 50) score = 70;
        else if (transactionCount >= 25) score = 55;
        else if (transactionCount >= 10) score = 40;
        else if (transactionCount >= 5) score = 25;
        else score = transactionCount * 5; // 5 points per tx for < 5 txs

        // Bonus for recent activity (within last 30 days)
        const daysSinceLastTx = (Date.now() - lastTransactionDate) / (1000 * 60 * 60 * 24);
        if (daysSinceLastTx <= 7) score += 10;
        else if (daysSinceLastTx <= 30) score += 5;

        // Penalty for inactivity (> 90 days)
        if (daysSinceLastTx > 90) score -= 15;
        if (daysSinceLastTx > 180) score -= 25;

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Calculate wallet age score (0-100)
     * 
     * Older wallets are more trustworthy
     */
    private static calculateAgeScore(metrics: WalletMetrics): number {
        const { walletAgeMonths } = metrics;

        let score = 0;
        if (walletAgeMonths >= 24) score = 100;      // 2+ years
        else if (walletAgeMonths >= 18) score = 90;  // 1.5+ years
        else if (walletAgeMonths >= 12) score = 80;  // 1+ year
        else if (walletAgeMonths >= 6) score = 60;   // 6+ months
        else if (walletAgeMonths >= 3) score = 40;   // 3+ months
        else if (walletAgeMonths >= 1) score = 20;   // 1+ month
        else score = walletAgeMonths * 20;           // < 1 month

        return Math.min(100, score);
    }

    /**
     * Calculate DeFi activity score (0-100)
     * 
     * Already provided by metrics, but we can enhance it
     */
    private static calculateDeFiScore(metrics: WalletMetrics): number {
        const { defiScore } = metrics;

        // Apply non-linear scaling to reward high DeFi engagement
        if (defiScore >= 80) return 100;
        if (defiScore >= 60) return 85;
        if (defiScore >= 40) return 70;
        if (defiScore >= 20) return 50;
        return defiScore * 2; // Double the score for low values
    }

    /**
     * Calculate repayment behavior score (0-100)
     * 
     * Most important factor for creditworthiness
     */
    private static calculateRepaymentScore(metrics: WalletMetrics): number {
        const { repaymentRate } = metrics;

        // Repayment rate is critical - use exponential scaling
        if (repaymentRate >= 95) return 100;
        if (repaymentRate >= 90) return 95;
        if (repaymentRate >= 85) return 90;
        if (repaymentRate >= 80) return 85;
        if (repaymentRate >= 75) return 75;
        if (repaymentRate >= 70) return 65;
        if (repaymentRate >= 60) return 50;
        return repaymentRate * 0.7; // Harsh penalty for low repayment
    }

    /**
     * Calculate balance stability score (0-100)
     * 
     * Higher balance indicates financial stability
     */
    private static calculateBalanceScore(metrics: WalletMetrics): number {
        const { tokenBalance } = metrics;

        // Score based on balance tiers (in microcredits)
        let score = 0;
        if (tokenBalance >= 1000000) score = 100;      // 1M+ credits
        else if (tokenBalance >= 500000) score = 90;   // 500K+ credits
        else if (tokenBalance >= 100000) score = 80;   // 100K+ credits
        else if (tokenBalance >= 50000) score = 70;    // 50K+ credits
        else if (tokenBalance >= 10000) score = 60;    // 10K+ credits
        else if (tokenBalance >= 5000) score = 50;     // 5K+ credits
        else if (tokenBalance >= 1000) score = 40;     // 1K+ credits
        else score = tokenBalance / 25;                // < 1K credits

        return Math.min(100, score);
    }

    /**
     * Determine risk level from credit score
     * 
     * Enhanced with more granular levels
     */
    private static getRiskLevel(score: number): RiskLevel {
        if (score >= 750) return 'low';
        if (score >= 500) return 'medium';
        return 'high';
    }

    /**
     * Get detailed factor analysis
     * 
     * Shows how each factor contributes to the final score
     */
    static getFactorAnalysis(assessment: CreditAssessment): FactorAnalysis[] {
        const { metrics } = assessment;

        const transactionScore = this.calculateTransactionScore(metrics);
        const ageScore = this.calculateAgeScore(metrics);
        const defiScore = this.calculateDeFiScore(metrics);
        const repaymentScore = this.calculateRepaymentScore(metrics);
        const balanceScore = this.calculateBalanceScore(metrics);

        const factors: FactorAnalysis[] = [
            {
                name: 'Transaction History',
                score: transactionScore,
                weight: FACTOR_WEIGHTS.TRANSACTION_HISTORY,
                contribution: transactionScore * FACTOR_WEIGHTS.TRANSACTION_HISTORY,
                rating: this.getRating(transactionScore),
                description: `${metrics.transactionCount} transactions on record`,
            },
            {
                name: 'Wallet Age',
                score: ageScore,
                weight: FACTOR_WEIGHTS.WALLET_AGE,
                contribution: ageScore * FACTOR_WEIGHTS.WALLET_AGE,
                rating: this.getRating(ageScore),
                description: `${metrics.walletAgeMonths} months old`,
            },
            {
                name: 'DeFi Activity',
                score: defiScore,
                weight: FACTOR_WEIGHTS.DEFI_ACTIVITY,
                contribution: defiScore * FACTOR_WEIGHTS.DEFI_ACTIVITY,
                rating: this.getRating(defiScore),
                description: `${metrics.defiScore}% DeFi engagement`,
            },
            {
                name: 'Repayment Behavior',
                score: repaymentScore,
                weight: FACTOR_WEIGHTS.REPAYMENT_BEHAVIOR,
                contribution: repaymentScore * FACTOR_WEIGHTS.REPAYMENT_BEHAVIOR,
                rating: this.getRating(repaymentScore),
                description: `${metrics.repaymentRate}% repayment rate`,
            },
            {
                name: 'Balance Stability',
                score: balanceScore,
                weight: FACTOR_WEIGHTS.BALANCE_STABILITY,
                contribution: balanceScore * FACTOR_WEIGHTS.BALANCE_STABILITY,
                rating: this.getRating(balanceScore),
                description: `${metrics.tokenBalance.toLocaleString()} credits`,
            },
        ];

        return factors;
    }

    /**
     * Get score improvement suggestions
     * 
     * Analyzes weak factors and suggests improvements
     */
    static getImprovementSuggestions(assessment: CreditAssessment): ScoreImprovement[] {
        const factors = this.getFactorAnalysis(assessment);
        const suggestions: ScoreImprovement[] = [];

        factors.forEach(factor => {
            if (factor.score < 70) {
                const potentialGain = Math.round((100 - factor.score) * factor.weight * 5.5);

                let suggestion = '';
                let priority: 'high' | 'medium' | 'low' = 'low';

                switch (factor.name) {
                    case 'Transaction History':
                        suggestion = 'Increase your on-chain activity by making more transactions';
                        priority = factor.score < 40 ? 'high' : 'medium';
                        break;
                    case 'Wallet Age':
                        suggestion = 'Continue using your wallet consistently over time';
                        priority = 'low'; // Can't speed up time
                        break;
                    case 'DeFi Activity':
                        suggestion = 'Engage with DeFi protocols like lending, swapping, or staking';
                        priority = factor.score < 50 ? 'high' : 'medium';
                        break;
                    case 'Repayment Behavior':
                        suggestion = 'Maintain timely repayments and fulfill all obligations';
                        priority = 'high'; // Most important factor
                        break;
                    case 'Balance Stability':
                        suggestion = 'Maintain a higher balance to demonstrate financial stability';
                        priority = factor.score < 40 ? 'medium' : 'low';
                        break;
                }

                suggestions.push({
                    factor: factor.name,
                    currentScore: factor.score,
                    potentialGain,
                    suggestion,
                    priority,
                });
            }
        });

        // Sort by priority and potential gain
        return suggestions.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return b.potentialGain - a.potentialGain;
        });
    }

    /**
     * Get rating from score
     */
    private static getRating(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
        if (score >= 85) return 'excellent';
        if (score >= 70) return 'good';
        if (score >= 50) return 'fair';
        return 'poor';
    }

    /**
     * Validate wallet metrics
     */
    static validateMetrics(metrics: WalletMetrics): void {
        if (!metrics.address || !metrics.address.startsWith('aleo1')) {
            throw new Error('Invalid Aleo address format');
        }

        if (metrics.transactionCount < 0) {
            throw new Error('Transaction count cannot be negative');
        }

        if (metrics.walletAgeMonths < 0) {
            throw new Error('Wallet age cannot be negative');
        }

        if (metrics.defiScore < 0 || metrics.defiScore > 100) {
            throw new Error('DeFi score must be between 0 and 100');
        }

        if (metrics.repaymentRate < 0 || metrics.repaymentRate > 100) {
            throw new Error('Repayment rate must be between 0 and 100');
        }

        if (metrics.tokenBalance < 0) {
            throw new Error('Token balance cannot be negative');
        }
    }

    /**
     * Get score breakdown for UI display
     */
    static getScoreBreakdown(assessment: CreditAssessment) {
        const factors = this.getFactorAnalysis(assessment);

        return {
            base: SCORING_CONFIG.BASE_SCORE,
            factors: factors.map(f => ({
                name: f.name,
                score: f.score,
                weight: f.weight * 100, // Convert to percentage
                contribution: Math.round((f.score * f.weight * 550) / 100), // Precise contribution points
                rating: f.rating,
            })),
            total: assessment.finalScore,
            maxPossible: SCORING_CONFIG.MAX_SCORE,
        };
    }

    /**
     * Calculate score percentile
     * 
     * Estimates where this score ranks among all users
     * (Simplified - in production would use actual distribution data)
     */
    static getScorePercentile(score: number): number {
        // Simplified percentile calculation
        // Assumes normal distribution with mean=600, stddev=100
        const mean = 600;
        const stddev = 100;
        const z = (score - mean) / stddev;

        // Approximate percentile using error function
        const percentile = 50 * (1 + this.erf(z / Math.sqrt(2)));

        return Math.max(0, Math.min(100, Math.round(percentile)));
    }

    /**
     * Error function approximation for percentile calculation
     */
    private static erf(x: number): number {
        // Abramowitz and Stegun approximation
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;

        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x);

        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return sign * y;
    }
}
