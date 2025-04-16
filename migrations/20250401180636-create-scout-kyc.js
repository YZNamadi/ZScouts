module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ScoutKycs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      scoutId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      nationality: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull:false
      },
      verificationDocument: {
        type: Sequelize.TEXT,
        allowNull:false
      },
      clubName: {
        type: Sequelize.STRING,
        allowNull:false
      },
      scoutingRole: {
        type: Sequelize.STRING,
        allowNull:false
      },
      league: {
        type: Sequelize.STRING,
        allowNull:false
      },
      preferredPosition: {
        type: Sequelize.STRING,
        allowNull:false
      },
      age: {
        type: Sequelize.STRING,
        allowNull:false
      },
      socialMediaProfile: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('ScoutKycs');
  }
};