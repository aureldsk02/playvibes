import axios from 'axios';

const API_BASE_URL = '/api';

export const playlistService = {
  // Get all playlists with optional filters
  getPlaylists: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axios.get(`${API_BASE_URL}/playlists?${params}`);
    return response.data;
  },

  // Get single playlist
  getPlaylist: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/playlists/${id}`);
    return response.data;
  },

  // Create new playlist
  createPlaylist: async (playlistData) => {
    const response = await axios.post(`${API_BASE_URL}/playlists`, playlistData);
    return response.data;
  },

  // Update playlist
  updatePlaylist: async (id, playlistData) => {
    const response = await axios.put(`${API_BASE_URL}/playlists/${id}`, playlistData);
    return response.data;
  },

  // Delete playlist
  deletePlaylist: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/playlists/${id}`);
    return response.data;
  },

  // Get filter options
  getFilterOptions: async () => {
    const response = await axios.get(`${API_BASE_URL}/playlists/filters/options`);
    return response.data;
  }
};

export const spotifyService = {
  // Get Spotify playlist details
  getPlaylistDetails: async (spotifyId) => {
    const response = await axios.get(`${API_BASE_URL}/spotify/playlist/${spotifyId}`);
    return response.data;
  },

  // Search Spotify playlists
  searchPlaylists: async (query) => {
    const response = await axios.get(`${API_BASE_URL}/spotify/search`, {
      params: { q: query }
    });
    return response.data;
  }
};
