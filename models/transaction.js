module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING,
      allowNull:false
    },
    name: {
      type: DataTypes.STRING,
      allowNull:false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull:false

    },
    reference: {
      type: DataTypes.STRING,
      allowNull:false
    },
    status: {
      type: DataTypes.ENUM('pending','success','failed'),
      allowNull:false,
      defaultValue:'pending'
    },
    paymentDate: {
      type: DataTypes.STRING,
      allowNull:false
    },
  }, {
    tableName: 'Transactions',
    timestamps: true,
  })
  return Transaction;
};