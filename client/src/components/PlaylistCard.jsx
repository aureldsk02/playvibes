import React from 'react';
import { Link } from 'react-router-dom';

function PlaylistCard({ playlist }) {
  return (
    <div className="playlist-card">
      {playlist.imageUrl && (
        <div className="playlist-image">
          <img src={playlist.imageUrl} alt={playlist.title} />
        </div>
      )}
      <div className="playlist-info">
        <h3 className="playlist-title">{playlist.title}</h3>
        <p className="playlist-description">{playlist.description}</p>
        <div className="playlist-tags">
          <span className="tag tag-style">{playlist.style}</span>
          <span className="tag tag-mood">{playlist.mood}</span>
          <span className="tag tag-context">{playlist.context}</span>
        </div>
        {playlist.country && (
          <div className="playlist-meta">
            <span>📍 {playlist.country}</span>
          </div>
        )}
        {playlist.influencer && (
          <div className="playlist-meta">
            <span>👤 {playlist.influencer}</span>
          </div>
        )}
        <div className="playlist-actions">
          <Link to={`/playlist/${playlist._id}`} className="btn-view">
            View & Play
          </Link>
          <a 
            href={playlist.spotifyUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-spotify"
          >
            Open in Spotify
          </a>
        </div>
      </div>
    </div>
  );
}

export default PlaylistCard;
