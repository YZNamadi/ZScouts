const express = require("express");
const router = express.Router();
const passport = require("passport"); // Ensure Passport is imported
const jwt = require("jsonwebtoken");
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

/**
 * @swagger
 * /api/scouts/google-authenticate:
 *   get:
 *     summary: Initiate Google OAuth for scouts
 *     tags: [Scouts]
 *     responses:
 *       302:
 *         description: Redirect to Google for authentication.
 */
router.get('/google-authenticate', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /api/scouts/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback for scout login
 *     tags: [Scouts]
 *     responses:
 *       200:
 *         description: Scout logged in successfully using Google.
 */
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }), 
  async (req, res) => {
    try {
      const token = jwt.sign({ userId: req.user.id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: "1day" });
      res.status(200).json({
        message: "Scout Google Sign In successful",
        data: req.user,
        token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

module.exports = router;
