"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlaylistFilters } from "@/lib/types";
import { Search, X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { FilterChip } from "./filter-chip";
import { useDebounce } from "@/lib/performance-utils";

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

type SortOption = "most_liked" | "most_saved" | "newest" | "oldest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "most_liked", label: "Most Liked" },
  { value: "most_saved", label: "Most Saved" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export function SearchFilters({ onFiltersChange, className = "" }: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);
  
  // Search within filter categories
  const [genreSearch, setGenreSearch] = useState("");
  const [moodSearch, setMoodSearch] = useState("");
  const [activitySearch, setActivitySearch] = useState("");
  
  // Expand/collapse filter sections
  const [expandedSections, setExpandedSections] = useState({
    genres: true,
    moods: true,
    activities: true,
  });

  // Debounce search query with 300ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Update filters when debounced search or other filters change
  useEffect(() => {
    onFiltersChange({
      search: debouncedSearchQuery || undefined,
      genres: selectedGenres.length > 0 ? selectedGenres : undefined,
      moods: selectedMoods.length > 0 ? selectedMoods : undefined,
      activities: selectedActivities.length > 0 ? selectedActivities : undefined,
      sortBy,
    });
  }, [debouncedSearchQuery, selectedGenres, selectedMoods, selectedActivities, sortBy, onFiltersChange]);

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
    setSortBy("newest");
  };

  const hasActiveFilters = searchQuery || selectedGenres.length > 0 || selectedMoods.length > 0 || selectedActivities.length > 0;
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  // Filter options based on search
  const filteredGenres = GENRE_OPTIONS.filter(genre =>
    genre.toLowerCase().includes(genreSearch.toLowerCase())
  );
  const filteredMoods = MOOD_OPTIONS.filter(mood =>
    mood.toLowerCase().includes(moodSearch.toLowerCase())
  );
  const filteredActivities = ACTIVITY_OPTIONS.filter(activity =>
    activity.toLowerCase().includes(activitySearch.toLowerCase())
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          placeholder="Search playlists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-12 py-3 sm:py-3.5 border border-input rounded-lg bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 min-h-[48px]"
          aria-label="Search playlists"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 min-h-[44px] px-4"
          aria-expanded={showFilters}
          aria-label="Toggle filters"
        >
          <Filter className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
              {(selectedGenres.length + selectedMoods.length + selectedActivities.length) || ""}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground min-h-[44px] px-4"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Sort Options */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <label htmlFor="sort-select" className="text-sm font-medium text-foreground whitespace-nowrap">
          Sort by:
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="w-full sm:flex-1 px-3 py-3 sm:py-2 border border-input rounded-lg bg-background text-foreground text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all min-h-[44px]"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="space-y-4 p-4 border border-border rounded-lg bg-card animate-slide-up">
          {/* Genres */}
          <div>
            <button
              onClick={() => toggleSection("genres")}
              className="flex items-center justify-between w-full mb-3 text-foreground hover:text-primary transition-colors min-h-[44px]"
              aria-expanded={expandedSections.genres}
              aria-controls="genres-section"
              aria-label={`Genres filter section ${selectedGenres.length > 0 ? `(${selectedGenres.length} selected)` : ''}`}
            >
              <h3 className="font-medium">
                Genres {selectedGenres.length > 0 && `(${selectedGenres.length})`}
              </h3>
              {expandedSections.genres ? (
                <ChevronUp className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
            
            {expandedSections.genres && (
              <div id="genres-section">
                <div className="relative mb-3">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" aria-hidden="true" />
                  <label htmlFor="genre-search" className="sr-only">Search genres</label>
                  <input
                    id="genre-search"
                    type="text"
                    placeholder="Search genres..."
                    value={genreSearch}
                    onChange={(e) => setGenreSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent min-h-[44px]"
                    aria-label="Search genres"
                  />
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto" role="group" aria-label="Genre filters">
                  {filteredGenres.map((genre) => (
                    <label
                      key={genre}
                      className="flex items-center gap-3 p-3 rounded-md hover:bg-muted cursor-pointer transition-colors min-h-[44px]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => handleGenreToggle(genre)}
                        className="w-5 h-5 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-0 cursor-pointer flex-shrink-0"
                      />
                      <span className="text-base text-foreground">{genre}</span>
                    </label>
                  ))}
                  {filteredGenres.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2" role="status">
                      No genres found
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Moods */}
          <div>
            <button
              onClick={() => toggleSection("moods")}
              className="flex items-center justify-between w-full mb-3 text-foreground hover:text-primary transition-colors min-h-[44px]"
              aria-expanded={expandedSections.moods}
              aria-controls="moods-section"
              aria-label={`Moods filter section ${selectedMoods.length > 0 ? `(${selectedMoods.length} selected)` : ''}`}
            >
              <h3 className="font-medium">
                Moods {selectedMoods.length > 0 && `(${selectedMoods.length})`}
              </h3>
              {expandedSections.moods ? (
                <ChevronUp className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
            
            {expandedSections.moods && (
              <div id="moods-section">
                <div className="relative mb-3">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" aria-hidden="true" />
                  <label htmlFor="mood-search" className="sr-only">Search moods</label>
                  <input
                    id="mood-search"
                    type="text"
                    placeholder="Search moods..."
                    value={moodSearch}
                    onChange={(e) => setMoodSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent min-h-[44px]"
                    aria-label="Search moods"
                  />
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto" role="group" aria-label="Mood filters">
                  {filteredMoods.map((mood) => (
                    <label
                      key={mood}
                      className="flex items-center gap-3 p-3 rounded-md hover:bg-muted cursor-pointer transition-colors min-h-[44px]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMoods.includes(mood)}
                        onChange={() => handleMoodToggle(mood)}
                        className="w-5 h-5 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-0 cursor-pointer flex-shrink-0"
                      />
                      <span className="text-base text-foreground">{mood}</span>
                    </label>
                  ))}
                  {filteredMoods.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2" role="status">
                      No moods found
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Activities */}
          <div>
            <button
              onClick={() => toggleSection("activities")}
              className="flex items-center justify-between w-full mb-3 text-foreground hover:text-primary transition-colors min-h-[44px]"
              aria-expanded={expandedSections.activities}
              aria-controls="activities-section"
              aria-label={`Activities filter section ${selectedActivities.length > 0 ? `(${selectedActivities.length} selected)` : ''}`}
            >
              <h3 className="font-medium">
                Activities {selectedActivities.length > 0 && `(${selectedActivities.length})`}
              </h3>
              {expandedSections.activities ? (
                <ChevronUp className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
            
            {expandedSections.activities && (
              <div id="activities-section">
                <div className="relative mb-3">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" aria-hidden="true" />
                  <label htmlFor="activity-search" className="sr-only">Search activities</label>
                  <input
                    id="activity-search"
                    type="text"
                    placeholder="Search activities..."
                    value={activitySearch}
                    onChange={(e) => setActivitySearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent min-h-[44px]"
                    aria-label="Search activities"
                  />
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto" role="group" aria-label="Activity filters">
                  {filteredActivities.map((activity) => (
                    <label
                      key={activity}
                      className="flex items-center gap-3 p-3 rounded-md hover:bg-muted cursor-pointer transition-colors min-h-[44px]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedActivities.includes(activity)}
                        onChange={() => handleActivityToggle(activity)}
                        className="w-5 h-5 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-0 cursor-pointer flex-shrink-0"
                      />
                      <span className="text-base text-foreground">{activity}</span>
                    </label>
                  ))}
                  {filteredActivities.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2" role="status">
                      No activities found
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedGenres.map((genre) => (
            <FilterChip
              key={`genre-${genre}`}
              label={genre}
              variant="genre"
              onRemove={() => handleGenreToggle(genre)}
            />
          ))}
          {selectedMoods.map((mood) => (
            <FilterChip
              key={`mood-${mood}`}
              label={mood}
              variant="mood"
              onRemove={() => handleMoodToggle(mood)}
            />
          ))}
          {selectedActivities.map((activity) => (
            <FilterChip
              key={`activity-${activity}`}
              label={activity}
              variant="activity"
              onRemove={() => handleActivityToggle(activity)}
            />
          ))}
        </div>
      )}
    </div>
  );
}