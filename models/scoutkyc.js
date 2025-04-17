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
    age: {
      type: DataTypes.STRING,
      allowNull:false
    },
    socialMediaProfile: {
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