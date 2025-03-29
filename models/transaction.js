module.exports = (sequelize, DataTypes) => {
  const TransactionModel = sequelize.define('Transaction', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'successful', 'failed'),
      defaultValue: 'pending',
    },
    paymentDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'Transactions',
    timestamps: true,
  });

  return TransactionModel;
};
