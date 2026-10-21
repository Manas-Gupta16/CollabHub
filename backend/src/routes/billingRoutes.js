const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");
const { protect } = require("../middleware/authMiddleware");

// Public Webhook endpoint (Signature verified via Razorpay HMAC)
router.post("/webhook", billingController.handleRazorpayWebhook);

// Protected routes (Require logged-in user)
router.use(protect);

router.post("/create-order", billingController.createRazorpayOrder);
router.post("/verify-payment", billingController.verifyRazorpayPayment);
router.post("/:workspaceId/subscribe", billingController.updateSubscription);
router.post("/:workspaceId/cancel", billingController.cancelSubscription);
router.get("/:workspaceId/billing", billingController.getBillingDetails);
router.get("/:workspaceId/transactions", billingController.getTransactionHistory);

module.exports = router;
