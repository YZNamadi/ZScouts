const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Payment processing and transaction verification
 */

/**
 * @swagger
 * /api/transactions/initialize:
 *   post:
 *     summary: Initialize a new payment transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - amount
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               name:
 *                 type: string
 *                 example: John Doe
 *               amount:
 *                 type: number
 *                 example: 5000
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
 *                   example: Payment initialized successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: TCA-AF-17122024123456
 *                     checkout_url:
 *                       type: string
 *                       example: "https://checkout.korapay.com/some-checkout-link"
 */
router.post("/initialize", transactionController.initializePayment);

/**
 * @swagger
 * /api/transactions/verify:
 *   get:
 *     summary: Verify a payment transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: The reference ID of the payment transaction
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
 *                 data:
 *                   type: object
 *       400:
 *         description: Payment verification failed
 *       404:
 *         description: Payment record not found
 *       500:
 *         description: Internal server error
 */
router.get("/verify", transactionController.verifyPayment);

module.exports = router;
