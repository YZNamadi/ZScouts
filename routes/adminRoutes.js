const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

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
router.delete("/players/:id", adminController.deletePlayerAccount);

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
router.delete("/scouts/:id", adminController.deleteScoutAccount);

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
router.patch("/scouts/:id/verify", adminController.verifyScout);

/**
 * @swagger
 * /api/admin/players/{id}/makeAdmin:
 *   patch:
 *     summary: Promote a player to admin
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID to promote
 *     responses:
 *       200:
 *         description: Player promoted to admin successfully
 *       404:
 *         description: Player not found
 *       500:
 *         description: Internal server error
 */
router.patch("/players/:id/makeAdmin", adminController.promoteToAdmin);

module.exports = router;
