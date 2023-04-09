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
