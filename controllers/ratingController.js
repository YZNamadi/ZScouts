const Rating = require("../models/rating");
const Player = require("../models/player");


exports.ratePlayer = async (req, res) => {
  try {
    const { id: playerId } = req.params;
    const { ratingScore, comment } = req.body;
    const scoutId = req.user.id; // Assume scout is authenticated

    // Validate if player exists
    const player = await Player.findByPk(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Prevent duplicate ratings
    const existingRating = await Rating.findOne({ where: { playerId, scoutId } });
    if (existingRating) {
      return res.status(400).json({ message: "You have already rated this player" });
    }

    // Save rating
    await Rating.create({ playerId, scoutId, ratingScore, comment });

    // Update player's average rating
    const allRatings = await Rating.findAll({ where: { playerId } });
    const totalScore = allRatings.reduce((sum, rating) => sum + rating.ratingScore, 0);
    const totalCount = allRatings.length;
    player.averageRating = totalScore / totalCount;
    player.totalRatingCount = totalCount;
    await player.save();

    return res.status(201).json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error("Error rating player:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.commentOnPlayer = async (req, res) => {
  try {
    const { id: playerId } = req.params;
    const { comment } = req.body;
    const scoutId = req.user.id; // Assume scout is authenticated

    // Validate if player exists
    const player = await Player.findByPk(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Save comment
    await Rating.create({ playerId, scoutId, comment });

    return res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
