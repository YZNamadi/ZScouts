module.exports = (sequelize, DataTypes) => {
  const Scout = sequelize.define('Scout', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: true,
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
    // Optional fields:
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clubORorganization: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    yearsOfExpereince: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationDocument: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    // role field is required
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'Scouts',
    timestamps: true,
  });

  return Scout;
};
