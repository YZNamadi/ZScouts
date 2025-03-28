const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = ('../database/sequelize');
const Rating = ('./rating');


class Scout extends Model {}

Scout.init(
  {
    // Model attributes are defined here
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull:false
    },
    email: {
      type: DataTypes.STRING,
      allowNull:false
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull:false
    },
    clubORorganization: {
      type: DataTypes.STRING,
      allowNull:false
    },
    country: {
      type: DataTypes.STRING,
      allowNull:false
    },
    yearsOfExpereince: {
      type: DataTypes.STRING,
      allowNull:false
    },
    verificationDocument: {
      type: DataTypes.STRING,
      allowNull:false
    },
    bio: {
      type: DataTypes.STRING,
      allowNull:true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue:false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type:DataTypes.DATE
    }
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Scout', // We need to choose the model name
    tableName: 'Scouts'
  },
);

Scout.hasMany(Rating, { foreignKey: 'id', as: 'Player' });

module.exports = Scout;