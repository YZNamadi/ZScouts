const { playerInfo } = require('../controllers/playerKycController');
const playerController = require('../controllers/playerController');
const upload = require('../utils/multer');

const router = require('express').Router();


/**
 * @swagger
 * tags:
 *   name: Player KYC
 *   description: Endpoints for player KYC (Know Your Customer) information
 */

/**
 * @swagger
 * /api/playerkyc/{id}:
 *   post:
 *     summary: Submit player KYC information
 *     tags: [Player KYC]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID to associate with the KYC information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               age:
 *                 type: integer
 *                 description: Age of the player
 *               nationality:
 *                 type: string
 *                 description: Nationality of the player
 *               height:
 *                 type: string
 *                 description: Height of the player
 *               weight:
 *                 type: string
 *                 description: Weight of the player
 *               preferredFoot:
 *                 type: string
 *                 description: Preferred foot of the player
 *               playingPosition:
 *                 type: string
 *                 description: Position the player plays in
 *               phoneNumber:
 *                 type: string
 *                 description: Player's contact phone number
 *               homeAddress:
 *                 type: string
 *                 description: Home address of the player
 *               primaryPosition:
 *                 type: string
 *                 description: Primary position the player plays in
 *               secondaryPosition:
 *                 type: string
 *                 description: Secondary position of the player
 *               currentClub:
 *                 type: string
 *                 description: Current club the player is associated with
 *               strengths:
 *                 type: string
 *                 description: Player's strengths
 *               coachesWorkedWith:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     coachName:
 *                       type: string
 *                     coachNumber:
 *                       type: string
 *                     coachEmail:
 *                       type: string
 *               openToTrials:
 *                 type: boolean
 *                 description: Whether the player is open to trials
 *               followDiet:
 *                 type: boolean
 *                 description: Whether the player follows a specific diet
 *               willingToRelocate:
 *                 type: boolean
 *                 description: Whether the player is willing to relocate
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: Upload a short video showing the player's skills
 *     responses:
 *       201:
 *         description: KYC information submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "KYC completed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the created KYC record
 *       400:
 *         description: Missing or incorrect information in the request
 *       404:
 *         description: Player not found
 *       500:
 *         description: Internal server error
 */

router.post('/playerkyc/:id', upload.single('media'), playerInfo);

module.exports = router