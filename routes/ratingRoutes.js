const express = require('express');
const router = express.Router();
const { ratePlayer } = require('../controllers/ratingController'); // Ensure this path is correct
const { authenticate } = require('../middlewares/authMiddleware'); // Import the authenticate middleware

/**
 * @swagger
 * tags:
 *   name: Rating & Review
 *   description: Endpoints for player ratings and reviews
 */

/**
 * @swagger
 * /api/players/{id}/rate:
 *   post:
 *     summary: Rate a player
 *     tags: [Rating & Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID to rate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ratingScore:
 *                 type: integer
 *                 description: Rating score between 1-5
 *               comment:
 *                 type: string
 *                 description: Optional comment
 *     responses:
 *       201:
 *         description: Rating submitted successfully
 *       404:
 *         description: Player not found
 *       400:
 *         description: You have already rated this player
 *       500:
 *         description: Internal server error
 */
router.post('/players/:id/rate', authenticate, ratePlayer);

router.delete('/players/:id/imageId', )

module.exports = router;
