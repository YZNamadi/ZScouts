'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('PlayerKycs', 'media', {
      type: Sequelize.STRING, // or Sequelize.TEXT/Sequelize.JSON, whatever you’re using
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('PlayerKycs', 'media', {
      type: Sequelize.STRING, // same type again
      allowNull: false,
    });
  }
};
