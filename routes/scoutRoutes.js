const express = require("express");
const router = express.Router();
const scoutAuthController = require("../controllers/scoutController");

/**
 * @swagger
 * /api/scouts/register:
 *   post:
 *     summary: Onboard a new scout
 *     tags: [Scouts]
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
 *                 description: Must be "scout"
 *     responses:
 *       201:
 *         description: Scout registered successfully and verification email sent.
 */
router.post("/register", scoutAuthController.signUp);

/**
 * @swagger
 * /api/scouts/verify-email/{token}:
 *   get:
 *     summary: Verify scout's email
 *     tags: [Scouts]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for email verification
 *     responses:
 *       200:
 *         description: Scout verified successfully.
 */
router.get("/verify-email/:token", scoutAuthController.verifyEmail);

/**
 * @swagger
 * /api/scouts/resend-verification:
 *   post:
 *     summary: Resend scout verification email
 *     tags: [Scouts]
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
router.post("/resend-verification", scoutAuthController.resendVerificationEmail);

/**
 * @swagger
 * /api/scouts/login:
 *   post:
 *     summary: Scout sign in
 *     tags: [Scouts]
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
 *         description: Scout signed in successfully.
 */
router.post("/login", scoutAuthController.signIn);

/**
 * @swagger
 * /api/scouts/forgot-password:
 *   post:
 *     summary: Send scout password reset email
 *     tags: [Scouts]
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
router.post("/forgot-password", scoutAuthController.forgotPassword);

/**
 * @swagger
 * /api/scouts/reset-password/{token}:
 *   post:
 *     summary: Reset scout's password
 *     tags: [Scouts]
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
router.post("/reset-password/:token", scoutAuthController.resetPassword);

/**
 * @swagger
 * /api/scouts/signout:
 *   post:
 *     summary: Scout sign out
 *     tags: [Scouts]
 *     responses:
 *       200:
 *         description: Scout signed out successfully.
 */
router.post("/signout", scoutAuthController.signOut);

module.exports = router;
