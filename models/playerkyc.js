module.exports = (sequelize, DataTypes) => {
  const PlayerKyc = sequelize.define('PlayerKyc', {
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
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    age: {
      type: DataTypes.STRING,
      allowNull:false

    },
    gender:{
      type: DataTypes.ENUM('male', 'female'),
      allowNull:false
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull:false,
      defaultValue:"Nigerian",

    },
    height:{
      type: DataTypes.STRING,
      allowNull:false
    },
    weight: {
      type: DataTypes.STRING,
      allowNull:false
    },
    preferredFoot: {
      type: DataTypes.ENUM('left', 'right', 'both'),
      allowNull:false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull:false
    },
    homeAddress: {
      type: DataTypes.STRING,
      allowNull:false
    },
    primaryPosition: {
      type: DataTypes.ENUM('GK','DEF','MF','ST'),
      allowNull:false
    },
    secondaryPosition: {
      type: DataTypes.ENUM('GK','DEF','MF','ST'),
      allowNull:false
    },
    currentClub: {
      type: DataTypes.STRING,
      allowNull:false
    },
    ability:{
      type: DataTypes.ENUM('dribbling', 'passing', 'shooting', 'defending', 'stamina', 'speed'),
      allowNull:false
    },
    contactInfoOfCoaches: {
      type: DataTypes.STRING,
      allowNull:false
    },
    media: {
      type: DataTypes.STRING,
      allowNull:true
    },
    openToTrials:{
      type: DataTypes.ENUM('YES','NO'),
      allowNull:false
    },
    followDiet: {
      type: DataTypes.ENUM('YES','NO'),
      allowNull:false
    },
    willingToRelocate: {
      type: DataTypes.ENUM('YES','NO'),
      allowNull:false
    },
    profilePic:{
      type: DataTypes.STRING,
      allowoNull:false
    },
    videoUpload:{
      type: DataTypes.STRING,
      allowoNull:false,
    },
  }, {
    tableName: 'PlayerKycs',
    timestamps: true,
  })
  return PlayerKyc;
};