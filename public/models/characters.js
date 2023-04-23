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
    faction: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    experience: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    mining: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    firemaking: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    exploration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    elementalism: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    alchemy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    trading: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    taming: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    artificery: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    runesmithing: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    archaeology: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    blacksmithing: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    tailoring: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    tinkery: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    cooking: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    farming: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    construction: {
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
    agility: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    hunter: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    thieving: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    // Add other fields as needed
    // ...
});

module.exports = Character;
