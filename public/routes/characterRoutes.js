const express = require('express');
const router = express.Router();
const passport = require('passport');
const Character = require('../models/characters.js');
const Stats = require('../models/stats.js')
const User = require('../models/user.js'); // Import the User model

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

        const statsInstance = await Stats.create({
            characterId: newCharacter.id,
          });

        return res.status(200).json({ success: true, message: 'Character created successfully', character: newCharacter, stats: statsInstance });
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




module.exports = router;
