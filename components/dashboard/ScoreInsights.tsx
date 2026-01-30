'use client';

/**
 * Score Insights Component
 * 
 * Displays detailed factor analysis and improvement suggestions
 * for the user's credit score
 */

import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { ScoringEngine } from '@/lib/sdk';
import type { CreditAssessment } from '@/types/sdk';

interface ScoreInsightsProps {
    assessment: CreditAssessment;
}

export function ScoreInsights({ assessment }: ScoreInsightsProps) {
    const factorAnalysis = ScoringEngine.getFactorAnalysis(assessment);
    const improvements = ScoringEngine.getImprovementSuggestions(assessment);
    const percentile = ScoringEngine.getScorePercentile(assessment.finalScore);

    return (
        <div className="space-y-6">
            {/* Percentile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-pure-white">Your Ranking</h3>
                    <Info className="w-5 h-5 text-text-muted" />
                </div>
                <div className="text-center">
                    <div className="text-5xl font-bold gradient-text mb-2">
                        {percentile}th
                    </div>
                    <div className="text-text-secondary">
                        Percentile - Better than {percentile}% of users
                    </div>
                </div>
            </motion.div>

            {/* Factor Analysis */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
            >
                <h3 className="text-xl font-bold text-pure-white mb-6">Score Factors</h3>
                <div className="space-y-4">
                    {factorAnalysis.map((factor, index) => (
                        <div key={factor.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-pure-white">
                                        {factor.name}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${factor.rating === 'excellent' ? 'bg-neon-green/20 text-neon-green' :
                                            factor.rating === 'good' ? 'bg-neon-cyan/20 text-neon-cyan' :
                                                factor.rating === 'fair' ? 'bg-electric-purple/20 text-electric-purple' :
                                                    'bg-hot-pink/20 text-hot-pink'
                                        }`}>
                                        {factor.rating}
                                    </span>
                                </div>
                                <div className="text-sm text-text-secondary">
                                    {factor.score}/100 ({Math.round(factor.weight * 100)}% weight)
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-glass-border rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${factor.score}%` }}
                                        transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                                        className={`h-full ${factor.rating === 'excellent' ? 'bg-gradient-to-r from-neon-green to-neon-cyan' :
                                                factor.rating === 'good' ? 'bg-gradient-to-r from-neon-cyan to-electric-purple' :
                                                    factor.rating === 'fair' ? 'bg-gradient-to-r from-electric-purple to-hot-pink' :
                                                        'bg-hot-pink'
                                            }`}
                                    />
                                </div>
                                <span className="text-xs text-text-muted w-16 text-right">
                                    +{Math.round(factor.contribution * 5.5)} pts
                                </span>
                            </div>
                            <div className="text-xs text-text-muted">
                                {factor.description}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Improvement Suggestions */}
            {improvements.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-neon-cyan" />
                        <h3 className="text-xl font-bold text-pure-white">
                            Improvement Opportunities
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {improvements.map((improvement, index) => (
                            <motion.div
                                key={improvement.factor}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className={`p-4 rounded-xl border ${improvement.priority === 'high' ? 'border-hot-pink/30 bg-hot-pink/5' :
                                        improvement.priority === 'medium' ? 'border-electric-purple/30 bg-electric-purple/5' :
                                            'border-neon-cyan/30 bg-neon-cyan/5'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    {improvement.priority === 'high' ? (
                                        <AlertCircle className="w-5 h-5 text-hot-pink flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <CheckCircle className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-pure-white">
                                                {improvement.factor}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${improvement.priority === 'high' ? 'bg-hot-pink/20 text-hot-pink' :
                                                    improvement.priority === 'medium' ? 'bg-electric-purple/20 text-electric-purple' :
                                                        'bg-neon-cyan/20 text-neon-cyan'
                                                }`}>
                                                {improvement.priority} priority
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-secondary mb-2">
                                            {improvement.suggestion}
                                        </p>
                                        <div className="text-xs text-neon-cyan">
                                            Potential gain: +{improvement.potentialGain} points
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* All Factors Excellent */}
            {improvements.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 text-center"
                >
                    <CheckCircle className="w-12 h-12 text-neon-green mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-pure-white mb-2">
                        Excellent Credit Profile!
                    </h3>
                    <p className="text-text-secondary">
                        All your credit factors are performing well. Keep up the good work!
                    </p>
                </motion.div>
            )}
        </div>
    );
}
