module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define('Video', {
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
    videoUpload: {
      type: DataTypes.STRING,
      allowNull:true
    },
  }, {
    tableName: 'Videos',
    timestamps: true,
  })
  return Video;
};