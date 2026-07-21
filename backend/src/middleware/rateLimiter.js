const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === "production" ? 100 : 10000,
    message: {
        success: false,
        message:
            "Too many requests, please try again later",
    },
});

module.exports = apiLimiter;