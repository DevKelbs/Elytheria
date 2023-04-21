const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Path to your database.js file
const Character = require('./character');

const Stats = sequelize.define('Stats', {
    characterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Characters', // The name of the Character model, ensure it matches the exported name
            key: 'id',
        },
    },
    attack: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    strength: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    defence: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
});

// Establish associations between the Character and Stats models
Stats.belongsTo(Character, { foreignKey: 'characterId' });
module.exports = Stats;