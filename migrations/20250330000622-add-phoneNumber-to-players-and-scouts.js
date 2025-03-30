module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Players', 'phoneNumber', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Scouts', 'phoneNumber', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Players', 'phoneNumber');
    await queryInterface.removeColumn('Scouts', 'phoneNumber');
  }
};
