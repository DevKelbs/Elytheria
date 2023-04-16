const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Path to your database.js file

const Character = sequelize.define('Character', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // The name of the User model, ensure it matches the exported name
            key: 'id',
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    race: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    class: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Add other fields as needed
    // ...
});

module.exports = Character;
