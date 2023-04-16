const express = require('express');
const router = express.Router();
const passport = require('passport');
const Character = require('../models/character.js');
const User = require('../models/user.js'); // Import the User model

router.post('/create', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { name, class: characterClass, eyeColor, hairColor, skinColor } = req.body;

    // Check if all the required fields are provided
    if (!name || !characterClass || !eyeColor || !hairColor || !skinColor) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Create a new character and save it to the database
        const newCharacter = await Character.create({
            userId: req.user.id,
            name,
            class: characterClass,
            hairColor,
            skinColor,
            eyeColor
        });

        return res.status(200).json({ success: true, message: 'Character created successfully', character: newCharacter });
    } catch (err) {
        console.error('Error creating character:', err);
        res.status(500).json({ success: false, message: 'Error creating character' });
    }
});

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const characterId = req.params.id;
        const character = await Character.findOne({
            where: { id: characterId, userId: req.user.id },
        });

        if (!character) {
            return res.status(404).json({ success: false, message: 'Character not found' });
        }

        res.status(200).json({ success: true, character });
    } catch (err) {
        console.error('Error fetching character:', err);
        res.status(500).json({ success: false, message: 'Error fetching character' });
    }
});



module.exports = router;
