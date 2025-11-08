const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  spotifyUrl: {
    type: String,
    required: true
  },
  spotifyId: {
    type: String,
    required: true
  },
  style: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    required: true
  },
  context: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: ''
  },
  influencer: {
    type: String,
    default: ''
  },
  createdBy: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  trackCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search and filtering
playlistSchema.index({ style: 1, mood: 1, context: 1, country: 1 });

module.exports = mongoose.model('Playlist', playlistSchema);
