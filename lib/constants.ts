/**
 * ProofScore Design System Constants
 * Production-grade color palette, typography, and configuration
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const COLORS = {
    // Dark theme (primary)
    background: '#0A0E27', // Deep space black
    surface: '#1A1E3F', // Elevated surface
    surfaceHover: '#252952', // Hover state
    surfaceActive: '#2F3460', // Active state

    // Primary colors (Aleo brand)
    primary: '#00D9FF', // Electric teal
    primaryHover: '#00C4E6', // Hover
    primaryActive: '#00AFCC', // Active
    primaryMuted: 'rgba(0, 217, 255, 0.1)', // 10% opacity

    // Accent colors
    success: '#00FF88', // Neon green
    warning: '#FFB800', // Amber
    error: '#FF4D6A', // Coral red
    info: '#7B61FF', // Purple

    // Text hierarchy
    textPrimary: '#FFFFFF', // Pure white
    textSecondary: '#A0A8C0', // Muted gray
    textMuted: '#6B7280', // Subtle gray
    textDisabled: '#4B5563', // Disabled state

    // Borders
    border: 'rgba(255, 255, 255, 0.1)', // 10% white
    borderHover: 'rgba(255, 255, 255, 0.2)', // 20% white
    borderFocus: 'rgba(0, 217, 255, 0.5)', // Teal glow

    // Glassmorphic cards
    cardBg: 'rgba(26, 30, 63, 0.6)', // Semi-transparent
    cardBorder: 'rgba(0, 217, 255, 0.2)', // Teal glow
    cardShadow: 'rgba(0, 0, 0, 0.4)', // Deep shadow

    // Gradients
    gradientStart: '#00D9FF', // Teal
    gradientMiddle: '#7B61FF', // Purple
    gradientEnd: '#FF4D6A', // Pink
} as const;

// ============================================================================
// SCORING CONFIGURATION
// ============================================================================

export const SCORING_CONFIG = {
    BASE_SCORE: 300,
    MIN_SCORE: 300,
    MAX_SCORE: 850,
    BONUSES: {
        TRANSACTION_COUNT: {
            threshold: 10,
            pointsPer: 5,
            maxPoints: 100,
        },
        WALLET_AGE: {
            threshold: 3, // months
            pointsPerMonth: 10,
            maxPoints: 100,
        },
        DEFI_SCORE: {
            threshold: 20,
            pointsPer: 3,
            maxPoints: 100,
        },
        REPAYMENT_RATE: {
            threshold: 75, // percentage
            pointsPer: 2,
            maxPoints: 150, // Higher weight for repayment
        },
    },
} as const;

// ============================================================================
// RISK LEVELS
// ============================================================================

export const RISK_LEVELS = {
    LOW: {
        label: 'Low Risk',
        color: COLORS.success,
        minScore: 750,
    },
    MEDIUM: {
        label: 'Medium Risk',
        color: COLORS.warning,
        minScore: 500,
    },
    HIGH: {
        label: 'High Risk',
        color: COLORS.error,
        minScore: 0,
    },
} as const;

// ============================================================================
// NETWORK CONFIGURATION
// ============================================================================

export const ALEO_CONFIG = {
    MAINNET: {
        chainId: 'mainnet',
        rpcUrl: process.env.NEXT_PUBLIC_ALEO_RPC || 'https://api.explorer.aleo.org/v1',
        explorerUrl: 'https://explorer.aleo.org',
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'credit_score.aleo',
    },
    TESTNET: {
        chainId: 'testnet3',
        rpcUrl:
            process.env.NEXT_PUBLIC_ALEO_TESTNET_RPC ||
            'https://api.explorer.aleo.org/v1/testnet3',
        explorerUrl: 'https://explorer.aleo.org/testnet3',
        contractAddress: 'credit_score.aleo',
    },
} as const;

// ============================================================================
// ANIMATION TIMINGS
// ============================================================================

export const ANIMATION = {
    // Duration (ms)
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    VERY_SLOW: 1000,

    // Easing functions
    EASE_OUT: [0.16, 1, 0.3, 1] as const,
    EASE_IN_OUT: [0.4, 0, 0.2, 1] as const,
    SPRING: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30,
    },
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
} as const;

// ============================================================================
// SPACING (8px grid)
// ============================================================================

export const SPACING = {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    '2XL': 48,
    '3XL': 64,
    '4XL': 96,
} as const;

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================

export const Z_INDEX = {
    BASE: 0,
    DROPDOWN: 1000,
    STICKY: 1100,
    FIXED: 1200,
    MODAL_BACKDROP: 1300,
    MODAL: 1400,
    POPOVER: 1500,
    TOOLTIP: 1600,
} as const;

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

export const CACHE_CONFIG = {
    METRICS_TTL: 1000 * 60 * 60, // 1 hour
    MAX_CACHE_SIZE: 100, // 100 wallets
} as const;

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_CONFIG = {
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
} as const;

// ============================================================================
// TRANSACTION POLLING
// ============================================================================

export const TX_POLLING = {
    INTERVAL: 500, // 500ms
    MAX_ATTEMPTS: 20, // 10 seconds total
} as const;

// ============================================================================
// PERFORMANCE TARGETS
// ============================================================================

export const PERFORMANCE_TARGETS = {
    PAGE_LOAD: 2000, // 2 seconds
    PROOF_GENERATION: 3000, // 3 seconds
    TX_SUBMISSION: 2000, // 2 seconds
    LIGHTHOUSE_SCORE: 90,
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
    ENABLE_ANALYTICS: process.env.NODE_ENV === 'production',
    ENABLE_SENTRY: process.env.NODE_ENV === 'production',
    ENABLE_MOCK_DATA: process.env.NODE_ENV === 'development',
    ENABLE_TESTNET: process.env.NEXT_PUBLIC_CHAIN_ID === 'testnet',
} as const;
