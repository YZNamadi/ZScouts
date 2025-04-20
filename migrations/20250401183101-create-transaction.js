module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      playerId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      scoutId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull:false
      },
      name: {
        type: Sequelize.STRING,
        allowNull:false
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull:false

      },
      reference: {
        type: Sequelize.STRING,
        allowNull:false
      },
      status: {
        type: Sequelize.ENUM('pending','success','failed'),
        allowNull:false,
        defaultValue:'pending'
      },
      paymentDate: {
        type: Sequelize.STRING,
        allowNull:false
      },
      upgradeToPremium:{
        type: Sequelize.STRING,
        defaultValue: false
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
    await queryInterface.dropTable('Transactions');
  }
};