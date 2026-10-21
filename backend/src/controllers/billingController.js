const crypto = require("crypto");
const Razorpay = require("razorpay");
const Workspace = require("../models/Workspace");
const Payment = require("../models/Payment");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");
const activityService = require("../services/activityService");
const { PLAN_LIMITS, getEffectivePlan, getSubscriptionDaysRemaining } = require("../config/planLimits");

/**
 * Initialize Razorpay client helper
 */
const getRazorpayInstance = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.includes("demo")) {
        return null;
    }

    try {
        return new Razorpay({
            key_id: keyId,
            key_secret: keySecret
        });
    } catch (err) {
        console.warn("Failed to instantiate Razorpay SDK:", err.message);
        return null;
    }
};

/**
 * Calculate subscription expiration date
 */
const calculateExpirationDate = (currentExpiresAt, billingCycle) => {
    const now = new Date();
    // If workspace already has an active future expiration, extend from that date
    const baseDate = currentExpiresAt && new Date(currentExpiresAt) > now
        ? new Date(currentExpiresAt)
        : now;

    const newDate = new Date(baseDate);
    if (billingCycle === "YEARLY") {
        newDate.setFullYear(newDate.getFullYear() + 1);
    } else {
        newDate.setDate(newDate.getDate() + 30);
    }
    return newDate;
};

/**
 * Create Razorpay Order
 * POST /api/billing/create-order
 */
const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { workspaceId, targetWorkspaceId, plan, billingCycle } = req.body;
    const wsId = workspaceId || targetWorkspaceId;

    if (!wsId) {
        throw new AppError("Workspace ID is required", 400);
    }

    const workspace = await Workspace.findById(wsId);
    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    // Only OWNER or ADMIN can purchase subscription
    const userMember = workspace.members.find(
        (m) => (m.user._id || m.user).toString() === req.user._id.toString() && m.status !== "PENDING"
    );

    if (!userMember || (userMember.role !== "OWNER" && userMember.role !== "ADMIN")) {
        throw new AppError("Only workspace owners or admins can manage subscription billing", 403);
    }

    const targetPlan = plan || "PRO";
    const targetCycle = billingCycle === "YEARLY" ? "YEARLY" : "MONTHLY";

    const planConfig = PLAN_LIMITS[targetPlan];
    if (!planConfig) {
        throw new AppError("Invalid subscription plan", 400);
    }

    // Pricing calculation
    const unitPrice = targetCycle === "YEARLY" ? planConfig.priceYearly : planConfig.priceMonthly;
    const amountInRupees = unitPrice;
    const amountInPaise = amountInRupees * 100;

    const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_collabhub_demo";
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const rzp = getRazorpayInstance();

    if (rzp) {
        try {
            const rzpOrder = await rzp.orders.create({
                amount: amountInPaise,
                currency: "INR",
                receipt: `rcpt_${wsId}_${Date.now()}`,
                notes: {
                    workspaceId: wsId.toString(),
                    workspaceName: workspace.name,
                    plan: targetPlan,
                    billingCycle: targetCycle,
                    userId: req.user._id.toString(),
                    userEmail: req.user.email
                }
            });
            orderId = rzpOrder.id;
        } catch (err) {
            console.error("Razorpay order creation error:", err);
            throw new AppError(`Razorpay order error: ${err.message}`, 500);
        }
    }

    // Create a pending Payment record in database for audit & reconciliation
    await Payment.create({
        workspace: workspace._id,
        user: req.user._id,
        plan: targetPlan,
        billingCycle: targetCycle,
        amount: amountInRupees,
        amountInPaise,
        currency: "INR",
        razorpayOrderId: orderId,
        status: "PENDING",
        receipt: `rcpt_${wsId}_${Date.now()}`
    });

    res.status(200).json({
        success: true,
        data: {
            orderId,
            amount: amountInPaise,
            amountInRupees,
            currency: "INR",
            keyId,
            plan: targetPlan,
            billingCycle: targetCycle,
            workspaceId: workspace._id,
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

    if (!workspaceId || !razorpay_order_id) {
        throw new AppError("Missing required payment verification details", 400);
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const userMember = workspace.members.find(
        (m) => (m.user._id || m.user).toString() === req.user._id.toString() && m.status !== "PENDING"
    );
    if (!userMember || (userMember.role !== "OWNER" && userMember.role !== "ADMIN")) {
        throw new AppError("Only workspace owners or admins can verify and activate subscriptions", 403);
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Cryptographic HMAC SHA-256 signature verification if secret is set
    if (keySecret && razorpay_signature && !keySecret.includes("demo")) {
        const expectedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            // Update payment record to FAILED
            await Payment.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    status: "FAILED",
                    errorReason: "Signature verification failed",
                    razorpayPaymentId: razorpay_payment_id
                }
            );
            throw new AppError("Razorpay payment signature verification failed. Untrusted payment.", 400);
        }
    }

    const targetPlan = plan || "PRO";
    const targetCycle = billingCycle === "YEARLY" ? "YEARLY" : "MONTHLY";
    const expirationDate = calculateExpirationDate(workspace.subscriptionExpiresAt, targetCycle);

    // Update Workspace model
    workspace.subscriptionPlan = targetPlan;
    workspace.billingCycle = targetCycle;
    workspace.subscriptionStatus = "ACTIVE";
    workspace.subscriptionExpiresAt = expirationDate;
    workspace.subscriptionStartedAt = workspace.subscriptionStartedAt || new Date();
    workspace.lastPaymentId = razorpay_payment_id || `pay_${Date.now()}`;
    workspace.lastOrderId = razorpay_order_id;
    await workspace.save();

    // Update Payment record in database
    let payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
        const planConfig = PLAN_LIMITS[targetPlan] || PLAN_LIMITS.PRO;
        const price = targetCycle === "YEARLY" ? planConfig.priceYearly : planConfig.priceMonthly;
        payment = new Payment({
            workspace: workspace._id,
            user: req.user._id,
            plan: targetPlan,
            billingCycle: targetCycle,
            amount: price,
            amountInPaise: price * 100,
            razorpayOrderId: razorpay_order_id
        });
    }

    payment.status = "SUCCESS";
    payment.razorpayPaymentId = razorpay_payment_id || `pay_${Date.now()}`;
    payment.razorpaySignature = razorpay_signature || "";
    payment.paidAt = new Date();
    payment.paymentMethod = paymentMethod || "Razorpay (Cards / UPI / NetBanking)";
    await payment.save();

    // Log Activity
    await activityService.createActivity({
        workspace: workspace._id,
        user: req.user._id,
        action: "SUBSCRIPTION_UPDATED",
        details: `Subscribed to ${targetPlan} Plan (${targetCycle}) via Razorpay. Valid until ${expirationDate.toLocaleDateString()}.`
    });

    res.status(200).json({
        success: true,
        message: `🎉 Payment Verified! Workspace upgraded to ${targetPlan} Plan until ${expirationDate.toLocaleDateString()}`,
        data: {
            workspaceId: workspace._id,
            subscriptionPlan: workspace.subscriptionPlan,
            billingCycle: workspace.billingCycle,
            subscriptionStatus: workspace.subscriptionStatus,
            subscriptionExpiresAt: workspace.subscriptionExpiresAt,
            paymentId: payment.razorpayPaymentId,
            invoiceNumber: payment.invoiceNumber,
            amount: payment.amount
        }
    });
});

/**
 * Razorpay Webhook Handler
 * POST /api/billing/webhook
 */
const handleRazorpayWebhook = asyncHandler(async (req, res) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    // Verify webhook HMAC if secret configured
    if (webhookSecret) {
        if (!signature) {
            return res.status(400).json({ error: "Missing webhook signature header" });
        }

        const rawBody = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(rawBody)
            .digest("hex");

        if (expectedSignature !== signature) {
            console.error("Razorpay webhook signature verification failed");
            return res.status(400).json({ error: "Invalid webhook signature" });
        }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log(`[Razorpay Webhook] Received event: ${event}`);

    if (event === "payment.captured" || event === "order.paid") {
        const paymentEntity = payload.payment?.entity;
        const notes = paymentEntity?.notes || {};
        const workspaceId = notes.workspaceId;

        if (workspaceId) {
            const workspace = await Workspace.findById(workspaceId);
            if (workspace) {
                const targetPlan = notes.plan || "PRO";
                const targetCycle = notes.billingCycle || "MONTHLY";
                const expirationDate = calculateExpirationDate(workspace.subscriptionExpiresAt, targetCycle);

                workspace.subscriptionPlan = targetPlan;
                workspace.billingCycle = targetCycle;
                workspace.subscriptionStatus = "ACTIVE";
                workspace.subscriptionExpiresAt = expirationDate;
                workspace.lastPaymentId = paymentEntity.id;
                await workspace.save();

                await Payment.findOneAndUpdate(
                    { razorpayOrderId: paymentEntity.order_id },
                    {
                        status: "SUCCESS",
                        razorpayPaymentId: paymentEntity.id,
                        paymentMethod: paymentEntity.method || "Razorpay",
                        paidAt: new Date()
                    },
                    { upsert: true }
                );
            }
        }
    } else if (event === "payment.failed") {
        const paymentEntity = payload.payment?.entity;
        if (paymentEntity?.order_id) {
            await Payment.findOneAndUpdate(
                { razorpayOrderId: paymentEntity.order_id },
                {
                    status: "FAILED",
                    errorReason: paymentEntity.error_description || "Payment failed",
                    razorpayPaymentId: paymentEntity.id
                }
            );
        }
    }

    res.status(200).json({ status: "ok" });
});

/**
 * Get active workspace billing details
 * GET /api/billing/:workspaceId/billing
 */
const getBillingDetails = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const effectivePlan = getEffectivePlan(workspace);
    const daysRemaining = getSubscriptionDaysRemaining(workspace);
    const planConfig = PLAN_LIMITS[effectivePlan] || PLAN_LIMITS.FREE;
    const memberCount = (workspace.members || []).length;

    res.status(200).json({
        success: true,
        data: {
            workspaceId: workspace._id,
            workspaceName: workspace.name,
            subscriptionPlan: effectivePlan,
            originalPlan: workspace.subscriptionPlan || "FREE",
            subscriptionStatus: workspace.subscriptionStatus || "FREE",
            subscriptionExpiresAt: workspace.subscriptionExpiresAt,
            daysRemaining,
            isExpired: workspace.subscriptionPlan !== "FREE" && effectivePlan === "FREE",
            billingCycle: workspace.billingCycle || "MONTHLY",
            memberCount,
            planConfig,
            allPlans: PLAN_LIMITS,
            pricing: {
                monthly: PLAN_LIMITS.PRO.priceMonthly,
                yearly: PLAN_LIMITS.PRO.priceYearly,
                currency: "INR",
                symbol: "₹"
            },
            lastUpdated: workspace.updatedAt
        }
    });
});

/**
 * Get transaction & invoice history for a workspace
 * GET /api/billing/:workspaceId/transactions
 */
const getTransactionHistory = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const payments = await Payment.find({ workspace: workspaceId })
        .populate("user", "name email avatar")
        .sort({ createdAt: -1 })
        .limit(30);

    res.status(200).json({
        success: true,
        count: payments.length,
        data: payments
    });
});

/**
 * Cancel workspace subscription (allows grace period until expiry)
 * POST /api/billing/:workspaceId/cancel
 */
const cancelSubscription = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const userMember = workspace.members.find(
        (m) => (m.user._id || m.user).toString() === req.user._id.toString() && m.status !== "PENDING"
    );
    if (!userMember || (userMember.role !== "OWNER" && userMember.role !== "ADMIN")) {
        throw new AppError("Only workspace owners or admins can cancel subscriptions", 403);
    }

    workspace.subscriptionStatus = "CANCELLED";
    await workspace.save();

    await activityService.createActivity({
        workspace: workspace._id,
        user: req.user._id,
        action: "SUBSCRIPTION_UPDATED",
        details: `Cancelled active subscription renewal. Access remains active until ${workspace.subscriptionExpiresAt ? new Date(workspace.subscriptionExpiresAt).toLocaleDateString() : 'end of billing period'}.`
    });

    res.status(200).json({
        success: true,
        message: "Subscription renewal cancelled. Access remains active until the end of the billing period.",
        data: {
            workspaceId: workspace._id,
            subscriptionStatus: workspace.subscriptionStatus,
            subscriptionExpiresAt: workspace.subscriptionExpiresAt
        }
    });
});

/**
 * Update workspace subscription plan (Direct / Manual Fallback Endpoint)
 * POST /api/billing/:workspaceId/subscribe
 */
const updateSubscription = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    const { plan, billingCycle, paymentMethod, transactionId } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }

    const userMember = workspace.members.find(
        (m) => (m.user._id || m.user).toString() === req.user._id.toString() && m.status !== "PENDING"
    );
    if (!userMember || (userMember.role !== "OWNER" && userMember.role !== "ADMIN")) {
        throw new AppError("You are not authorized to manage billing for this workspace", 403);
    }

    const targetPlan = plan || "PRO";
    const targetCycle = billingCycle === "YEARLY" ? "YEARLY" : "MONTHLY";
    const expirationDate = calculateExpirationDate(workspace.subscriptionExpiresAt, targetCycle);

    workspace.subscriptionPlan = targetPlan;
    workspace.billingCycle = targetCycle;
    workspace.subscriptionStatus = "ACTIVE";
    workspace.subscriptionExpiresAt = expirationDate;
    workspace.subscriptionStartedAt = workspace.subscriptionStartedAt || new Date();
    await workspace.save();

    // Record Payment
    const planConfig = PLAN_LIMITS[targetPlan] || PLAN_LIMITS.PRO;
    const price = targetCycle === "YEARLY" ? planConfig.priceYearly : planConfig.priceMonthly;
    const payment = await Payment.create({
        workspace: workspace._id,
        user: req.user._id,
        plan: targetPlan,
        billingCycle: targetCycle,
        amount: price,
        amountInPaise: price * 100,
        razorpayOrderId: `order_manual_${Date.now()}`,
        razorpayPaymentId: transactionId || `pay_manual_${Date.now()}`,
        status: "SUCCESS",
        paymentMethod: paymentMethod || "Razorpay / UPI",
        paidAt: new Date()
    });

    await activityService.createActivity({
        workspace: workspace._id,
        user: req.user._id,
        action: "SUBSCRIPTION_UPDATED",
        details: `Updated workspace plan to ${targetPlan} (${targetCycle}) via ${paymentMethod || "Razorpay / UPI"}.`
    });

    res.status(200).json({
        success: true,
        message: `Successfully updated workspace plan to ${targetPlan}`,
        data: {
            workspaceId: workspace._id,
            subscriptionPlan: workspace.subscriptionPlan,
            billingCycle: workspace.billingCycle,
            subscriptionExpiresAt: workspace.subscriptionExpiresAt,
            invoiceNumber: payment.invoiceNumber,
            transactionId: payment.razorpayPaymentId
        }
    });
});

module.exports = {
    createRazorpayOrder,
    verifyRazorpayPayment,
    handleRazorpayWebhook,
    getBillingDetails,
    getTransactionHistory,
    cancelSubscription,
    updateSubscription
};
