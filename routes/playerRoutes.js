const express = require("express");
const router = express.Router();
const playerAuthController = require("../controllers/playerController");

/**
 * @swagger
 * /api/players/register:
 *   post:
 *     summary: Onboard a new player
 *     tags: [Players]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *               - password
 *               - role
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 description: Must be "player"
 *     responses:
 *       201:
 *         description: Player registered successfully and verification email sent.
 */
router.post("/register", playerAuthController.signUp);

/**
 * @swagger
 * /api/players/verify-email/{token}:
 *   get:
 *     summary: Verify player's email
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for email verification
 *     responses:
 *       200:
 *         description: Player verified successfully.
 */
router.get("/verify-email/:token", playerAuthController.verifyEmail);

/**
 * @swagger
 * /api/players/resend-verification:
 *   post:
 *     summary: Resend player verification email
 *     tags: [Players]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification email sent successfully.
 */
router.post("/resend-verification", playerAuthController.resendVerificationEmail);

/**
 * @swagger
 * /api/players/login:
 *   post:
 *     summary: Player sign in
 *     tags: [Players]
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Player signed in successfully.
 */
router.post("/login", playerAuthController.signIn);

/**
 * @swagger
 * /api/players/forgot-password:
 *   post:
 *     summary: Send player password reset email
 *     tags: [Players]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent successfully.
 */
router.post("/forgot-password", playerAuthController.forgotPassword);

/**
 * @swagger
 * /api/players/reset-password/{token}:
 *   post:
 *     summary: Reset player's password
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Reset token from email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - existingPassword
 *             properties:
 *               password:
 *                 type: string
 *               existingPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful.
 */
router.post("/reset-password/:token", playerAuthController.resetPassword);

/**
 * @swagger
 * /api/players/signout:
 *   post:
 *     summary: Player sign out
 *     tags: [Players]
 *     responses:
 *       200:
 *         description: Player signed out successfully.
 */
router.post("/signout", playerAuthController.signOut);

module.exports = router;
