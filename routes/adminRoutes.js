const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const {adminAuth}  = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /api/admin/players/{id}:
 *   delete:
 *     summary: Delete a player account
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID to delete
 *     responses:
 *       200:
 *         description: Player account deleted successfully
 *       404:
 *         description: Player not found
 *       500:
 *         description: Internal server error
 */
router.delete("/players/:id", adminAuth, adminController.deletePlayerAccount);


/**
 * @swagger
 * /api/admin/scouts/{id}:
 *   delete:
 *     summary: Delete a scout account
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scout ID to delete
 *     responses:
 *       200:
 *         description: Scout account deleted successfully
 *       404:
 *         description: Scout not found
 *       500:
 *         description: Internal server error
 */
router.delete("/scouts/:id", adminAuth, adminController.deleteScoutAccount);

/**
 * @swagger
 * /api/admin/scouts/{id}/verify:
 *   patch:
 *     summary: Verify a scout
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scout ID to verify
 *     responses:
 *       200:
 *         description: Scout verified successfully
 *       404:
 *         description: Scout not found
 *       500:
 *         description: Internal server error
 */
router.patch("/scouts/:id/verify", adminAuth, adminController.verifyScout);
/**
 * @swagger
 * /api/admin/scouts/allscouts:
 *   get:
 *     summary: Get all scouts (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all scouts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All Scout in Database
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "1"
 *                       fullname:
 *                         type: string
 *                         example: "Alex Johnson"
 *                       email:
 *                         type: string
 *                         example: "alex.johnson@example.com"
 *                       isAdmin:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                   example: 3
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not an admin
 *       500:
 *         description: Internal server error
 */
router.get('/allscouts', adminAuth, adminController.getAllScouts);

router.patch("/players/:id/makeAdmin", adminAuth, adminController.promoteToAdmin);


module.exports = router;
