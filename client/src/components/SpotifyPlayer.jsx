import React from 'react';

function SpotifyPlayer({ spotifyId }) {
  if (!spotifyId) return null;

  return (
    <div className="spotify-player">
      <iframe
        src={`https://open.spotify.com/embed/playlist/${spotifyId}`}
        width="100%"
        height="380"
        frameBorder="0"
        allowtransparency="true"
        allow="encrypted-media"
        title="Spotify Player"
      ></iframe>
    </div>
  );
}

export default SpotifyPlayer;
