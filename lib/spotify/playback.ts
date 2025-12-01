import { PlaybackState } from '@/lib/types';
import { loadSpotifySDK } from './lazy-sdk';

export class SpotifyPlaybackService {
  private player: SpotifyPlayer | null = null;
  private deviceId: string | null = null;
  private accessToken: string | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private listeners: Map<string, ((data?: any) => void)[]> = new Map();

  async initializePlayer(accessToken: string, deviceName: string = 'PlayVibes Web Player'): Promise<boolean> {
    // Lazy load the Spotify SDK
    try {
      await loadSpotifySDK();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load Spotify SDK';
      this.emit('error', { type: 'initialization', message: errorMessage });
      throw error;
    }

    if (typeof window === 'undefined' || !window.Spotify) {
      const error = new Error('Spotify Web Playback SDK not loaded');
      this.emit('error', { type: 'initialization', message: error.message });
      throw error;
    }

    this.accessToken = accessToken;

    // Check if user has Spotify Premium
    const hasSpotifyPremium = await this.checkSpotifyPremium(accessToken);

    this.player = new window.Spotify.Player({
      name: deviceName,
      getOAuthToken: (callback: (token: string) => void) => {
        callback(accessToken);
      },
      volume: 0.5
    });

    // Set up event listeners
    this.setupPlayerListeners(hasSpotifyPremium);

    // Connect to the player
    const success = await this.player!.connect();
    return success;
  }

  private async checkSpotifyPremium(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const user = await response.json();
        return user.product === 'premium';
      }
      return false;
    } catch (error) {
      console.error('Error checking Spotify Premium status:', error);
      return false;
    }
  }

  private setupPlayerListeners(hasSpotifyPremium: boolean) {
    if (!this.player) return;

    // Ready
    this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
      console.log('Ready with Device ID', device_id);
      this.deviceId = device_id;
      this.emit('ready', { deviceId: device_id, hasSpotifyPremium });
    });

    // Not Ready
    this.player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
      console.log('Device ID has gone offline', device_id);
      this.emit('not-ready', { deviceId: device_id });
    });

    // Player state changed
    this.player.addListener('player_state_changed', (state: SpotifyPlayerState | null) => {
      if (!state) return;

      const playbackState: PlaybackState = {
        isPlaying: !state.paused,
        isPaused: state.paused,
        currentTrack: state.track_window.current_track,
        position: state.position,
        duration: state.track_window.current_track?.duration_ms || 0,
        volume: 0.5, // We'll get this separately
        deviceId: this.deviceId,
        isReady: true,
        hasSpotifyPremium,
        disallows: state.disallows
      };

      this.emit('state-changed', playbackState);
    });

    // Errors
    this.player.addListener('initialization_error', ({ message }: { message: string }) => {
      console.error('Failed to initialize:', message);
      this.emit('error', { type: 'initialization', message });
    });

    this.player.addListener('authentication_error', ({ message }: { message: string }) => {
      console.error('Failed to authenticate:', message);
      this.emit('error', { type: 'authentication', message });
    });

    this.player.addListener('account_error', ({ message }: { message: string }) => {
      console.error('Failed to validate Spotify account:', message);
      this.emit('error', { type: 'account', message });
    });

    this.player.addListener('playback_error', ({ message }: { message: string }) => {
      console.error('Failed to perform playback:', message);
      this.emit('error', { type: 'playback', message });
    });
  }

  async playPlaylist(playlistUri: string): Promise<void> {
    if (!this.deviceId || !this.accessToken) {
      throw new Error('Player not ready');
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          context_uri: playlistUri
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to play playlist: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error playing playlist:', error);
      throw error;
    }
  }

  async playTrack(trackUri: string): Promise<void> {
    if (!this.deviceId || !this.accessToken) {
      throw new Error('Player not ready');
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [trackUri]
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to play track: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error playing track:', error);
      throw error;
    }
  }

  async pause(): Promise<void> {
    if (this.player) {
      await this.player.pause();
    }
  }

  async resume(): Promise<void> {
    if (this.player) {
      await this.player.resume();
    }
  }

  async togglePlay(): Promise<void> {
    if (this.player) {
      await this.player.togglePlay();
    }
  }

  async previousTrack(): Promise<void> {
    if (this.player) {
      await this.player.previousTrack();
    }
  }

  async nextTrack(): Promise<void> {
    if (this.player) {
      await this.player.nextTrack();
    }
  }

  async seek(position: number): Promise<void> {
    if (this.player) {
      await this.player.seek(position);
    }
  }

  async setVolume(volume: number): Promise<void> {
    if (this.player) {
      await this.player.setVolume(volume);
    }
  }

  async getCurrentState(): Promise<SpotifyPlayerState | null> {
    if (this.player) {
      return await this.player.getCurrentState();
    }
    return null;
  }

  disconnect(): void {
    if (this.player) {
      this.player.disconnect();
      this.player = null;
      this.deviceId = null;
      this.accessToken = null;
    }
  }

  // Event system
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: string, callback: (data?: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off(event: string, callback?: (data?: any) => void): void {
    if (!this.listeners.has(event)) return;

    if (callback) {
      const callbacks = this.listeners.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    } else {
      this.listeners.delete(event);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private emit(event: string, data?: any): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => callback(data));
    }
  }
}

// Singleton instance
export const spotifyPlaybackService = new SpotifyPlaybackService();