const express = require('express');
const router = express.Router();
const passport = require('passport');
const Character = require('../models/character.js');
const User = require('../models/user.js'); // Import the User model

router.post('/create', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { name, class: characterClass, color } = req.body;

    // Check if all the required fields are provided
    if (!name || !characterClass || !color) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Create a new character and save it to the database
        const newCharacter = await Character.create({
            userId: req.user.id,
            name,
            class: characterClass,
            color,
        });

        return res.status(200).json({ success: true, message: 'Character created successfully', character: newCharacter });
    } catch (err) {
        console.error('Error creating character:', err);
        res.status(500).json({ success: false, message: 'Error creating character' });
    }
});

module.exports = router;
