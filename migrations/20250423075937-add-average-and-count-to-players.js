// migrations/20250423xxxxxx-add-average-and-count-to-players.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add a FLOAT column for averageRating, defaulting existing rows to 0
    await queryInterface.addColumn('Players', 'averageRating', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });

    // Add an INTEGER column for totalRatingCount, defaulting existing rows to 0
    await queryInterface.addColumn('Players', 'totalRatingCount', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the columns if you ever rollback
    await queryInterface.removeColumn('Players', 'averageRating');
    await queryInterface.removeColumn('Players', 'totalRatingCount');
  }
};
