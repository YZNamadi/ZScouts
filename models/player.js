const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('../database/sequelize');
const Rating = require('./rating')

class Player extends Model {}

Player.init(
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
    age: {
      type: DataTypes.STRING,
      allowNull:false
    },
    nationality: {
      type: DataTypes.STRING,
      defaultValue: Nigerian
    },
    currentTeam: {
      type: DataTypes.STRING,
      allowNull:false
    },
    pastTeams: {
      type: DataTypes.JSON,
      allowNull:false
    },
    coachesWorkedWith: {
      allowNull:false,
      type: DataTypes.JSON,
      coachName:{
        type: DataTypes.STRING
      },
      coachNumber:{
        type: DataTypes.STRING
      }
    },
    primaryPosition: {
      type: DataTypes.STRING,
      allowNull:false
    },
    secondaryPosition: {
      type: DataTypes.STRING,
      allowNull:false
    },
    dominantFoot: {
      type:DataTypes.ENUM('left', 'right', 'both')
    },
    strengths: {
      type:DataTypes.STRING,
      allowNull:false
    },
    weaknesses: {
      type: DataTypes.STRING,
      allowNull:false
    },
    media: {
      type: DataTypes.STRING,
      allowNull:false
    },
    averageRating: {
      type: DataTypes.DECIMAL,
      allowNull:true,
      defaultValue:0.0
    },
    totalRatingCount: {
      type: DataTypes.INTEGER,
      defaultValue:0
    },
    createdAt: {
      allowNull: false,
      type:DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type:DataTypes.DATE
    }
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Player', // We need to choose the model name
    tableName:'Players'
  },
);
Player.belongsTo(Rating, { foreignKey: 'playerId' });

module.exports = Player;