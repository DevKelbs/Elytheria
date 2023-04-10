const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

// Register route
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    const newUser = new User({
        username,
        email,
        password,
    });

    newUser.save()
        .then((user) => {
            res.json({ success: true, msg: 'User registered' });
        })
        .catch((err) => {
            res.status(400).json({ success: false, msg: 'Failed to register user' });
        });
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);

        if (isMatch) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.json({
                success: true,
                token: `Bearer ${token}`,
                user: {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                },
            });
        } else {
            return res.status(401).json({ success: false, msg: 'Wrong password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
});

module.exports = router;
