module.exports = (sequelize, DataTypes) => {
  const ScoutKyc = sequelize.define('ScoutKyc', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull:false,
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
      type: DataTypes.STRING,
      allowNull:false
    },
    league: {
      type: DataTypes.STRING,
      allowNull:false
    },
    preferredPosition: {
      type: DataTypes.STRING,
      allowNull:false
    },
    preferredAge: {
      type: DataTypes.STRING,
      allowNull:false
    },
    socialMediaProfile: {
      type: DataTypes.STRING,
      allowNull:false
    },
  }, {
    tableName: 'ScoutKycs',
    timestamps: true,
  })
  return ScoutKyc;
};