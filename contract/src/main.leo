program credit_score.aleo {
    // Record to store the credit score
    // The owner field ensures only the user can spend/update this record initially
    record CreditRecord {
        owner: address,
        score: u64,
        timestamp: u64,
    }

    // Mapping to store public scores (optional, for public verification)
    // address -> score
    mapping public_scores: address => u64;

    // Transition to generate a new credit score
    // Inputs are the raw metrics (private)
    // Output is a CreditRecord (private) containing the calculated score
    transition generate_score(
        private tx_count: u64,
        private wallet_age: u64,
        private defi_score: u64,
        private repayment_rate: u64,
        private balance_tier: u64
    ) -> CreditRecord {
        
        // ---------------------------------------------------------
        // 1. Normalize Inputs to 0-100 scales
        // ---------------------------------------------------------
        
        // Transaction Score (Max 100)
        // Simple logic: 200+ txs = 100, else linear scaling
        let tx_score: u64 = tx_count >= 200u64 ? 100u64 : (tx_count * 100u64) / 200u64;
        
        // Age Score (Max 100)
        // 24 months = 100, else linear scaling
        let age_score: u64 = wallet_age >= 24u64 ? 100u64 : (wallet_age * 100u64) / 24u64;
        
        // DeFi Score is already 0-100 input
        let defi_val: u64 = defi_score > 100u64 ? 100u64 : defi_score;

        // Repayment Rate is already 0-100 input
        let repay_val: u64 = repayment_rate > 100u64 ? 100u64 : repayment_rate;

        // Balance Tier (0-100 input based on offline calculation of balance tiers)
        let balance_val: u64 = balance_tier > 100u64 ? 100u64 : balance_tier;

        // ---------------------------------------------------------
        // 2. Calculate Weighted Sum
        // ---------------------------------------------------------
        // Weights:
        // Tx History: 25%
        // Age: 20%
        // DeFi: 20%
        // Repayment: 25%
        // Balance: 10%
        // Total: 100%
        
        let weighted_sum: u64 = 
            (tx_score * 25u64) + 
            (age_score * 20u64) + 
            (defi_val * 20u64) + 
            (repay_val * 25u64) + 
            (balance_val * 10u64);
            
        // weighted_sum is now scaled by 100 (e.g. max is 100 * 100 = 10000)
        // We divide by 100 to get back to 0-100 scale
        let normalized_score: u64 = weighted_sum / 100u64;

        // ---------------------------------------------------------
        // 3. Final Score Calculation (300 - 850 range)
        // ---------------------------------------------------------
        // Formula: 300 + (NormalizedScore * 550 / 100)
        
        let bonus_points: u64 = (normalized_score * 550u64) / 100u64;
        let final_score: u64 = 300u64 + bonus_points;

        // Cap at 850 just in case
        if (final_score > 850u64) {
            final_score = 850u64;
        }

        // Return the credit record
        return CreditRecord {
            owner: self.caller,
            score: final_score,
            timestamp: 0u64 // In real app, pass block height or oracle timestamp
        };
    }

    // Transition to publish the score publicly (optional)
    transition publish_score(private record: CreditRecord) {
        // Consumes the private record and writes to public mapping
        return then finalize(self.caller, record.score);
    }

    finalize publish_score(owner: address, score: u64) {
        Mapping::set(public_scores, owner, score);
    }
}
