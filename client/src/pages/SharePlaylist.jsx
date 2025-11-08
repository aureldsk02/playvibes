import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { playlistService, spotifyService } from '../services/api';

function SharePlaylist() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    spotifyUrl: '',
    style: '',
    mood: '',
    context: '',
    country: '',
    influencer: '',
    createdBy: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [spotifyPreview, setSpotifyPreview] = useState(null);

  const extractSpotifyId = (url) => {
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fetch Spotify playlist details when URL is entered
    if (name === 'spotifyUrl' && value) {
      const spotifyId = extractSpotifyId(value);
      if (spotifyId) {
        fetchSpotifyDetails(spotifyId);
      }
    }
  };

  const fetchSpotifyDetails = async (spotifyId) => {
    try {
      const details = await spotifyService.getPlaylistDetails(spotifyId);
      setSpotifyPreview(details);
      
      // Auto-fill title if empty
      if (!formData.title && details.name) {
        setFormData(prev => ({
          ...prev,
          title: details.name,
          imageUrl: details.images?.[0]?.url || '',
          trackCount: details.tracks?.total || 0
        }));
      }
    } catch (err) {
      console.error('Error fetching Spotify details:', err);
      setSpotifyPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const spotifyId = extractSpotifyId(formData.spotifyUrl);
      if (!spotifyId) {
        throw new Error('Invalid Spotify playlist URL');
      }

      const playlistData = {
        ...formData,
        spotifyId,
        imageUrl: spotifyPreview?.images?.[0]?.url || '',
        trackCount: spotifyPreview?.tracks?.total || 0
      };

      await playlistService.createPlaylist(playlistData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create playlist');
      console.error('Error creating playlist:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="share-page">
      <div className="container">
        <h2>Share Your Spotify Playlist</h2>
        <p className="subtitle">Share your favorite playlists with the community</p>

        <form onSubmit={handleSubmit} className="share-form">
          <div className="form-group">
            <label htmlFor="spotifyUrl">Spotify Playlist URL *</label>
            <input
              type="url"
              id="spotifyUrl"
              name="spotifyUrl"
              value={formData.spotifyUrl}
              onChange={handleChange}
              placeholder="https://open.spotify.com/playlist/..."
              required
            />
            <small>Paste the Spotify playlist link here</small>
          </div>

          {spotifyPreview && (
            <div className="spotify-preview">
              {spotifyPreview.images?.[0] && (
                <img src={spotifyPreview.images[0].url} alt={spotifyPreview.name} />
              )}
              <div className="preview-info">
                <h4>{spotifyPreview.name}</h4>
                <p>{spotifyPreview.tracks?.total} tracks</p>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Focus Deep Work"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your playlist..."
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="style">Style/Genre *</label>
              <input
                type="text"
                id="style"
                name="style"
                value={formData.style}
                onChange={handleChange}
                placeholder="e.g., Electronic, Hip-Hop, Jazz"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mood">Mood *</label>
              <input
                type="text"
                id="mood"
                name="mood"
                value={formData.mood}
                onChange={handleChange}
                placeholder="e.g., Chill, Energetic, Relaxed"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="context">Context/Activity *</label>
            <input
              type="text"
              id="context"
              name="context"
              value={formData.context}
              onChange={handleChange}
              placeholder="e.g., Working, Studying, Workout, Party"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="country">Country (optional)</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g., France, Nigeria, Brazil"
              />
            </div>

            <div className="form-group">
              <label htmlFor="influencer">Influencer (optional)</label>
              <input
                type="text"
                id="influencer"
                name="influencer"
                value={formData.influencer}
                onChange={handleChange}
                placeholder="Your name or username"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="createdBy">Your Name/Email *</label>
            <input
              type="text"
              id="createdBy"
              name="createdBy"
              value={formData.createdBy}
              onChange={handleChange}
              placeholder="How should we credit you?"
              required
            />
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Sharing...' : 'Share Playlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SharePlaylist;
