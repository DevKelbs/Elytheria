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
    totalxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    attack: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    attackxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    strength: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    strengthxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    defence: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    defencexp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    hitpoints: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
    },
    hitpointsxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    ranged: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    rangedxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    magic: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    magicxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    prayer: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    prayerxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    slayer: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    slayerxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    woodcutting: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    woodcuttingxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    fishing: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    fishingxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    mining: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    miningxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    firemaking: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    firemakingxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    exploration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    explorationxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    elementalism: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    elementalismxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    alchemy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    alchemyxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    trading: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    tradingxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    taming: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    tamingxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    artificery: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    artificeryxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    runesmithing: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    runesmithingxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    archaeology: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    archaeologyxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    blacksmithing: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    blacksmithingxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    tailoring: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    tailoringxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    tinkery: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    tinkeryxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    cooking: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    cookingxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    farming: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    farmingxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    construction: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    constructionxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    fletching: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    fletchingxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    crafting: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    craftingxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    agility: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    agilityxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    hunter: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    hunterxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    thieving: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    thievingxp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    inventory: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
    },
    // Add other fields as needed
    // ...
});

module.exports = Character;
