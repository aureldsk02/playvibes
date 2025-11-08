"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlaylistFilters } from "@/lib/types";
import { Search, X, Filter } from "lucide-react";

interface SearchFiltersProps {
  onFiltersChange: (filters: PlaylistFilters) => void;
  className?: string;
}

// Predefined filter options - these could be fetched from an API in the future
const GENRE_OPTIONS = [
  "Pop", "Rock", "Hip Hop", "Electronic", "Jazz", "Classical", "Country", 
  "R&B", "Indie", "Alternative", "Folk", "Reggae", "Blues", "Funk", "Soul"
];

const MOOD_OPTIONS = [
  "Happy", "Sad", "Energetic", "Chill", "Romantic", "Angry", "Peaceful", 
  "Nostalgic", "Uplifting", "Melancholic", "Dreamy", "Intense", "Relaxed"
];

const ACTIVITY_OPTIONS = [
  "Workout", "Study", "Party", "Sleep", "Driving", "Cooking", "Reading", 
  "Walking", "Running", "Meditation", "Work", "Travel", "Dancing", "Gaming"
];

export function SearchFilters({ onFiltersChange, className = "" }: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({
        search: searchQuery || undefined,
        genres: selectedGenres.length > 0 ? selectedGenres : undefined,
        moods: selectedMoods.length > 0 ? selectedMoods : undefined,
        activities: selectedActivities.length > 0 ? selectedActivities : undefined,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedGenres, selectedMoods, selectedActivities, onFiltersChange]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleMoodToggle = (mood: string) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedGenres([]);
    setSelectedMoods([]);
    setSelectedActivities([]);
  };

  const hasActiveFilters = searchQuery || selectedGenres.length > 0 || selectedMoods.length > 0 || selectedActivities.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Search playlists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
              {(selectedGenres.length + selectedMoods.length + selectedActivities.length) || ""}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="space-y-6 p-4 border border-border rounded-lg bg-card animate-slide-up">
          {/* Genres */}
          <div>
            <h3 className="font-medium mb-3 text-foreground">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {GENRE_OPTIONS.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenres.includes(genre) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleGenreToggle(genre)}
                  className="text-xs transition-all duration-200 hover:scale-105"
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>

          {/* Moods */}
          <div>
            <h3 className="font-medium mb-3 text-foreground">Moods</h3>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((mood) => (
                <Button
                  key={mood}
                  variant={selectedMoods.includes(mood) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleMoodToggle(mood)}
                  className="text-xs transition-all duration-200 hover:scale-105"
                >
                  {mood}
                </Button>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div>
            <h3 className="font-medium mb-3 text-foreground">Activities</h3>
            <div className="flex flex-wrap gap-2">
              {ACTIVITY_OPTIONS.map((activity) => (
                <Button
                  key={activity}
                  variant={selectedActivities.includes(activity) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleActivityToggle(activity)}
                  className="text-xs transition-all duration-200 hover:scale-105"
                >
                  {activity}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedGenres.map((genre) => (
            <span
              key={`genre-${genre}`}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
            >
              {genre}
              <button
                onClick={() => handleGenreToggle(genre)}
                className="hover:text-primary/80"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedMoods.map((mood) => (
            <span
              key={`mood-${mood}`}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-secondary/80 text-secondary-foreground rounded-full"
            >
              {mood}
              <button
                onClick={() => handleMoodToggle(mood)}
                className="hover:opacity-80"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedActivities.map((activity) => (
            <span
              key={`activity-${activity}`}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-accent text-accent-foreground rounded-full"
            >
              {activity}
              <button
                onClick={() => handleActivityToggle(activity)}
                className="hover:opacity-80"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}