module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PlayerKycs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      playerId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      age: {
        type: Sequelize.STRING,
        allowNull:false

      },
      gender:{
        type: Sequelize.ENUM('male', 'female'),
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
        type: Sequelize.ENUM('left', 'right', 'both'),
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
        type: Sequelize.ENUM('GK','DEF','MF','ST'),
        allowNull:false
      },
      currentClub: {
        type: Sequelize.STRING,
        allowNull:false
      },
      ability: {
        type: Sequelize.ENUM('dribbling', 'passing', 'shooting', 'defending', 'stamina', 'speed'),
        allowNull:false
      },
      contactInfoOfCoaches: {
        type: Sequelize.STRING,
        allowNull:false
      },
      media: {
        type: Sequelize.STRING,
        allowNull:true
      },
      openToTrials: {
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
      profilePic:{
        type: Sequelize.STRING,
        allowoNull:false
      },
      videoUpload:{
        type: Sequelize.STRING,
        allowoNull:true
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