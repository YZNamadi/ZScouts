const express = require("express");
const router = express.Router();
const { initializePayment, verifyPayment } = require("../controllers/transactionController");
const verifyToken = require('../middlewares/authtransaction');

/**
 * @swagger
 * /api/transactions/initialize:
 *   post:
 *     summary: Initialize payment for a Player or Scout
 *     description: Initializes payment for a Player (₦3,000) or Scout (₦15,000) based on the user's role.
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment Initialized Successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: "TCA-AF-92KD8L7SDFR0"
 *                     checkout_url:
 *                       type: string
 *                       example: "https://checkout.korapay.com/checkout/xyz123"
 *       400:
 *         description: Invalid role or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid role"
 *       500:
 *         description: Internal server error during payment initialization
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to initialize payment: error message here"
 */
router.post("/initialize", verifyToken, initializePayment);
/**
 * @swagger
 * /api/transactions/verify:
 *   get:
 *     summary: Verify a payment using Korapay reference
 *     description: Verifies the status of a payment using the provided reference from Korapay.
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: reference
 *         required: true
 *         description: The reference string returned by Korapay during payment initialization
 *         schema:
 *           type: string
 *           example: TCA-AF-FoTQ4ZaITSd
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment Verified Successfully
 *       400:
 *         description: Payment verification failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment Verification Failed
 *       401:
 *         description: Unauthorized - token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No token provided
 *       500:
 *         description: Internal server error while verifying payment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/verify", verifyToken, verifyPayment);

module.exports = router;
