import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SpotifyPlayer from '../components/SpotifyPlayer';
import { playlistService } from '../services/api';

function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPlaylist();
  }, [id]);

  const loadPlaylist = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await playlistService.getPlaylist(id);
      setPlaylist(data);
    } catch (err) {
      setError('Failed to load playlist. Please try again.');
      console.error('Error loading playlist:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading playlist...</div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="container">
        <div className="error">
          <p>{error || 'Playlist not found'}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="playlist-detail-page">
      <div className="container">
        <button onClick={() => navigate('/')} className="btn-back">
          ← Back to Discover
        </button>

        <div className="playlist-detail">
          <div className="playlist-header">
            {playlist.imageUrl && (
              <div className="playlist-cover">
                <img src={playlist.imageUrl} alt={playlist.title} />
              </div>
            )}
            <div className="playlist-info-header">
              <h1>{playlist.title}</h1>
              <p className="playlist-description-full">{playlist.description}</p>
              
              <div className="playlist-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Style:</span>
                  <span className="meta-value">{playlist.style}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Mood:</span>
                  <span className="meta-value">{playlist.mood}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Context:</span>
                  <span className="meta-value">{playlist.context}</span>
                </div>
                {playlist.country && (
                  <div className="meta-item">
                    <span className="meta-label">Country:</span>
                    <span className="meta-value">{playlist.country}</span>
                  </div>
                )}
                {playlist.influencer && (
                  <div className="meta-item">
                    <span className="meta-label">Influencer:</span>
                    <span className="meta-value">{playlist.influencer}</span>
                  </div>
                )}
                <div className="meta-item">
                  <span className="meta-label">Created by:</span>
                  <span className="meta-value">{playlist.createdBy}</span>
                </div>
                {playlist.trackCount > 0 && (
                  <div className="meta-item">
                    <span className="meta-label">Tracks:</span>
                    <span className="meta-value">{playlist.trackCount}</span>
                  </div>
                )}
              </div>

              <div className="playlist-actions-detail">
                <a
                  href={playlist.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-spotify-large"
                >
                  Open in Spotify
                </a>
              </div>
            </div>
          </div>

          <div className="playlist-player-section">
            <h3>Listen Now</h3>
            <SpotifyPlayer spotifyId={playlist.spotifyId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaylistDetail;
