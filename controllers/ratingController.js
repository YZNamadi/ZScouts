const {Rating} = require("../models");
const {Player} = require("../models");

const findPlayer = async (playerId) => {
  const player = await Player.findByPk(playerId);
  if (!player) throw new Error("Player not found");
  return player;
};

exports.ratePlayer = async (req, res) => {
  try {
    const { id: playerId } = req.params;
    const { ratingScore, comment } = req.body;
    const scoutId = req.user.id;

    // Ensure ratingScore is an integer
    const rating = parseInt(ratingScore, 10);

    // Validate if player exists
    const player = await findPlayer(playerId); 

    // Rating score validation
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating score must be between 1 and 5" });
    }

    // Prevent duplicate ratings
    const existingRating = await Rating.findOne({ where: { playerId, scoutId } });
    if (existingRating) {
      return res.status(400).json({ message: "You have already rated this player" });
    }

    // Save rating
    await Rating.create({ playerId, scoutId, ratingScore: rating, comment });

    // Update player's average rating
    const allRatings = await Rating.findAll({ where: { playerId } });
    const totalScore = allRatings.reduce((sum, rating) => sum + rating.ratingScore, 0);
    const totalCount = allRatings.length;
    player.averageRating = totalScore / totalCount;
    player.totalRatingCount = totalCount;
    await player.save();

    return res.status(201).json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error("Error while rating player:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
