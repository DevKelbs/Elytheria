const express = require('express');
const router = express.Router();
const passport = require('passport');
const Character = require('../models/characters.js');
const User = require('../models/user.js'); // Import the User models
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

router.post('/create', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { name, race, faction } = req.body;

    // Check if all the required fields are provided
    if (!name || !race || !faction) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Create a new character and save it to the database
        const newCharacter = await Character.create({
            userId: req.user.id,
            name,
            race,
            faction
        });

        return res.status(200).json({ success: true, message: 'Character created successfully', character: newCharacter, });
    } catch (err) {
        console.error('Error creating character:', err);
        res.status(500).json({ success: false, message: 'Error creating character' });
    }
});

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const characters = await Character.findAll({
            where: { userId: req.user.id },
        });

        if (!characters) {
            return res.status(404).json({ success: false, message: 'No characters found' });
        }

        res.status(200).json({ success: true, characters });
    } catch (err) {
        console.error('Error fetching characters:', err);
        res.status(500).json({ success: false, message: 'Error fetching characters' });
    }
});

router.put('/update/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const id = req.params.id;
        const { level, totalxp, attack, attackxp, strength, strengthxp, defence, defencexp, hitpoints, hitpointsxp, ranged, rangedxp, magic, magicxp, prayer, prayerxp, slayer, slayerxp, woodcutting, woodcuttingxp, fishing, fishingxp, mining, miningxp, firemaking, firemakingxp, exploration, explorationxp, elementalism, elementalismxp, alchemy, alchemyxp, trading, tradingxp, taming, tamingxp, artificery, artificeryxp, runesmithing, runesmithingxp, archaeology, archaeologyxp, blacksmithing, blacksmithingxp, tailoring, tailoringxp, tinkery, tinkeryxp, cooking, cookingxp, farming, farmingxp, construction, constructionxp, fletching, fletchingxp, crafting, craftingxp, agility, agilityxp, hunter, hunterxp, thieving, thievingxp, inventory } = req.body;

        console.log('Updating character stats in DB:', level, totalxp, attack, attackxp, strength, strengthxp, defence, defencexp, hitpoints, hitpointsxp, ranged, rangedxp, magic, magicxp, prayer, prayerxp, slayer, slayerxp, woodcutting, woodcuttingxp, fishing, fishingxp, mining, miningxp, firemaking, firemakingxp, exploration, explorationxp, elementalism, elementalismxp, alchemy, alchemyxp, trading, tradingxp, taming, tamingxp, artificery, artificeryxp, runesmithing, runesmithingxp, archaeology, archaeologyxp, blacksmithing, blacksmithingxp, tailoring, tailoringxp, tinkery, tinkeryxp, cooking, cookingxp, farming, farmingxp, construction, constructionxp, fletching, fletchingxp, crafting, craftingxp, agility, agilityxp, hunter, hunterxp, thieving, thievingxp, inventory);
        const updatedCharacter = await Character.update({
            level,
            totalxp,
            attack,
            attackxp,
            strength,
            strengthxp,
            defence,
            defencexp,
            hitpoints,
            hitpointsxp,
            ranged,
            rangedxp,
            magic,
            magicxp,
            prayer,
            prayerxp,
            slayer,
            slayerxp,
            woodcutting,
            woodcuttingxp,
            fishing,
            fishingxp,
            mining,
            miningxp,
            firemaking,
            firemakingxp,
            exploration,
            explorationxp,
            elementalism,
            elementalismxp,
            alchemy,
            alchemyxp,
            trading,
            tradingxp,
            taming,
            tamingxp,
            artificery,
            artificeryxp,
            runesmithing,
            runesmithingxp,
            archaeology,
            archaeologyxp,
            blacksmithing,
            blacksmithingxp,
            tailoring,
            tailoringxp,
            tinkery,
            tinkeryxp,
            cooking,
            cookingxp,
            farming,
            farmingxp,
            construction,
            constructionxp,
            fletching,
            fletchingxp,
            crafting,
            craftingxp,
            agility,
            agilityxp,
            hunter,
            hunterxp,
            thieving,
            thievingxp,
            inventory
        }, {
            where: {
                id
            }
        });

        res.status(200).json({ message: 'Character stats updated in DB.', updatedCharacter });
    } catch (err) {
        console.error('Error updating character stats in DB:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.delete('/delete/:characterId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const characterId = req.params.characterId;
      const userId = req.user.id;
  
      const query = {
        text: 'DELETE FROM "Characters" WHERE id = $1 AND "userId" = $2 RETURNING *',
        values: [characterId, userId]
      };
  
      const { rows } = await pool.query(query);
  
      if (rows.length === 0) {
        return res.status(404).send({ error: 'Character not found' });
      }
  
      res.sendStatus(204);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal server error' });
    }
  });
  
  

module.exports = router;
