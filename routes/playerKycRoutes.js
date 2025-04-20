const { playerInfo, updatePlayerInfo, deletePlayerInfo, profilePic, deleteProfilePic, videoUpload } = require('../controllers/playerKycController');
const playerController = require('../controllers/playerController');
const upload = require('../utils/multer');

const router = require('express').Router();

/**
 * @swagger
 * /api/v1/playerkyc/{id}:
 *   post:
 *     summary: Submit player KYC information
 *     tags:
 *       - Players KYC
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the player
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
 *               - age
 *               - gender
 *               - nationality
 *               - height
 *               - weight
 *               - preferredFoot
 *               - phoneNumber
 *               - homeAddress
 *               - primaryPosition
 *               - secondaryPosition
 *               - currentClub
 *               - ability
 *               - contactInfoOfCoaches
 *               - openToTrials
 *               - followDiet
 *               - willingToRelocate
 *               - media
 *             properties:
 *               age:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *               nationality:
 *                 type: string
 *               height:
 *                 type: string
 *               weight:
 *                 type: string
 *               preferredFoot:
 *                 type: string
 *                 enum: [left, right, both]
 *               phoneNumber:
 *                 type: string
 *               homeAddress:
 *                 type: string
 *               primaryPosition:
 *                 type: string
 *                 enum: [GK, DEF, MF, ST]
 *               secondaryPosition:
 *                 type: string
 *                 enum: [GK, DEF, MF, ST]
 *               currentClub:
 *                 type: string
 *               ability:
 *                 type: string
 *                 enum: [dribbling, passing, shooting, defending, stamina, speed]
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
 *                 description: Upload a short video showing player skills
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
 *         description: Invalid input or KYC already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Player KYC already captured
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
 *         description: Server error during KYC processing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to complete KYC: error details"
 */
router.post('/playerkyc/:id', upload.single('media'), playerInfo);

/**
 * @swagger
 * /api/v1/players/{id}:
 *   put:
 *     summary: Update player KYC information
 *     tags:
 *       - Players KYC
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid file or input
 *       404:
 *         description: Player or profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Player not found
 *       500:
 *         description: Internal server error while updating profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to update player KYC: error details"
 */
router.put('/players/:id', upload.single('media'),updatePlayerInfo);

/**
 * @swagger
 * /api/v1/playerskyc/{id}:
 *   delete:
 *     summary: Delete player KYC profile
 *     tags:
 *       - Players KYC
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
 *                   example: "Unable to delete player profile: error details"
 */
router.delete('/playerskyc/:id/', deletePlayerInfo);

/**
 * @swagger
 * /api/v1/profilepic/{id}:
 *   post:
 *     summary: Upload profile picture for a player
 *     tags:
 *       - Players KYC
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the PlayerKyc record
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: formData
 *         name: profilepic
 *         type: file
 *         required: true
 *         description: The profile picture image to upload
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
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
 *                       format: uri
 *                       example: https://res.cloudinary.com/your-cloud/image/upload/v123456789/profile.jpg
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
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to upload player profile picture: error message"
 */
router.post('/profilepic/:id', upload.single('profilepic'), profilePic);

/**
 * @swagger
 * /api/v1/delete-profile-pic/{id}:
 *   delete:
 *     summary: Delete a player's profile picture
 *     description: Deletes the profile picture of a specific player by their ID from Cloudinary.
 *     tags:
 *       - Players KYC
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
 *     summary: Upload video for a player's KYC
 *     tags: ["Players KYC"]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: "Select a video file showing the player's skills (e.g., dribbling, passing, shooting). Accepted formats: mp4, avi, mkv."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the PlayerKyc record
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Video uploaded successfully
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
 *                     videoUpload:
 *                       type: string
 *                       format: uri
 *                       example: https://res.cloudinary.com/your-cloud/video/upload/v123456789/skillshowcase.mp4
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No file uploaded"
 *       404:
 *         description: Player not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Player not found"
 *       500:
 *         description: Server error while uploading video
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to upload player video: error message"
 */
router.post('/videoupload/:id', upload.single('video'), videoUpload);

module.exports = router