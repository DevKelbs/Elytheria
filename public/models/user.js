const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Path to your database.js file
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verificationtoken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isverified: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  // Add other fields as needed
  // ...
});

User.beforeCreate(async (user, options) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

User.prototype.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    console.error("Error comparing passwords:", err);
    return false;
  }
};

User.getUserByUsername = async function (username) {
  try {
    const user = await this.findOne({ where: { username } });
    return user;
  } catch (err) {
    throw err;
  }
};

module.exports = User;
