const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Path to your database.js file
const Character = require('./characters');

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
    hitpoints: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
    },
    ranged: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    magic: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    prayer: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    slayer: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    woodcutting: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    fishing: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    firemaking: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    cooking: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    mining: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    thieving: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    fletching: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    crafting: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    runecrafting: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    herblore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    agility: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
});

// Establish associations between the Character and Stats models
Stats.belongsTo(Character, { foreignKey: 'characterId' });
module.exports = Stats;