'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ratings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      playerId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      scoutId: {
        type: Sequelize.UUID,
        allowNull: false,
        
      },
      ratingScore: {
        type: Sequelize.DECIMAL,
        allowNull:true,
        validate:{
          min:1.0,
          max:5.0
        },
      },
      comment: {
        type: Sequelize.STRING,
        allowNull:true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Ratings');
  }
};