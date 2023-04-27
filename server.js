// Load environment variables from the .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const http = require('http');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./database.js'); // Path to your database.js file
const jwt = require('jsonwebtoken');

// Initialize express app
const app = express();
const server = http.createServer(app);
const sessionStore = new SequelizeStore({
  db: sequelize,
});

// Set up express-session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport.js and set up its middleware
app.use(passport.initialize());
app.use(passport.session());

// Sync the session store with the database
sessionStore.sync();

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
app.use(express.static('public'));
app.use('/node_modules', express.static('node_modules'));
app.use(express.static('routes'));
app.use(express.static('routes'));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(contentSecurityPolicy);

require('./config/passport.js')(passport);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const authRoutes = require('./routes/authRoutes.js');
const characterRoutes = require('./routes/characterRoutes.js');
app.use('/api/auth', authRoutes);
app.use('/api/characters', authenticateToken, characterRoutes);
app.use('/api/update', authenticateToken, characterRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//JWT Authentication Verification process
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// Sync the models with the database
sequelize.sync({ force: false }) // Set force to true if you want to recreate tables on every startup
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

io.use((socket, next) => {
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })(socket.request, {}, next);
});

const Character = require('./models/characters.js');
const User = require('./models/user.js');

io.on('connection', (socket) => {

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
        socket.emit("redirect", "/characterCreation.html");
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