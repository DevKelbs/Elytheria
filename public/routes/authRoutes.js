const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const bcrypt = require("bcrypt");

// Register route
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, msg: "Email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        console.log('New user password hash:', newUser.password);

        await newUser.save();

        // Sign a token for the registered user
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            success: true,
            msg: "User registered",
            token: `Bearer ${token}`,
            user: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username,
            },
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, msg: "Failed to register user" });
    }
}); // <-- Add the missing closing bracket here

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        console.log('Candidate password:', password);

        const isMatch = await user.comparePassword(password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

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
