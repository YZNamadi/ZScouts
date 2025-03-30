module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ratings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      playerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Players',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      scoutId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Scouts',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      ratingScore: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        validate: {
          min: 1.0,
          max: 5.0
        },
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: true
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
