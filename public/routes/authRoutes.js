const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');
const bcrypt = require("bcrypt");
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

// register route
router.post('/register', async (req, res) => {
    const { email, username, password, verificationtoken } = req.body;

    if (!email || !username || !password || !verificationtoken) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const newUser = await User.create({ email, username, password, verificationtoken });
        return res.status(200).json({ success: true, user: newUser });

    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Error registering user' });
    }
});

router.post('/send-verification-email', async (req, res) => {
  const { email, verificationtoken } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'kcorrwc@gmail.com',
    to: email,
    subject: 'Verify your account',
    html: `<p>Please click on the following link to verify your account:</p><br/><a href="http://localhost:3000/api/auth/verify/${verificationtoken}">http://localhost:3000/api/auth/verify/${verificationtoken}</a>`,
  };

  const result = await transporter.sendMail(mailOptions);
  console.log(`Verification email sent to ${email}: ${result.messageId}`);

  res.send('Verification email sent');
});

router.get('/verify/:verificationtoken', async (req, res) => {
    const verificationtoken = req.params.verificationtoken;
    
    try {
      const result = await pool.query('SELECT * FROM "Users" WHERE verificationtoken = $1', [verificationtoken]);
      if (result.rowCount === 0) {
        return res.status(400).json({ msg: 'Invalid verification token.' });
      }
    
      const user = result.rows[0];
      if (user.isverified) {
        return res.status(400).json({ msg: 'User is already verified.' });
      }
    
      await pool.query('UPDATE "Users" SET isverified = true, verificationtoken = NULL WHERE id = $1', [user.id]);
    
      return res.status(200).json({ msg: 'User successfully verified.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Internal Server Error.' });
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

      if (!user.isverified) {
          return res.json({ success: false, msg: 'User is not verified' });
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
