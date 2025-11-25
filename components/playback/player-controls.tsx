'use client';

import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useEffect } from 'react';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  canSkipPrev?: boolean;
  canSkipNext?: boolean;
  disabled?: boolean;
}

export function PlayerControls({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  canSkipPrev = true,
  canSkipNext = true,
  disabled = false
}: PlayerControlsProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Space bar - play/pause
      if (event.code === 'Space' && !disabled) {
        event.preventDefault();
        onPlayPause();
      }

      // Arrow left - previous track
      if (event.code === 'ArrowLeft' && canSkipPrev && !disabled) {
        event.preventDefault();
        onPrevious();
      }

      // Arrow right - next track
      if (event.code === 'ArrowRight' && canSkipNext && !disabled) {
        event.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPlaying, onPlayPause, onPrevious, onNext, canSkipPrev, canSkipNext, disabled]);

  return (
    <div className="flex items-center space-x-2 sm:space-x-3 justify-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={onPrevious}
        disabled={!canSkipPrev || disabled}
        className="min-w-[44px] min-h-[44px] w-11 h-11 p-0 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous track (Left Arrow)"
        title="Previous track (Left Arrow)"
      >
        <SkipBack className="w-5 h-5" />
      </Button>

      <Button
        onClick={onPlayPause}
        disabled={disabled}
        className="min-w-[44px] min-h-[44px] w-12 h-12 rounded-full p-0 shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={isPlaying ? "Pause (Space)" : "Play (Space)"}
        title={isPlaying ? "Pause (Space)" : "Play (Space)"}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onNext}
        disabled={!canSkipNext || disabled}
        className="min-w-[44px] min-h-[44px] w-11 h-11 p-0 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next track (Right Arrow)"
        title="Next track (Right Arrow)"
      >
        <SkipForward className="w-5 h-5" />
      </Button>
    </div>
  );
}
