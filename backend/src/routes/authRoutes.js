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
    googleLogin,
    getProfile,
    updateProfile,
    forgotPassword,
    resetPassword,
} = require("../controllers/authController");

const upload = require("../middleware/uploadMiddleware");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alex Morgan
 *               email:
 *                 type: string
 *                 example: alex@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post(
    "/register",
    registerValidator,
    validate,
    register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: alex@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
    "/login",
    loginValidator,
    validate,
    login
);

router.post(
    "/google",
    googleLogin
);

router.post(
    "/forgot-password",
    forgotPassword
);

router.post(
    "/reset-password",
    resetPassword
);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get logged in user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/profile",
    protect,
    getProfile
);

router.put(
    "/profile",
    protect,
    upload.single("avatar"),
    updateProfile
);

module.exports = router;