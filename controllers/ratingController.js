// controllers/ratingController.js
'use strict';
const { Rating, Player } = require('../models');

// Helper to load player or throw a 404
const findPlayer = async (playerId) => {
  const player = await Player.findByPk(playerId);
  if (!player) {
    const err = new Error('Player not found');
    err.status = 404;
    throw err;
  }
  return player;
};

const ratePlayer = async (req, res) => {
  try {
    const { id: playerId } = req.params;
    const { ratingScore, comment } = req.body;
    const scoutId = req.user.id;

    // 1) ratingScore must exist, be int, between 1–5
    if (ratingScore === undefined) {
      return res.status(400).json({ message: 'ratingScore is required' });
    }
    const rating = parseInt(ratingScore, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'ratingScore must be an integer between 1 and 5' });
    }

    // 2) player must exist
    const player = await findPlayer(playerId);

    // 3) prevent same scout from rating twice
    const existing = await Rating.findOne({ where: { playerId, scoutId } });
    if (existing) {
      return res.status(400).json({ message: 'You have already rated this player' });
    }

    // 4) create the rating
    const newRating = await Rating.create({
      playerId,
      scoutId,
      ratingScore: rating,
      comment: comment || null,
    });

    // 5) recalc and save averages on player
    const allRatings = await Rating.findAll({ where: { playerId } });
    const totalCount = allRatings.length;
    const totalScore = allRatings.reduce((sum, r) => sum + r.ratingScore, 0);

    player.averageRating    = totalScore / totalCount;
    player.totalRatingCount = totalCount;
    await player.save();

    // 6) return new rating + updated stats so frontend can refresh immediately
    return res.status(201).json({
      message: 'Rating submitted successfully',
      rating: newRating,
      averageRating:    player.averageRating,
      totalRatingCount: player.totalRatingCount,
    });
  } catch (err) {
    console.error('Error while rating player:', err);
    if (err.status === 404) {
      return res.status(404).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { ratePlayer };
