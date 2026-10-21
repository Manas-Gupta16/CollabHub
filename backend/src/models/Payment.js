const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
            index: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        plan: {
            type: String,
            enum: ["PRO", "ENTERPRISE"],
            required: true
        },

        billingCycle: {
            type: String,
            enum: ["MONTHLY", "YEARLY"],
            default: "MONTHLY"
        },

        amount: {
            type: Number,
            required: true // In Rupees
        },

        amountInPaise: {
            type: Number,
            required: true // In Paise for Razorpay
        },

        currency: {
            type: String,
            default: "INR"
        },

        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        razorpayPaymentId: {
            type: String,
            index: true
        },

        razorpaySignature: {
            type: String
        },

        status: {
            type: String,
            enum: ["PENDING", "SUCCESS", "FAILED"],
            default: "PENDING",
            index: true
        },

        paymentMethod: {
            type: String,
            default: "razorpay"
        },

        invoiceNumber: {
            type: String,
            unique: true
        },

        receipt: {
            type: String
        },

        errorReason: {
            type: String
        },

        paidAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// Helper to generate invoice number before save
paymentSchema.pre("save", function (next) {
    if (!this.invoiceNumber) {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const rand = Math.floor(1000 + Math.random() * 9000);
        this.invoiceNumber = `INV-${dateStr}-${rand}`;
    }
    next();
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
