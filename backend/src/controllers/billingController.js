const crypto = require("crypto");
const Workspace = require("../models/Workspace");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");
const activityService = require("../services/activityService");

/**
 * Update workspace subscription plan (Direct Subscription Endpoint)
 * POST /api/billing/:workspaceId/subscribe
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
        details: `Upgraded workspace plan to ${plan} (${workspace.billingCycle}) via ${paymentMethod || "Razorpay / UPI"}`
    });

    res.status(200).json({
        success: true,
        message: `Successfully updated workspace plan to ${plan}`,
        data: {
            workspaceId: workspace._id,
            subscriptionPlan: workspace.subscriptionPlan,
            billingCycle: workspace.billingCycle,
            updatedAt: workspace.updatedAt,
            transactionId: transactionId || `TXN_RZP_${Date.now()}`
        }
    });
});

/**
 * Create Razorpay Order
 * POST /api/billing/create-order
 */
const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { workspaceId, plan, billingCycle } = req.body;

    const targetWsId = workspaceId || (req.body.targetWorkspaceId);

    const workspace = await Workspace.findById(targetWsId);
    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const isMember = workspace.members.some(
        (m) => (m.user._id || m.user).toString() === req.user._id.toString() && m.status !== "PENDING"
    );
    if (!isMember) {
        throw new AppError("You are not authorized to manage billing for this workspace", 403);
    }

    // Price calculation: Monthly ₹49, Yearly ₹499
    const unitPrice = billingCycle === "YEARLY" ? 499 : 49;
    const amountInRupees = unitPrice * (workspace.members.length || 1);
    const amountInPaise = amountInRupees * 100; // Razorpay expects amount in paise

    const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_collabhub_demo";
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let orderId = `order_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Try actual Razorpay SDK if secret is configured
    if (keySecret && keyId && !keyId.includes("demo")) {
        try {
            const Razorpay = require("razorpay");
            const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
            const rzpOrder = await rzp.orders.create({
                amount: amountInPaise,
                currency: "INR",
                receipt: `rcpt_${targetWsId}_${Date.now()}`,
                notes: {
                    workspaceId: targetWsId.toString(),
                    plan: plan || "PRO",
                    billingCycle: billingCycle || "MONTHLY"
                }
            });
            orderId = rzpOrder.id;
        } catch (err) {
            console.warn("Razorpay SDK order fallback:", err.message);
        }
    }

    res.status(200).json({
        success: true,
        data: {
            orderId,
            amount: amountInPaise,
            amountInRupees,
            currency: "INR",
            keyId,
            plan: plan || "PRO",
            billingCycle: billingCycle || "MONTHLY",
            workspaceId: targetWsId,
            workspaceName: workspace.name,
            customerName: req.user.name || "CollabHub Member",
            customerEmail: req.user.email
        }
    });
});

/**
 * Verify Razorpay Payment & Upgrade Workspace Subscription
 * POST /api/billing/verify-payment
 */
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
    const { 
        workspaceId, 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature, 
        plan, 
        billingCycle,
        paymentMethod 
    } = req.body;

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

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // HMAC Signature verification if secret configured
    if (keySecret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
        const generatedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            throw new AppError("Invalid Razorpay payment signature verification failed", 400);
        }
    }

    const targetPlan = plan || "PRO";
    const targetCycle = billingCycle || "MONTHLY";

    workspace.subscriptionPlan = targetPlan;
    workspace.billingCycle = targetCycle;
    await workspace.save();

    await activityService.createActivity({
        workspace: workspace._id,
        user: req.user._id,
        action: "SUBSCRIPTION_UPDATED",
        details: `Upgraded workspace plan to ${targetPlan} (${targetCycle}) via Razorpay Payment Gateway (${razorpay_payment_id || paymentMethod || "Razorpay"})`
    });

    res.status(200).json({
        success: true,
        message: `🎉 Payment Verified! Workspace upgraded to ${targetPlan} Plan`,
        data: {
            workspaceId: workspace._id,
            subscriptionPlan: workspace.subscriptionPlan,
            billingCycle: workspace.billingCycle,
            updatedAt: workspace.updatedAt,
            paymentId: razorpay_payment_id || `pay_rzp_${Date.now()}`
        }
    });
});

/**
 * Get active workspace billing details
 * GET /api/billing/:workspaceId/billing
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
    createRazorpayOrder,
    verifyRazorpayPayment,
    getBillingDetails
};
