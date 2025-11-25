import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
  users,
  accounts,
  sharedPlaylists,
  playlistLikes,
  playlistComments,
  savedPlaylists
} from './db/schema';

// Database model types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Account = InferSelectModel<typeof accounts>;
export type NewAccount = InferInsertModel<typeof accounts>;

export type SharedPlaylist = InferSelectModel<typeof sharedPlaylists>;
export type NewSharedPlaylist = InferInsertModel<typeof sharedPlaylists>;

export type PlaylistLike = InferSelectModel<typeof playlistLikes>;
export type NewPlaylistLike = InferInsertModel<typeof playlistLikes>;

export type PlaylistComment = InferSelectModel<typeof playlistComments>;
export type NewPlaylistComment = InferInsertModel<typeof playlistComments>;

export type SavedPlaylist = InferSelectModel<typeof savedPlaylists>;
export type NewSavedPlaylist = InferInsertModel<typeof savedPlaylists>;

// Extended types with relations
export interface PlaylistWithDetails extends SharedPlaylist {
  user: User;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface CommentWithUser extends PlaylistComment {
  user: User;
}

// Spotify API types
export interface SpotifyPlaylist {
  id: string;
  name: string;
  description?: string;
  images: Array<{
    url: string;
    height?: number;
    width?: number;
  }>;
  tracks: {
    total: number;
  };
  public: boolean;
  owner: {
    id: string;
    display_name: string;
  };
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{
    url: string;
    height?: number;
    width?: number;
  }>;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height?: number;
      width?: number;
    }>;
  };
  duration_ms: number;
  preview_url?: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search and filter types
export interface PlaylistFilters {
  search?: string;
  genres?: string[];
  moods?: string[];
  activities?: string[];
  userId?: string;
}

export interface PlaylistSearchParams {
  q?: string;
  genres?: string;
  moods?: string;
  activities?: string;
  page?: string;
  limit?: string;
}

// Authentication types
export interface AuthSession {
  user: User;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

// Spotify Web Playback SDK types
export interface SpotifyWebPlaybackSDK {
  Player: new (options: SpotifyPlayerOptions) => SpotifyPlayer;
}

export interface SpotifyPlayerOptions {
  name: string;
  getOAuthToken: (callback: (token: string) => void) => void;
  volume?: number;
}

export interface SpotifyPlayer {
  connect(): Promise<boolean>;
  disconnect(): void;
  addListener(event: string, callback: (data: unknown) => void): void;
  removeListener(event: string, callback?: (data: unknown) => void): void;
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

export interface SpotifyPlayerState {
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

export interface SpotifyWebPlaybackTrack {
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

export interface SpotifyPlayerError {
  message: string;
}

// Playback state management types
export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTrack: SpotifyWebPlaybackTrack | null;
  position: number;
  duration: number;
  volume: number;
  deviceId: string | null;
  isReady: boolean;
  hasSpotifyPremium: boolean;
}

// Component prop types
export interface PlaylistCardProps {
  playlist: PlaylistWithDetails;
  showActions?: boolean;
  onLike?: (playlistId: string) => void;
  onSave?: (playlistId: string) => void;
  onPlay?: (playlistId: string) => void;
  onRemove?: (playlistId: string) => void;
}

export interface CommentSectionProps {
  playlistId: string;
  comments: CommentWithUser[];
  onAddComment?: (content: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

export interface PlaylistPlayerProps {
  playlistId?: string;
  playlistUri?: string;
  accessToken: string;
  onTrackChange?: (track: SpotifyWebPlaybackTrack) => void;
  onPlaybackStateChange?: (state: PlaybackState) => void;
}