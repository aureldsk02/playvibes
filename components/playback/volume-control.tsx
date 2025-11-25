'use client';

import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  disabled?: boolean;
}

export function VolumeControl({
  volume,
  onVolumeChange,
  disabled = false
}: VolumeControlProps) {
  const [showSlider, setShowSlider] = useState(false);
  const [localVolume, setLocalVolume] = useState(volume);
  const [previousVolume, setPreviousVolume] = useState(volume);

  useEffect(() => {
    setLocalVolume(volume);
  }, [volume]);

  // Persist volume to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('playvibes-volume', volume.toString());
    }
  }, [volume]);

  // Load volume from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedVolume = localStorage.getItem('playvibes-volume');
      if (savedVolume) {
        const parsedVolume = parseFloat(savedVolume);
        if (!isNaN(parsedVolume) && parsedVolume >= 0 && parsedVolume <= 1) {
          setLocalVolume(parsedVolume);
          onVolumeChange(parsedVolume);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setLocalVolume(newVolume);
    onVolumeChange(newVolume);
    if (newVolume > 0) {
      setPreviousVolume(newVolume);
    }
  };

  const toggleMute = () => {
    if (localVolume === 0) {
      // Unmute to previous volume or 0.5 if no previous volume
      const volumeToRestore = previousVolume > 0 ? previousVolume : 0.5;
      setLocalVolume(volumeToRestore);
      onVolumeChange(volumeToRestore);
    } else {
      // Mute
      setPreviousVolume(localVolume);
      setLocalVolume(0);
      onVolumeChange(0);
    }
  };

  const getVolumeIcon = () => {
    if (localVolume === 0) {
      return <VolumeX className="w-4 h-4" />;
    } else if (localVolume < 0.5) {
      return <Volume1 className="w-4 h-4" />;
    } else {
      return <Volume2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMute}
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
        disabled={disabled}
        className="w-8 h-8 p-0 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={localVolume === 0 ? "Unmute" : "Mute"}
        title={localVolume === 0 ? "Unmute" : "Mute"}
      >
        {getVolumeIcon()}
      </Button>

      {showSlider && !disabled && (
        <div
          className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-3 animate-scale-in"
          onMouseEnter={() => setShowSlider(true)}
          onMouseLeave={() => setShowSlider(false)}
        >
          <div className="flex flex-col items-center space-y-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={localVolume}
              onChange={handleVolumeChange}
              className="w-24 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0"
              aria-label="Volume"
              aria-valuenow={localVolume * 100}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuetext={`${Math.round(localVolume * 100)}%`}
            />
            <span className="text-xs text-muted-foreground">
              {Math.round(localVolume * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
