'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { spotifyPlaybackService } from '@/lib/spotify-playback';
import { PlaybackState } from '@/lib/types';

interface PlaybackContextType {
  playbackState: PlaybackState;
  isInitialized: boolean;
  error: string | null;
  initializePlayer: (accessToken: string) => Promise<void>;
  playPlaylist: (playlistUri: string) => Promise<void>;
  playTrack: (trackUri: string) => Promise<void>;
  togglePlay: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  disconnect: () => void;
}

const PlaybackContext = createContext<PlaybackContextType | null>(null);

export function usePlayback() {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
}

interface PlaybackProviderProps {
  children: ReactNode;
}

export function PlaybackProvider({ children }: PlaybackProviderProps) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    isPaused: true,
    currentTrack: null,
    position: 0,
    duration: 0,
    volume: 0.5,
    deviceId: null,
    isReady: false,
    hasSpotifyPremium: false
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set up event listeners
    const handleReady = (data: { deviceId: string; hasSpotifyPremium: boolean }) => {
      setPlaybackState(prev => ({
        ...prev,
        deviceId: data.deviceId,
        isReady: true,
        hasSpotifyPremium: data.hasSpotifyPremium
      }));
      setIsInitialized(true);
      setError(null);
    };

    const handleNotReady = () => {
      setPlaybackState(prev => ({
        ...prev,
        isReady: false,
        deviceId: null
      }));
      setIsInitialized(false);
    };

    const handleStateChange = (state: PlaybackState) => {
      setPlaybackState(state);
    };

    const handleError = (error: { type: string; message: string }) => {
      const errorMessage = `${error.type}: ${error.message}`;
      setError(errorMessage);

      // Handle specific error types
      if (error.type === 'account' && error.message.includes('Premium')) {
        setPlaybackState(prev => ({
          ...prev,
          hasSpotifyPremium: false
        }));
      }
    };

    spotifyPlaybackService.on('ready', handleReady);
    spotifyPlaybackService.on('not-ready', handleNotReady);
    spotifyPlaybackService.on('state-changed', handleStateChange);
    spotifyPlaybackService.on('error', handleError);

    return () => {
      spotifyPlaybackService.off('ready', handleReady);
      spotifyPlaybackService.off('not-ready', handleNotReady);
      spotifyPlaybackService.off('state-changed', handleStateChange);
      spotifyPlaybackService.off('error', handleError);
    };
  }, []);

  const initializePlayer = async (accessToken: string) => {
    try {
      setError(null);

      // Wait for SDK to be ready
      const waitForSDK = () => {
        return new Promise<void>((resolve) => {
          if (typeof window !== 'undefined' && window.Spotify) {
            resolve();
          } else {
            spotifyPlaybackService.on('sdk-ready', resolve);
          }
        });
      };

      await waitForSDK();
      await spotifyPlaybackService.initializePlayer(accessToken);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize player';
      setError(errorMessage);
      throw err;
    }
  };

  const playPlaylist = async (playlistUri: string) => {
    try {
      setError(null);
      await spotifyPlaybackService.playPlaylist(playlistUri);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to play playlist';
      setError(errorMessage);
      throw err;
    }
  };

  const playTrack = async (trackUri: string) => {
    try {
      setError(null);
      await spotifyPlaybackService.playTrack(trackUri);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to play track';
      setError(errorMessage);
      throw err;
    }
  };

  const togglePlay = async () => {
    try {
      setError(null);
      await spotifyPlaybackService.togglePlay();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle playback';
      setError(errorMessage);
      throw err;
    }
  };

  const pause = async () => {
    try {
      setError(null);
      await spotifyPlaybackService.pause();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pause';
      setError(errorMessage);
      throw err;
    }
  };

  const resume = async () => {
    try {
      setError(null);
      await spotifyPlaybackService.resume();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resume';
      setError(errorMessage);
      throw err;
    }
  };

  const previousTrack = async () => {
    try {
      setError(null);
      await spotifyPlaybackService.previousTrack();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to skip to previous track';
      setError(errorMessage);
      throw err;
    }
  };

  const nextTrack = async () => {
    try {
      setError(null);
      await spotifyPlaybackService.nextTrack();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to skip to next track';
      setError(errorMessage);
      throw err;
    }
  };

  const seek = async (position: number) => {
    try {
      setError(null);
      await spotifyPlaybackService.seek(position);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to seek';
      setError(errorMessage);
      throw err;
    }
  };

  const setVolume = async (volume: number) => {
    try {
      setError(null);
      await spotifyPlaybackService.setVolume(volume);
      setPlaybackState(prev => ({ ...prev, volume }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set volume';
      setError(errorMessage);
      throw err;
    }
  };

  const disconnect = () => {
    spotifyPlaybackService.disconnect();
    setIsInitialized(false);
    setPlaybackState({
      isPlaying: false,
      isPaused: true,
      currentTrack: null,
      position: 0,
      duration: 0,
      volume: 0.5,
      deviceId: null,
      isReady: false,
      hasSpotifyPremium: false
    });
    setError(null);
  };

  const contextValue: PlaybackContextType = {
    playbackState,
    isInitialized,
    error,
    initializePlayer,
    playPlaylist,
    playTrack,
    togglePlay,
    pause,
    resume,
    previousTrack,
    nextTrack,
    seek,
    setVolume,
    disconnect
  };

  return (
    <PlaybackContext.Provider value={contextValue}>
      {children}
    </PlaybackContext.Provider>
  );
}