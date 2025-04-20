const express = require("express");
const router = express.Router();
const passport = require("passport"); 
const jwt = require("jsonwebtoken");
const {registerValidation, forgetPasswords, loginValidation, resetPasswordValidation, changePasswordValidation} = require("../middlewares/validation");
const scoutAuthController = require("../controllers/scoutController");

/**
 * @swagger
 * /api/scouts/register:
 *   post:
 *     summary: Register a new scout
 *     description: Creates a new scout account and sends a verification email.
 *     tags:
 *       - Scouts
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
 *               - confirmPassword
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "StrongPassword123"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "StrongPassword123"
 *     responses:
 *       201:
 *         description: Scout account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Check your email: jane.doe@example.com to verify your scout account."
 *                 data:
 *                   $ref: '#/components/schemas/Scout'
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error or email already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The email jane.doe@example.com is already associated with an account. Please use a different email.
 *       500:
 *         description: Internal server error during registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong: <error message>"
 */
router.post("/register", registerValidation, scoutAuthController.signUp);

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
router.post("/login", loginValidation, scoutAuthController.signIn);

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
router.post("/forgot-password", forgetPasswords, scoutAuthController.forgotPassword);

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
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful.
 */
router.post("/reset-password/:token", resetPasswordValidation, scoutAuthController.resetPassword);

/**
 * @swagger
 * /api/scouts/change-password:
 *   post:
 *     summary: Change scout's password
 *     tags: [Scouts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully.
 */
router.post("/change-password", changePasswordValidation, scoutAuthController.changePassword);

/**
 * @swagger
 * /api/scouts/sign-out:
 *   post:
 *     summary: Sign out the scout
 *     tags: [Scouts]
 *     description: Signs out a scout by invalidating the token via blacklisting.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Scout signed out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Scout signed out successfully
 *       401:
 *         description: No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No token provided
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
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
/**
 * @swagger
 * /api/scouts/getscout/{id}:
 *   get:
 *     summary: Get a scout by ID
 *     tags: [Scouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the scout to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Scout found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Scout found
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     fullname:
 *                       type: string
 *                     email:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     scoutKyc:
 *                       type: object
 *                       properties:
 *                         nationality:
 *                           type: string
 *                         phoneNumber:
 *                           type: string
 *                         verificationDocument:
 *                           type: string
 *                         clubName:
 *                           type: string
 *                         scoutingRole:
 *                           type: string
 *                         league:
 *                           type: string
 *                         preferredPosition:
 *                           type: string
 *                         preferredAge:
 *                           type: string
 *                         socialMediaProfile:
 *                           type: string
 *       400:
 *         description: Scout not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Scout not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get('/getscout/:id', scoutAuthController.getScout)

module.exports = router;
