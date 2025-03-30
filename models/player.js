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
    // All fields below are optional
    // phoneNumber: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    //  },
    // age: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // nationality: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    //   defaultValue: 'Nigerian',
    // },
    // currentTeam: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // pastTeams: {
    //   type: DataTypes.JSON,
    //   allowNull: true,
    // },
    // coachesWorkedWith: {
    //   type: DataTypes.JSON,
    //   allowNull: true,
    // },
    // primaryPosition: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // secondaryPosition: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // dominantFoot: {
    //   type: DataTypes.ENUM('left', 'right', 'both'),
    //   allowNull: true,
    // },
    // strengths: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // weaknesses: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // media: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // averageRating: {
    //   type: DataTypes.DECIMAL,
    //   allowNull: true,
    //   defaultValue: 0.0,
    // },
    // totalRatingCount: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    //   defaultValue: 0,
    // },
    
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'Players',
    timestamps: true,
  });

  return Player;
};
