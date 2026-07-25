const Workspace = require("../models/Workspace");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");
const activityService = require("../services/activityService");

/**
 * Update workspace subscription plan (Demo / Production handler)
 * POST /api/workspaces/:workspaceId/subscribe
 */
const updateSubscription = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    const { plan, billingCycle, paymentMethod, transactionId } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const isMember = workspace.members.some(
        (m) => (m.user._id || m.user).toString() === req.user._id.toString() && m.status !== "PENDING"
    );
    if (!isMember) {
        throw new AppError("You are not authorized to manage billing for this workspace", 403);
    }

    const validPlans = ["FREE", "PRO", "ENTERPRISE"];
    if (!validPlans.includes(plan)) {
        throw new AppError("Invalid subscription plan", 400);
    }

    workspace.subscriptionPlan = plan;
    workspace.billingCycle = billingCycle || "MONTHLY";
    await workspace.save();

    await activityService.createActivity({
        workspace: workspace._id,
        user: req.user._id,
        action: "SUBSCRIPTION_UPDATED",
        details: `Upgraded workspace plan to ${plan} (${workspace.billingCycle}) via ${paymentMethod || "UPI/Card"}`
    });

    res.status(200).json({
        success: true,
        message: `Successfully updated workspace plan to ${plan}`,
        data: {
            workspaceId: workspace._id,
            subscriptionPlan: workspace.subscriptionPlan,
            billingCycle: workspace.billingCycle,
            updatedAt: workspace.updatedAt,
            transactionId: transactionId || `TXN_${Date.now()}`
        }
    });
});

/**
 * Get active workspace billing details
 * GET /api/workspaces/:workspaceId/billing
 */
const getBillingDetails = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId).select("name subscriptionPlan billingCycle members updatedAt");

    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const memberCount = workspace.members.length;
    const monthlyRate = 49;
    const yearlyRate = 499;
    const currentRate = workspace.billingCycle === "YEARLY" ? yearlyRate : monthlyRate;

    res.status(200).json({
        success: true,
        data: {
            workspaceId: workspace._id,
            workspaceName: workspace.name,
            subscriptionPlan: workspace.subscriptionPlan || "FREE",
            billingCycle: workspace.billingCycle || "MONTHLY",
            memberCount,
            estimatedMonthlyTotal: memberCount * monthlyRate,
            estimatedYearlyTotal: memberCount * yearlyRate,
            currency: "INR",
            currencySymbol: "₹",
            lastUpdated: workspace.updatedAt
        }
    });
});

module.exports = {
    updateSubscription,
    getBillingDetails
};
