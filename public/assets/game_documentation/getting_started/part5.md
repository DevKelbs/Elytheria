5. Implementing User Accounts and Game Storage

1. Set up your development environment:
	○ Ensure that you have Node.js and npm installed on your machine. If not, download and install them from https://nodejs.org/
	○ Install MongoDB Community Server from https://www.mongodb.com/try/download/community
	○ Create a new folder for your project and navigate to it in the terminal.


2. Initialize your project:
	○ Run npm init to create a package.json file that will manage your project dependencies.


3. Install necessary dependencies:
	○ Install Express.js for creating a web application: npm install express
	○ Install Mongoose for MongoDB object modeling: npm install mongoose
	○ Install Passport.js for authentication: npm install passport passport-local
	○ Install bcrypt for password hashing: npm install bcrypt
	○ Install jsonwebtoken for JWT-based authentication: npm install jsonwebtoken
	○ Install body-parser for parsing incoming request bodies: npm install body-parser
	○ Install CORS middleware for cross-origin requests: npm install cors


4. Set up your server:
	○ Create a new file called server.js in your project folder and add the following code:


	const express = require('express');
	const bodyParser = require('body-parser');
	const cors = require('cors');
	const mongoose = require('mongoose');
	const passport = require('passport');
	
	// Initialize express app
	const app = express();
	
	// Middleware setup
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(cors());
	app.use(passport.initialize());
	
	// Connect to MongoDB
	mongoose
	  .connect('mongodb://localhost:27017/your-db-name', {
	    useNewUrlParser: true,
	    useUnifiedTopology: true,
	    useCreateIndex: true,
	  })
	  .then(() => console.log('MongoDB Connected'))
	  .catch((err) => console.log(err));
	
	// Routes
	// (Create and import your routes here)
	
	// Start the server
	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	
	
5. Set up the MongoDB schema:
	○ Create a new folder named models in your project folder.
	○ In the models folder, create a file called User.js with the following content:


	const mongoose = require('mongoose');
	const bcrypt = require('bcrypt');
	
	const UserSchema = new mongoose.Schema({
	  username: {
	    type: String,
	    required: true,
	    unique: true,
	  },
	  password: {
	    type: String,
	    required: true,
	  },
	  gameData: {
	    // Define game-related data fields here
	  },
	});
	
	UserSchema.pre('save', function (next) {
	  const user = this;
	  if (!user.isModified('password')) return next();
	
	  bcrypt.genSalt(10, (err, salt) => {
	    if (err) return next(err);
	
	    bcrypt.hash(user.password, salt, (err, hash) => {
	      if (err) return next(err);
	
	      user.password = hash;
	      next();
	    });
	  });
	});
	
	UserSchema.methods.comparePassword = function (candidatePassword, cb) {
	  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
	    if (err) return cb(err);
	    cb(null, isMatch);
	  });
	};
	
	module.exports = mongoose.model('User', UserSchema);

	
6. Create authentication routes:
	○ Create a new folder named routes in your project folder.
	○ In the routes folder, create a file called authRoutes.js with the following content:


	const express = require('express');
	const router = express.Router();
	const passport = require('passport');
	const jwt = require('jsonwebtoken');
	const User = require('../models/User');
	
	// Register route
	router.post('/register', (req, res) => {
	  const { username, password } = req.body;
	  
	  const newUser = new User({
	    username,
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
	router.post('/login', (req, res) => {
	  const { username, password } = req.body;
	
	  User.findOne({ username }, (err, user) => {
	    if (err) throw err;
	
	    if (!user) {
	      return res.status(404).json({ success: false, msg: 'User not found' });
	    }
	
	    user.comparePassword(password, (err, isMatch) => {
	      if (err) throw err;
	
	      if (isMatch) {
	        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
	
	        res.json({
	          success: true,
	          token: `Bearer ${token}`,
	          user: {
	            id: user._id,
	            username: user.username,
	          },
	        });
	      } else {
	        return res.status(401).json({ success: false, msg: 'Wrong password' });
	      }
	    });
	  });
	});
	
	module.exports = router;
	
	
7. Integrate the authentication routes into your server:
	○ In your server.js file, add the following lines to import and use the authentication routes:


	// Import authRoutes
	const authRoutes = require('./routes/authRoutes');
	
	// Use authRoutes
	app.use('/api/auth', authRoutes);


Now you have a basic authentication system in place using Node.js, Express.js, and MongoDB. Users can register and log in, and their credentials are securely stored in the database. You can further expand the functionality by implementing additional routes for updating and retrieving game data, as well as setting up client-side authentication to secure the application.

