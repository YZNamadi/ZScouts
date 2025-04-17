'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('PlayerKycs', 'playerId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Players',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('PlayerKycs', 'playerId');
  }
};
