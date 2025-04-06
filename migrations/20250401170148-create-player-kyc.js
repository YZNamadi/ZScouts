module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PlayerKycs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      age: {
        type: Sequelize.STRING,
        allowNull:false

      },
      nationality: {
        type: Sequelize.STRING,
        allowNull:false,
        defaultValue:"Nigerian",

      },
      height: {
        type: Sequelize.STRING,
        allowNull:false
      },
      weight: {
        type: Sequelize.STRING,
        allowNull:false
      },
      preferredFoot: {
        type: Sequelize.STRING,
        allowNull:false
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull:false
      },
      homeAddress: {
        type: Sequelize.STRING,
        allowNull:false
      },
      primaryPosition: {
        type: Sequelize.ENUM('GK','DEF','MF','ST'),
        allowNull:false
      },
      secondaryPosition: {
        type: Sequelize.STRING,
        allowNull:false
      },
      currentClub: {
        type: Sequelize.STRING,
        allowNull:false
      },
      strengths: {
        type: Sequelize.STRING,
        allowNull:false
      },
      coachesWorkedWith: {
        type: Sequelize.STRING,
        allowNull:false
      },
      media: {
        type: Sequelize.STRING,
        allowNull:false
      },
      opentotrials: {
        type: Sequelize.ENUM('YES','NO'),
        allowNull:false
      },
      followDiet: {
        type: Sequelize.ENUM('YES','NO'),
        allowNull:false
      },
      willingToRelocate: {
        type: Sequelize.ENUM('YES','NO'),
        allowNull:false
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
    await queryInterface.dropTable('PlayerKycs');
  }
};