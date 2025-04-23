'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change ratingScore from DECIMAL(nullable) → INTEGER(non-nullable)
    await queryInterface.changeColumn('Ratings', 'ratingScore', {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        isInt: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert back to DECIMAL(nullable)
    await queryInterface.changeColumn('Ratings', 'ratingScore', {
      type: Sequelize.DECIMAL,
      allowNull: true,
      validate: {
        min: 1.0,
        max: 5.0
      }
    });
  }
};
