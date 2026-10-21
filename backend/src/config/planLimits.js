/**
 * Plan configuration and limit definitions for CollabHub
 */

const PLAN_LIMITS = {
    FREE: {
        name: "CollabHub Starter Free",
        priceMonthly: 0,
        priceYearly: 0,
        maxMembers: 5,
        maxPrivateChannels: 2,
        maxPinnedLinks: 3,
        maxTeamGoals: 2,
        maxFileSizeMB: 10,
        hasAdvancedAnalytics: false,
        prioritySupport: false
    },
    PRO: {
        name: "CollabHub Pro Team",
        priceMonthly: 49,
        priceYearly: 499,
        maxMembers: 50,
        maxPrivateChannels: Infinity,
        maxPinnedLinks: Infinity,
        maxTeamGoals: Infinity,
        maxFileSizeMB: 100,
        hasAdvancedAnalytics: true,
        prioritySupport: true
    },
    ENTERPRISE: {
        name: "CollabHub Enterprise",
        priceMonthly: 199,
        priceYearly: 1999,
        maxMembers: Infinity,
        maxPrivateChannels: Infinity,
        maxPinnedLinks: Infinity,
        maxTeamGoals: Infinity,
        maxFileSizeMB: 500,
        hasAdvancedAnalytics: true,
        prioritySupport: true
    }
};

/**
 * Check if the workspace subscription is currently active or expired.
 * Automatically handles downgrade logic if expiration date has passed.
 */
const getEffectivePlan = (workspace) => {
    if (!workspace) return "FREE";

    const plan = workspace.subscriptionPlan || "FREE";
    if (plan === "FREE") return "FREE";

    // If subscription has an expiration date, check if it has passed
    if (workspace.subscriptionExpiresAt) {
        const now = new Date();
        const expiresAt = new Date(workspace.subscriptionExpiresAt);
        if (now > expiresAt) {
            return "FREE"; // Expired
        }
    }

    return plan;
};

/**
 * Returns remaining days of the subscription
 */
const getSubscriptionDaysRemaining = (workspace) => {
    if (!workspace || !workspace.subscriptionExpiresAt) return 0;
    const now = new Date();
    const expiresAt = new Date(workspace.subscriptionExpiresAt);
    const diffTime = expiresAt.getTime() - now.getTime();
    if (diffTime <= 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

module.exports = {
    PLAN_LIMITS,
    getEffectivePlan,
    getSubscriptionDaysRemaining
};
