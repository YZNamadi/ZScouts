const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('../database/sequelize');
const Player = require('./player');
const Scout = require('./scout')

class Rating extends Model {}

Rating.init(
  {
    // Model attributes are defined here
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    playerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Players',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    scoutId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Scouts',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    ratingScore: {
      type: DataTypes.DECIMAL,
      allowNull:true,
      validate:{
        min:1.0,
        max:5.0
      },
    },
    comment: {
      type: DataTypes.STRING,
      allowNull:true
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
    modelName: 'Rating', // We need to choose the model name
    tableName: 'Ratings'
  },
);

module.exports = Rating;