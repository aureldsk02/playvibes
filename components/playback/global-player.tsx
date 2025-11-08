'use client';

import { usePlayback } from './playback-provider';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';

export function GlobalPlayer() {
  const { 
    playbackState, 
    togglePlay, 
    previousTrack, 
    nextTrack, 
    seek,
    setVolume 
  } = usePlayback();
  
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [localVolume, setLocalVolume] = useState(playbackState.volume);

  useEffect(() => {
    setLocalVolume(playbackState.volume);
  }, [playbackState.volume]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playbackState.currentTrack) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newPosition = percentage * playbackState.duration;
    
    seek(newPosition);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setLocalVolume(newVolume);
    setVolume(newVolume);
  };

  // Don't show the player if there's no current track or if not ready
  if (!playbackState.currentTrack || !playbackState.isReady) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border shadow-2xl z-50 animate-slide-up">
      <div className="container-responsive py-2 sm:py-3">
        {/* Mobile Layout */}
        <div className="block sm:hidden">
          <div className="flex items-center justify-between mb-2">
            {/* Track info */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {playbackState.currentTrack.album.images[0] && (
                <img
                  src={playbackState.currentTrack.album.images[0].url}
                  alt={playbackState.currentTrack.album.name}
                  className="w-10 h-10 rounded-md shadow-sm"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {playbackState.currentTrack.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {playbackState.currentTrack.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
            </div>

            {/* Mobile controls */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={togglePlay}
                size="sm"
                className="w-10 h-10 rounded-full p-0 shadow-md"
              >
                {playbackState.isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between">
          {/* Track info */}
          <div className="flex items-center space-x-3 flex-1 min-w-0 max-w-xs lg:max-w-sm">
            {playbackState.currentTrack.album.images[0] && (
              <img
                src={playbackState.currentTrack.album.images[0].url}
                alt={playbackState.currentTrack.album.name}
                className="w-12 h-12 rounded-md shadow-sm"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {playbackState.currentTrack.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {playbackState.currentTrack.artists.map(artist => artist.name).join(', ')}
              </p>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center space-x-3 flex-1 justify-center max-w-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={previousTrack}
              className="w-8 h-8 p-0 hover:bg-muted"
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full p-0 shadow-md hover:shadow-lg transition-shadow"
            >
              {playbackState.isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={nextTrack}
              className="w-8 h-8 p-0 hover:bg-muted"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Volume and additional controls */}
          <div className="flex items-center space-x-3 flex-1 justify-end max-w-xs">
            {/* Premium status indicator */}
            {!playbackState.hasSpotifyPremium && (
              <div className="hidden lg:block text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 rounded-full px-3 py-1">
                Free (30s preview)
              </div>
            )}

            {/* Volume control */}
            <div className="relative hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVolumeControl(!showVolumeControl)}
                className="w-8 h-8 p-0 hover:bg-muted"
              >
                {localVolume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              
              {showVolumeControl && (
                <div className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-3 animate-scale-in">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={localVolume}
                    onChange={handleVolumeChange}
                    className="w-20 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              )}
            </div>

            {/* Time display */}
            <div className="text-xs text-muted-foreground min-w-0 hidden lg:block">
              {formatTime(playbackState.position)} / {formatTime(playbackState.duration)}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2">
          <div 
            className="w-full bg-muted rounded-full h-1 cursor-pointer hover:h-1.5 transition-all duration-200"
            onClick={handleSeek}
          >
            <div
              className="bg-primary h-full rounded-full transition-all duration-1000 shadow-sm"
              style={{
                width: `${(playbackState.position / playbackState.duration) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}