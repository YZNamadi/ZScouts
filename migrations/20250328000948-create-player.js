'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Players', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull:false
      },
      email: {
        type: Sequelize.STRING,
        allowNull:false
      },
      password: {
        type: Sequelize.STRING,
        allowNull:false
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull:false
      },
      age: {
        type: Sequelize.STRING,
        allowNull:false
      },
      nationality: {
        type: Sequelize.STRING,
        defaultValue: Nigerian
      },
      currentTeam: {
        type: Sequelize.STRING,
        allowNull:false
      },
      pastTeams: {
        type: Sequelize.STRING,
        allowNull:false
      },
      coachesWorkedWith: {
        allowNull:false,
        type: Sequelize.JSON,
        coachName:{
          type: Sequelize.STRING
        },
        coachNumber:{
          type: Sequelize.STRING
        }
      },
      primaryPosition: {
        type: Sequelize.STRING,
        allowNull:false
      },
      secondaryPosition: {
        type: Sequelize.STRING,
        allowNull:false
      },
      dominantFoot: {
        type: Sequelize.ENUM('left', 'right', 'both')
      },
      strengths: {
        type: Sequelize.STRING,
        allowNull:false
      },
      weaknesses: {
        type: Sequelize.STRING,
        allowNull:false
      },
      media: {
        type: Sequelize.STRING,
        allowNull:false
      },
      averageRating: {
        type: Sequelize.DECIMAL,
        allowNull:true,
        defaultValue:0.0
      },
      totalRatingCount: {
        type: Sequelize.INTEGER,
        defaultValue:0
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
    await queryInterface.dropTable('Players');
  }
};