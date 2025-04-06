const bcrypt = require('bcryptjs');

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
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profileCompletion: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'Scouts',
    timestamps: true,
  });

  //  Password comparison method
  Scout.prototype.verifyPassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

  return Scout;
};
