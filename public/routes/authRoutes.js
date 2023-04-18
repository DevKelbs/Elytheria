const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const bcrypt = require("bcrypt");

// register route
router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const newUser = await User.create({ email, username, password });
        return res.status(200).json({ success: true, user: newUser });

    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Error registering user' });
    }
});



// authenticate route
router.post('/authenticate', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (isMatch) {
            const token = jwt.sign(user.get(), process.env.JWT_SECRET, {
                expiresIn: 604800 // 1 week
            });

            res.json({
                success: true,
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                }
            });
        } else {
            return res.json({ success: false, msg: 'Wrong password' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: 'An error occurred' });
    }
});

// profile route
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;
