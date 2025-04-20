module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    playerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Players',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    scoutId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Scouts',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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
    upgradeToPremium:{
      type: DataTypes.STRING,
      defaultValue: false
    },
  }, {
    tableName: 'Transactions',
    timestamps: true,
  })
  return Transaction;
};