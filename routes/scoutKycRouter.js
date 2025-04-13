
const scoutAuthController = require('../controllers/scoutController');
const { scoutInfo, deleteScoutInfo, updateScoutInfo } = require('../controllers/scoutKycController');
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
 * /api/v1/scoutkyc/{id}:
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
 *         multipart/form-data:
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

/**
 * @swagger
 * /api/v1/scouts/{id}:
 *   put:
 *     summary: Update scout KYC information
 *     tags: [Scout KYC]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the scout to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nationality:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               clubName:
 *                 type: string
 *               scoutingRole:
 *                 type: string
 *               league:
 *                 type: string
 *               preferredPosition:
 *                 type: string
 *               preferredAge:
 *                 type: string
 *               socialMediaProfile:
 *                 type: string
 *               verificationDocument:
 *                 type: string
 *                 format: binary
 *                 description: Optional document for scout verification
 *     responses:
 *       200:
 *         description: Scout profile updated successfully
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
 *                   description: Updated scout KYC data
 *       400:
 *         description: Error uploading document or invalid input
 *       404:
 *         description: Scout or profile not found
 *       500:
 *         description: Internal server error while updating profile
 */
router.put('/scouts/:id', upload.single('verificationDocument'),updateScoutInfo);

/**
 * @swagger
 * /api/v1/scoutkyc/{id}:
 *   delete:
 *     summary: Delete scout KYC profile
 *     tags: [Scout KYC]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the scout whose KYC profile is to be deleted
 *     responses:
 *       200:
 *         description: Scout profile deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Scout profile deleted successfully
 *       404:
 *         description: Scout or scout profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Scout not found
 *       500:
 *         description: Internal server error while deleting scout profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to delete scout profile: [error message]"
 */
router.delete('/scoutkyc/:id/', deleteScoutInfo);

module.exports = router