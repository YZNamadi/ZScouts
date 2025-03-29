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
        model: 'Players', // Must match the Player table name
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    scoutId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Scouts', // Must match the Scout table name
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    ratingScore: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      validate: {
        min: 1.0,
        max: 5.0,
      },
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'Ratings',
    timestamps: true,
  });

  return Rating;
};
