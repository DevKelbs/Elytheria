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
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = require('socket.io')(server);

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

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use(express.static('public'));
app.use('/node_modules', express.static('node_modules'));

app.use(contentSecurityPolicy);

require('./public/config/passport')(passport);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const authRoutes = require('./public/routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const dbUrl = process.env.DATABASE_URL;
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const sessionStore = MongoStore.create({
  mongoUrl: dbUrl,
  collectionName: 'sessions',
});

const sessionSecret = process.env.SESSION_SECRET

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  }),
);

io.use((socket, next) => {
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })(socket.request, {}, next);
});

const Character = require('./public/models/character');
const User = require('./public/models/user');

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('createCharacter', async ({ userId, name, race }) => {
    try {
      const user = await User.findById(userId);
      const newCharacter = new Character({ name, race, user: user._id });
      await newCharacter.save();

      user.characters.push(newCharacter);
      await user.save();

      socket.emit('characterCreated', { success: true, character: newCharacter });
    } catch (err) {
      console.log('Error creating character:', err);
      socket.emit('characterCreated', { success: false, error: 'Error creating character' });
    }
  });

  socket.on("fetchAllCharacters", async (userId) => {
    if (!userId) {
      console.log("Error: userId is undefined");
      socket.emit("characterError", "Error fetching characters: userId is undefined");
      return;
    }

    console.log("Fetching characters for user:", userId);

    try {
      const characters = await Character.find({ user: userId });

      if (characters.length === 0) {
        // Redirect the user to the character creation page
        socket.emit("redirect", "/character_creation.html");
        return;
      } else {
        // Emit the characters data to the client
        socket.emit("charactersData", characters);
      }
    } catch (err) {
      console.log("Error fetching characters:", err);
      socket.emit("characterError", "Error fetching characters.");
    }
  });

  // ... (All other socket event handling)
});