const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    registerValidator,
    loginValidator,
} = require("../validators/authValidator");

const validate = require(
    "../middleware/validationMiddleware"
);

const {
    register,
    login,
    getProfile,
} = require("../controllers/authController");

router.post(
    "/register",
    registerValidator,
    validate,
    register
);

router.post(
    "/login",
    loginValidator,
    validate,
    login
);

router.get(
    "/profile",
    protect,
    getProfile
);

module.exports = router;