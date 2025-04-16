const express = require("express");
const router = express.Router();
const passport = require("passport"); 
const jwt = require("jsonwebtoken"); 
const {registerValidation, forgetPasswords, loginValidation,changePasswordValidation,resetPasswordValidation} = require("../middlewares/validation")
const authenticate = require("../middlewares/authMiddleware").authenticate;  
const {
  signUp,
  verifyEmail,
  resendVerificationEmail,
  signIn,
  forgotPassword,
  resetPassword,
  changePassword,
  signOut,
  searchPlayers,
  getPlayerContact,
  getPlayer,
} = require("../controllers/playerController");

// Standard player auth routes

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
 *               - confirmPassword
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Player registered successfully and verification email sent.
 */
router.post("/register", registerValidation,signUp);

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
router.get("/verify-email/:token", verifyEmail);

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
router.post("/resend-verification", resendVerificationEmail);

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
router.post("/login", loginValidation, signIn);

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
router.post("/forgot-password", forgetPasswords, forgotPassword);

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
router.post("/reset-password/:token",resetPasswordValidation, resetPassword);



/**
 * @swagger
 * /api/players/change-password:
 *   post:
 *     summary: Change player password
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Invalid input or current password is incorrect.
 *       401:
 *         description: Unauthorized.
 */
router.post("/change-password", authenticate, changePasswordValidation, changePassword);

 /**
 * @swagger
 * /api/players/sign-out:
 *   post:
 *     summary: Sign out the player
 *     tags: [Players]
 *     description: Signs out a player by blacklisting their token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Player signed out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Player signed out successfully
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
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.post("/signout", signOut);


// Google OAuth Routes for Player Authentication

/**
 * @swagger
 * /api/players/google-authenticate:
 *   get:
 *     summary: Authenticate using Google
 *     tags: [Players]
 *     responses:
 *       302:
 *         description: Redirect to Google for authentication.
 */
router.get('/google-authenticate', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /api/players/auth/google/login:
 *   get:
 *     summary: Google OAuth callback for player login
 *     tags: [Players]
 *     responses:
 *       200:
 *         description: Player successfully logged in using Google.
 */
router.get('/auth/google/login', 
  passport.authenticate('google', { failureRedirect: '/login' }), 
  async (req, res) => {
    try {
      const token = jwt.sign(
        { userId: req.user.id, isVerified: req.user.isVerified }, 
        process.env.JWT_SECRET, 
        { expiresIn: "1day" }
      );
      res.status(200).json({ message: "Login successful", data: req.user, token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * @swagger
 * tags:
 *   name: Player Discovery
 *   description: Search and filter players based on specific criteria
 */

/**
 * @swagger
 * /api/v1/players/search:
 *   get:
 *     summary: Search for players based on filters
 *     tags: [Player Discovery]
 *     parameters:
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: Filter players by primary position
 *       - in: query
 *         name: nationality
 *         schema:
 *           type: string
 *         description: Filter players by nationality
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: integer
 *         description: Filter players by minimum average rating
 *       - in: query
 *         name: maxRating
 *         schema:
 *           type: integer
 *         description: Filter players by maximum average rating
 *     responses:
 *       200:
 *         description: List of players matching the filters
 *       500:
 *         description: Internal server error
 */
router.get("/players/search", searchPlayers);

/**
 * @swagger
 * /api/players/contact/{id}:
 *   get:
 *     summary: Retrieve player contact details
 *     tags: [Player Discovery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The player's ID
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Player contact details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Player contact details retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     phoneNumber:
 *                       type: string
 *                       example: "1234567890"
 *       403:
 *         description: Payment required to view contact details.
 *       404:
 *         description: Player not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/contact/:id", authenticate, getPlayerContact);
/**
 * @swagger
 * /api/players/getplayer/{id}:
 *   get:
 *     summary: Get a player by ID
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the player to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Player found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Player found
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
 *                     playerKyc:
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
 *                         playingRole:
 *                           type: string
 *                         league:
 *                           type: string
 *                         preferredFoot:
 *                           type: string
 *                         preferredPosition:
 *                           type: string
 *                         socialMediaProfile:
 *                           type: string
 *       400:
 *         description: Player not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Player not found
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
router.get('/getplayer/:id', getPlayer);

module.exports = router;

