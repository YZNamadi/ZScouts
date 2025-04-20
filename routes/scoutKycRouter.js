
const { deleteProfilePic } = require('../controllers/playerKycController');
const scoutAuthController = require('../controllers/scoutController');
const { scoutInfo, deleteScoutInfo, updateScoutInfo, profilePic, deleteScoutProfilePic } = require('../controllers/scoutKycController');
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
 *     summary: Submit Scout KYC information
 *     tags: [Scout KYC]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the scout
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - gender
 *               - nationality
 *               - phoneNumber
 *               - verificationDocument
 *               - clubName
 *               - scoutingRole
 *               - league
 *               - preferredPosition
 *               - age
 *             properties:
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *               nationality:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               verificationDocument:
 *                 type: string
 *                 format: binary
 *               clubName:
 *                 type: string
 *               scoutingRole:
 *                 type: string
 *                 enum: [video scout, talent scout, technical scout, internationl scout, first team scout]
 *               league:
 *                 type: string
 *               preferredPosition:
 *                 type: string
 *                 enum: [GK, DEF, MF, ST]
 *               age:
 *                 type: string
 *     responses:
 *       201:
 *         description: KYC completed successfully
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
 *       400:
 *         description: Bad Request (missing fields, upload errors, or already completed KYC)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Scout KYC already captured
 *       404:
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
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to complete KYC: [error details]"
 */
router.post('/scoutkyc/:id', upload.single('verificationDocument'), scoutInfo);

/**
 * @swagger
 * /api/v1/scouts/{id}:
 *   put:
 *     summary: Update scout profile information
 *     tags: [Scout KYC]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the scout
 *         schema:
 *           type: string
 *           format: uuid
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
 *                 enum: [video scout, talent scout, technical scout, internationl scout, first team scout]
 *               league:
 *                 type: string
 *               preferredPosition:
 *                 type: string
 *                 enum: [GK, DEF, MF, ST]
 *               preferredAge:
 *                 type: string
 *               socialMediaProfile:
 *                 type: string
 *               verificationDocument:
 *                 type: string
 *                 format: binary
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
 *       400:
 *         description: Bad request (e.g., upload error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error uploading document: error details"
 *       404:
 *         description: Scout or profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Scout profile not found. Please create a profile first."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to update scout profile: error details"
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
/**
 * @swagger
 * /api/v1/scoutprofile-pic/{id}:
 *   post:
 *     summary: Upload scout profile picture
 *     description: Uploads a profile picture for a specific scout using their ID. Requires a multipart/form-data request with an image file.
 *     tags:
 *       [Scout KYC]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Scout ID
 *         schema:
 *           type: string
 *           example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profilepic
 *             properties:
 *               profilepic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture successfully uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile picture successfully uploaded
 *                 data:
 *                   type: object
 *                   properties:
 *                     profilePic:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/v123456789/profile.jpg
 *       400:
 *         description: No profile picture uploaded or invalid file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Please upload a profile picture
 *       404:
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
 *         description: Internal server error during upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to upload scout profile picture: <error message>"
 */
router.post('/scoutprofile-pic/:id', upload.single('profilepic'), profilePic);


router.delete('/scoutdelete-profile-pic/:id', deleteScoutProfilePic);

module.exports = router