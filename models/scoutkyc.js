module.exports = (sequelize, DataTypes) => {
  const ScoutKyc = sequelize.define('ScoutKyc', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
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
    gender:{
      type: DataTypes.ENUM('male', 'female'),
      allowNull:false
    },
    nationality:{
      type: DataTypes.STRING,
      allowNull:false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull:false
    },
    verificationDocument: {
      type: DataTypes.TEXT,
      allowNull:false
    },
    clubName: {
      type: DataTypes.STRING,
      allowNull:false
    },
    scoutingRole: {
      type: DataTypes.ENUM('video scout','talent scout', 'technical scout', 'internationl scout', 'first team scout'), 
      allowNull:false
    },
    league: {
      type: DataTypes.STRING,
      allowNull:false
    },
    preferredPosition: {
      type: DataTypes.ENUM('GK','DEF','MF','ST'),
      allowNull:false
    },
    age: {
      type: DataTypes.STRING,
      allowNull:false
    },
    profilePic:{
      type: DataTypes.STRING,
      allowoNull: true
    }

  }, {
    tableName: 'ScoutKycs',
    timestamps: true,
  })
  return ScoutKyc;
};