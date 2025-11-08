import React from 'react';

function FilterBar({ filters, onFilterChange, filterOptions }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value === 'all' ? '' : value
    });
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="style">Style/Genre:</label>
        <select
          id="style"
          name="style"
          value={filters.style || 'all'}
          onChange={handleChange}
        >
          <option value="all">All Styles</option>
          {filterOptions.styles?.map(style => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="mood">Mood:</label>
        <select
          id="mood"
          name="mood"
          value={filters.mood || 'all'}
          onChange={handleChange}
        >
          <option value="all">All Moods</option>
          {filterOptions.moods?.map(mood => (
            <option key={mood} value={mood}>{mood}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="context">Context:</label>
        <select
          id="context"
          name="context"
          value={filters.context || 'all'}
          onChange={handleChange}
        >
          <option value="all">All Contexts</option>
          {filterOptions.contexts?.map(context => (
            <option key={context} value={context}>{context}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="country">Country:</label>
        <select
          id="country"
          name="country"
          value={filters.country || 'all'}
          onChange={handleChange}
        >
          <option value="all">All Countries</option>
          {filterOptions.countries?.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="influencer">Influencer:</label>
        <select
          id="influencer"
          name="influencer"
          value={filters.influencer || 'all'}
          onChange={handleChange}
        >
          <option value="all">All Influencers</option>
          {filterOptions.influencers?.map(influencer => (
            <option key={influencer} value={influencer}>{influencer}</option>
          ))}
        </select>
      </div>

      {(filters.style || filters.mood || filters.context || filters.country || filters.influencer) && (
        <button
          className="btn-clear"
          onClick={() => onFilterChange({})}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default FilterBar;
