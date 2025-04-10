const { Rating, Player } = require('../models');

// Helper function to find a player by ID
const findPlayer = async (playerId) => {
  const player = await Player.findByPk(playerId);
  if (!player) {
    throw new Error('Player not found');
  }
  return player;
};

// Rate a player
const ratePlayer = async (req, res) => {
  try {
    const { id: playerId } = req.params;
    const { ratingScore, comment } = req.body;
    const scoutId = req.user.id; // Assuming scout's ID is stored in req.user

    // Ensure ratingScore is an integer
    const rating = parseInt(ratingScore, 10);

    // Validate if player exists
    const player = await findPlayer(playerId);

    // Rating score validation (between 1 and 5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating score must be between 1 and 5' });
    }

    // Prevent duplicate ratings by the same scout for the same player
    const existingRating = await Rating.findOne({ where: { playerId, scoutId } });
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this player' });
    }

    // Save the rating
    await Rating.create({ playerId, scoutId, ratingScore: rating, comment });

    // Update player's average rating
    const allRatings = await Rating.findAll({ where: { playerId } });
    const totalScore = allRatings.reduce((sum, rating) => sum + rating.ratingScore, 0);
    const totalCount = allRatings.length;
    player.averageRating = totalScore / totalCount;
    player.totalRatingCount = totalCount;
    await player.save();

    return res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Error while rating player:', error.message);

    // If the player is not found
    if (error.message === 'Player not found') {
      return res.status(404).json({ message: error.message });
    }

    // Handle other errors
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { ratePlayer };
