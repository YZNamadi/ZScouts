const { Sequelize, DataTypes, Model, Transaction } = require('sequelize');
const sequelize = ('../sequelize/database');

class Transaction extends Model {}

Transaction.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull:false
    },
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull:false
    },
    amount:{
      type: DataTypes.INTEGER,
      allowNull:false
    },
    
    reference: {
      type: DataTypes.STRING,
      allowNull:false
    },
    status: {
      type: DataTypes.ENUM('pending','successful','failed'),
      defaultValue:'pending'
    },
    paymentDate: {
      type: DataTypes.STRING,
      allowNull:false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Transaction', // We need to choose the model name
    tableName: 'Transactions'
  },
);

module.exports = Transaction;