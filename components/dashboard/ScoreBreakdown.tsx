'use client';

import { motion } from 'framer-motion';
import type { CreditAssessment } from '@/types/sdk';
import { ScoringEngine } from '@/lib/sdk';

interface ScoreBreakdownProps {
    assessment: CreditAssessment;
}

export function ScoreBreakdown({ assessment }: ScoreBreakdownProps) {
    const breakdown = ScoringEngine.getScoreBreakdown(assessment);

    // Helper to get color classes
    const getColorClasses = (color: string) => {
        const colorMap = {
            'neon-cyan': {
                text: 'text-neon-cyan',
                gradient: 'from-neon-cyan to-neon-cyan/50',
                bg: 'bg-neon-cyan',
            },
            'neon-green': {
                text: 'text-neon-green',
                gradient: 'from-neon-green to-neon-green/50',
                bg: 'bg-neon-green',
            },
            'electric-purple': {
                text: 'text-electric-purple',
                gradient: 'from-electric-purple to-electric-purple/50',
                bg: 'bg-electric-purple',
            },
            'neon-yellow': {
                text: 'text-neon-yellow',
                gradient: 'from-neon-yellow to-neon-yellow/50',
                bg: 'bg-neon-yellow',
            },
        };
        return colorMap[color as keyof typeof colorMap] || colorMap['neon-cyan'];
    };

    const bonusItems = breakdown.factors.map(factor => ({
        label: factor.name,
        value: factor.contribution,
        max: 100, // All factors are on 0-100 scale
        color: factor.rating === 'excellent' ? 'neon-green' :
            factor.rating === 'good' ? 'neon-cyan' :
                factor.rating === 'fair' ? 'electric-purple' :
                    'neon-yellow',
        description: `${factor.score}/100 score (${factor.weight}% weight)`,
    }));

    return (
        <div className="glass-card p-8">
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-pure-white mb-2">
                    Score Breakdown
                </h3>
                <p className="text-text-secondary">
                    How your {assessment.finalScore} score is calculated
                </p>
            </div>

            {/* Base Score */}
            <div className="mb-8 pb-8 border-b border-glass-border">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <div className="text-lg font-semibold text-pure-white">
                            Base Score
                        </div>
                        <div className="text-sm text-text-muted">
                            Starting point for all users
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-text-secondary">
                        {breakdown.base}
                    </div>
                </div>
            </div>

            {/* Bonus Breakdown */}
            <div className="space-y-6">
                {bonusItems.map((item, index) => {
                    const percentage = (item.value / item.max) * 100;
                    const colors = getColorClasses(item.color);

                    return (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.1,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                        >
                            {/* Label and Value */}
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <div className="text-sm font-medium text-pure-white">
                                        {item.label}
                                    </div>
                                    <div className="text-xs text-text-muted">
                                        {item.description}
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-2xl font-bold ${colors.text}`}>
                                        +{item.value}
                                    </span>
                                    <span className="text-sm text-text-muted">/ {item.max}</span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative h-3 bg-charcoal rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{
                                        duration: 1.5,
                                        delay: index * 0.1 + 0.3,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full relative`}
                                >
                                    {/* Glow effect */}
                                    <div
                                        className={`absolute inset-0 ${colors.bg} opacity-50 blur-sm`}
                                    />
                                </motion.div>

                                {/* Percentage Label */}
                                <div className="absolute inset-0 flex items-center justify-end pr-3">
                                    <span className="text-xs font-medium text-pure-white/80">
                                        {percentage.toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Total Score */}
            <div className="mt-8 pt-8 border-t border-glass-border">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-lg font-semibold text-pure-white">
                            Final Score
                        </div>
                        <div className="text-sm text-text-muted">
                            Base + All Bonuses
                        </div>
                    </div>
                    <div className="text-4xl font-bold gradient-text">
                        {breakdown.total}
                    </div>
                </div>

                {/* Max Possible */}
                <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-text-muted">Maximum Possible Score</span>
                    <span className="font-medium text-text-secondary">
                        {breakdown.maxPossible}
                    </span>
                </div>

                {/* Progress to Max */}
                <div className="mt-3 h-2 bg-charcoal rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{
                            width: `${(breakdown.total / breakdown.maxPossible) * 100}%`,
                        }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-neon-cyan via-neon-green to-electric-purple rounded-full"
                    />
                </div>
            </div>
        </div>
    );
}
