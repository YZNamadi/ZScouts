const { playerInfo, updatePlayerInfo, deletePlayerInfo } = require('../controllers/playerKycController');
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
 * /api/v1/playerkyc/{id}:
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - age
 *               - nationality
 *               - height
 *               - weight
 *               - preferredFoot
 *               - phoneNumber
 *               - homeAddress
 *               - primaryPosition
 *               - secondaryPosition
 *               - currentClub
 *               - strengths
 *               - contactInfoOfCoaches
 *               - openToTrials
 *               - followDiet
 *               - willingToRelocate
 *               - media
 *             properties:
 *               age:
 *                 type: string
 *                 description: Age of the player
 *               nationality:
 *                 type: string
 *                 default: Nigerian
 *                 description: Nationality of the player
 *               height:
 *                 type: string
 *                 description: Height of the player
 *               weight:
 *                 type: string
 *                 description: Weight of the player
 *               preferredFoot:
 *                 type: string
 *                 description: Preferred foot (e.g., Left, Right, Both)
 *               phoneNumber:
 *                 type: string
 *                 description: Player's contact number
 *               homeAddress:
 *                 type: string
 *                 description: Player's home address
 *               primaryPosition:
 *                 type: string
 *                 enum: [GK, DEF, MF, ST]
 *                 description: Primary position of the player
 *               secondaryPosition:
 *                 type: string
 *                 description: Secondary position of the player
 *               currentClub:
 *                 type: string
 *                 description: Current club of the player
 *               strengths:
 *                 type: string
 *                 description: Player's strengths
 *               contactInfoOfCoaches:
 *                 type: string
 *                 description: Contact details of coaches or references
 *               openToTrials:
 *                 type: string
 *                 enum: [YES, NO]
 *                 description: Indicates if player is open to trials
 *               followDiet:
 *                 type: string
 *                 enum: [YES, NO]
 *                 description: Indicates if player follows a professional diet
 *               willingToRelocate:
 *                 type: string
 *                 enum: [YES, NO]
 *                 description: Indicates if player is willing to relocate
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: Upload a short video showcasing the player's skills
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
 *                   example: KYC completed successfully
 *                 data:
 *                   type: object
 *                   description: Player KYC details
 *       400:
 *         description: Bad request – Missing required fields or media file
 *       404:
 *         description: Player not found
 *       500:
 *         description: Internal server error
 */
router.post('/playerkyc/:id', upload.single('media'), playerInfo);

/**
 * @swagger
 * /api/v1/players/{id}:
 *   put:
 *     summary: Update player KYC information
 *     tags: [Player KYC]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the player to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               age:
 *                 type: string
 *               nationality:
 *                 type: string
 *               height:
 *                 type: string
 *               weight:
 *                 type: string
 *               preferredFoot:
 *                 type: string
 *               playingPosition:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               homeAddress:
 *                 type: string
 *               primaryPosition:
 *                 type: string
 *                 enum: [GK, DEF, MF, ST]
 *               secondaryPosition:
 *                 type: string
 *               currentClub:
 *                 type: string
 *               strengths:
 *                 type: string
 *               contactInfoOfCoaches:
 *                 type: string
 *               openToTrials:
 *                 type: string
 *                 enum: [YES, NO]
 *               followDiet:
 *                 type: string
 *                 enum: [YES, NO]
 *               willingToRelocate:
 *                 type: string
 *                 enum: [YES, NO]
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: Optional file (e.g., video or image) to showcase player skills
 *     responses:
 *       200:
 *         description: Player KYC profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Scout profile updated successfully
 *                 data:
 *                   type: object
 *                   description: Updated player KYC info
 *       400:
 *         description: Error during file upload or validation
 *       404:
 *         description: Player or profile not found
 *       500:
 *         description: Internal server error while updating profile
 */
router.put('/players/:id', upload.single('media'),updatePlayerInfo);

/**
 * @swagger
 * /api/v1/playerskyc/{id}:
 *   delete:
 *     summary: Delete player KYC profile
 *     tags: [Player KYC]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the player whose KYC profile is to be deleted
 *     responses:
 *       200:
 *         description: Player profile deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Player profile deleted successfully
 *       404:
 *         description: Player or player profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Player not found
 *       500:
 *         description: Internal server error while deleting profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unable to delete player profile: [error details]
 */
router.delete('/playerskyc/:id/', deletePlayerInfo);


module.exports = router