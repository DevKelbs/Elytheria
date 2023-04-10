// Load environment variables from the .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const http = require('http');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = require('socket.io')(server);

// Middleware setup
// Body-parser middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS middleware to enable Cross-Origin Resource Sharing
app.use(cors());

// Passport middleware for handling authentication
app.use(passport.initialize());

// Serve static files from the public directory
app.use(express.static('public'));

// Define the Content Security Policy middleware
const contentSecurityPolicy = (req, res, next) => {
  res.header(
    'Content-Security-Policy',
    "default-src 'self';" +
    "img-src 'self' data:;" +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;" +
    "script-src 'self' https://kit.fontawesome.com;" +
    "font-src 'self' https://fonts.gstatic.com;"
  );
  next();
};

// Apply the Content Security Policy middleware
app.use(contentSecurityPolicy);

// Routes
// Serve the index.html file located in the public folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Import authRoutes
const authRoutes = require('./public/routes/authRoutes');

// Use authRoutes with /api/auth prefix
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Connect to MongoDB
const dbUrl = process.env.DATABASE_URL;
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const Character = require('./public/models/character');
const User = require('./public/models/user');

// Socket.io connection event
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('createCharacter', async ({ userId, name, race }) => {
    try {
      const user = await User.findById(userId);
      const newCharacter = new Character({ name, race, user: user._id });
      await newCharacter.save();

      user.characters.push(newCharacter);
      await user.save();

      // Emit an event to notify the client that the character has been created
      socket.emit('characterCreated', { success: true, character: newCharacter });
    } catch (err) {
      console.log('Error creating character:', err);
      socket.emit('characterCreated', { success: false, error: 'Error creating character' });
    }
  });


  app.get('/api/characters/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
      const user = await User.findById(userId).populate('characters');
      res.json({ success: true, characters: user.characters });
    } catch (err) {
      console.log('Error fetching characters:', err);
      res.status(500).json({ success: false, error: 'Error fetching characters' });
    }
  });

  // ... (All other socket event handling)
});