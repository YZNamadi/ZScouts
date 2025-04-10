
const scoutAuthController = require('../controllers/scoutController');
const { scoutInfo, deleteScoutInfo } = require('../controllers/scoutKycController');
const upload = require('../utils/multer');

const router = require('express').Router();


/**
 * @swagger
 * tags:
 *   name: Scout KYC
 *   description: Endpoints for scout KYC (Know Your Customer) information
 */

/**
 * @swagger
 * /api/scoutkyc/{id}:
 *   post:
 *     summary: Submit scout KYC information
 *     tags: [Scout KYC]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scout ID to associate with the KYC information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nationality:
 *                 type: string
 *                 description: Nationality of the scout
 *               phoneNumber:
 *                 type: string
 *                 description: Contact phone number of the scout
 *               clubName:
 *                 type: string
 *                 description: Name of the club the scout is associated with
 *               scoutingRole:
 *                 type: string
 *                 description: Role of the scout (e.g., Senior Scout, Assistant Scout)
 *               league:
 *                 type: string
 *                 description: The league the scout primarily works with
 *               preferredPosition:
 *                 type: string
 *                 description: Preferred position the scout specializes in
 *               preferredAge:
 *                 type: string
 *                 description: Preferred age group the scout specializes in
 *               socialMediaProfile:
 *                 type: string
 *                 description: URL of the scout's social media profile
 *               verificationDocument:
 *                 type: string
 *                 format: binary
 *                 description: Upload a verification document (e.g., document or media file)
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
 *         description: Scout not found
 *       500:
 *         description: Internal server error
 */

router.post('/scoutkyc/:id', upload.single('verificationDocument'), scoutInfo);


router.delete('/scoutkyc/:id/:imageId', deleteScoutInfo)

module.exports = router