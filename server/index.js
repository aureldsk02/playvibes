require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const playlistRoutes = require('./routes/playlists');
const spotifyRoutes = require('./routes/spotify');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(mongoSanitize()); // Sanitize user input to prevent NoSQL injection
app.use('/api/', limiter); // Apply rate limiting to all API routes

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/playvibes';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/playlists', playlistRoutes);
app.use('/api/spotify', spotifyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PlayVibes API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
