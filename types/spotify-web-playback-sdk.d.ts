declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: {
        name: string;
        getOAuthToken: (callback: (token: string) => void) => void;
        volume?: number;
      }) => SpotifyPlayer;
    };
  }

  interface SpotifyPlayer {
    connect(): Promise<boolean>;
    disconnect(): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addListener(event: string, callback: (data: any) => void): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    removeListener(event: string, callback?: (data: any) => void): void;
    getCurrentState(): Promise<SpotifyPlayerState | null>;
    setName(name: string): Promise<void>;
    getVolume(): Promise<number>;
    setVolume(volume: number): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    togglePlay(): Promise<void>;
    seek(position_ms: number): Promise<void>;
    previousTrack(): Promise<void>;
    nextTrack(): Promise<void>;
  }

  interface SpotifyPlayerState {
    context: {
      uri: string;
      metadata: Record<string, unknown>;
    };
    disallows: {
      pausing: boolean;
      peeking_next: boolean;
      peeking_prev: boolean;
      resuming: boolean;
      seeking: boolean;
      skipping_next: boolean;
      skipping_prev: boolean;
    };
    paused: boolean;
    position: number;
    repeat_mode: number;
    shuffle: boolean;
    track_window: {
      current_track: SpotifyWebPlaybackTrack;
      previous_tracks: SpotifyWebPlaybackTrack[];
      next_tracks: SpotifyWebPlaybackTrack[];
    };
  }

  interface SpotifyWebPlaybackTrack {
    id: string;
    uri: string;
    name: string;
    artists: Array<{
      name: string;
      uri: string;
    }>;
    album: {
      name: string;
      uri: string;
      images: Array<{
        url: string;
        size?: string;
      }>;
    };
    duration_ms: number;
  }
}

export { };