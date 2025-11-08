const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');

// Get all playlists with filters
router.get('/', async (req, res) => {
  try {
    const { style, mood, context, country, influencer } = req.query;
    const filter = {};

    if (style) filter.style = style;
    if (mood) filter.mood = mood;
    if (context) filter.context = context;
    if (country) filter.country = country;
    if (influencer) filter.influencer = influencer;

    const playlists = await Playlist.find(filter).sort({ createdAt: -1 });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single playlist
router.get('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new playlist
router.post('/', async (req, res) => {
  const playlist = new Playlist({
    title: req.body.title,
    description: req.body.description,
    spotifyUrl: req.body.spotifyUrl,
    spotifyId: req.body.spotifyId,
    style: req.body.style,
    mood: req.body.mood,
    context: req.body.context,
    country: req.body.country || '',
    influencer: req.body.influencer || '',
    createdBy: req.body.createdBy,
    imageUrl: req.body.imageUrl || '',
    trackCount: req.body.trackCount || 0
  });

  try {
    const newPlaylist = await playlist.save();
    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update playlist
router.put('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        playlist[key] = req.body[key];
      }
    });

    const updatedPlaylist = await playlist.save();
    res.json(updatedPlaylist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete playlist
router.delete('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    await playlist.deleteOne();
    res.json({ message: 'Playlist deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get filter options
router.get('/filters/options', async (req, res) => {
  try {
    const styles = await Playlist.distinct('style');
    const moods = await Playlist.distinct('mood');
    const contexts = await Playlist.distinct('context');
    const countries = await Playlist.distinct('country');
    const influencers = await Playlist.distinct('influencer');

    res.json({
      styles: styles.filter(s => s),
      moods: moods.filter(m => m),
      contexts: contexts.filter(c => c),
      countries: countries.filter(c => c),
      influencers: influencers.filter(i => i)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
