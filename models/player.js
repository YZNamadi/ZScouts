module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define('Player', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileCompletion:{
      type: DataTypes.BOOLEAN,
      defaultValue:false,
    },
  }, {
    tableName: 'Players',
    timestamps: true,
  });

  return Player;
};
