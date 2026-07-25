const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/create-order", billingController.createRazorpayOrder);
router.post("/verify-payment", billingController.verifyRazorpayPayment);
router.post("/:workspaceId/subscribe", billingController.updateSubscription);
router.get("/:workspaceId/billing", billingController.getBillingDetails);

module.exports = router;
