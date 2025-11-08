import React, { useState, useEffect } from 'react';
import PlaylistCard from '../components/PlaylistCard';
import FilterBar from '../components/FilterBar';
import { playlistService } from '../services/api';

function Home() {
  const [playlists, setPlaylists] = useState([]);
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({
    styles: [],
    moods: [],
    contexts: [],
    countries: [],
    influencers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadPlaylists();
  }, [filters]);

  const loadFilterOptions = async () => {
    try {
      const options = await playlistService.getFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      console.error('Error loading filter options:', err);
    }
  };

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await playlistService.getPlaylists(filters);
      setPlaylists(data);
    } catch (err) {
      setError('Failed to load playlists. Please try again.');
      console.error('Error loading playlists:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="container">
        <div className="hero">
          <h2>Discover Amazing Spotify Playlists</h2>
          <p>Explore curated playlists shared by music lovers around the world</p>
        </div>

        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          filterOptions={filterOptions}
        />

        {loading && (
          <div className="loading">
            <p>Loading playlists...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && playlists.length === 0 && (
          <div className="empty-state">
            <p>No playlists found. Be the first to share one!</p>
          </div>
        )}

        <div className="playlists-grid">
          {playlists.map(playlist => (
            <PlaylistCard key={playlist._id} playlist={playlist} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
