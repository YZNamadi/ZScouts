// models/rating.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    playerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Players',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    scoutId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Scouts',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    ratingScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        isInt: true,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'Ratings',
    timestamps: true,
  });

  Rating.associate = function(models) {
    Rating.belongsTo(models.Player, { foreignKey: 'playerId' });
    Rating.belongsTo(models.Scout, { foreignKey: 'scoutId' });
  };

  return Rating;
};
