const { playerInfo, updatePlayerInfo, deletePlayerInfo, profilePic, deleteProfilePic, videoUpload } = require('../controllers/playerKycController');
const playerController = require('../controllers/playerController');
const upload = require('../utils/multer');

const router = require('express').Router();



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
 *                 enum: [Left, Right, Both]
 *                 description: preferred foot of the player
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
 *                   example: "Unable to delete player profile: [error details]"
 */
router.delete('/playerskyc/:id/', deletePlayerInfo);

/**
 * @swagger
 * /api/v1/profilepic/{id}:
 *   post:
 *     summary: Upload player profile picture
 *     description: Uploads a profile picture for a specific player using their ID. Requires a multipart/form-data request with an image file.
 *     tags:
 *       - Players
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Player ID
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
 *         description: No profile picture uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Please upload a profile picture
 *       404:
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
 *         description: Internal server error during upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to upload player profile picture: <error message>"
 */
router.post('/profilepic/:id', upload.single('profilepic'), profilePic);

/**
 * @swagger
 * /api/v1/delete-profile-pic/{id}:
 *   delete:
 *     summary: Delete a player's profile picture
 *     description: Deletes the profile picture of a specific player by their ID from Cloudinary.
 *     tags:
 *       - [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Player ID
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Profile picture successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile picture successfully deleted
 *       400:
 *         description: No profile picture to delete or invalid image ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No profile picture to delete
 *       404:
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
 *         description: Internal server error during deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to delete profile picture: <error message>"
 */
router.delete('/delete-profile-pic/:id', deleteProfilePic);

/**
 * @swagger
 * /api/v1/videoupload/{id}:
 *   post:
 *     summary: Upload player KYC video
 *     description: Uploads a video for a specific player using their ID. Requires a multipart/form-data request with a video file.
 *     tags:
 *       - Players
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Player KYC ID
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
 *               - videoupload
 *             properties:
 *               videoupload:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Video successfully uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Video successfully uploaded
 *                 data:
 *                   type: object
 *                   properties:
 *                     videoupload:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/video/upload/v123456789/video.mp4
 *       400:
 *         description: No video uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Please upload a video
 *       404:
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
 *         description: Internal server error during upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to upload player profile picture: <error message>"
 */

router.post('/videoupload/:id', upload.single('videoupload'), videoUpload);

module.exports = router