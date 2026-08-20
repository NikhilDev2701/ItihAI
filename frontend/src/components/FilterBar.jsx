import React from 'react';

export const FilterBar = ({
  filterOptions = {},
  selectedRegion,
  onRegionChange,
  selectedState,
  onStateChange,
  selectedPeriod,
  onPeriodChange,
  selectedType,
  onTypeChange,
  onReset,
}) => {
  const regions = ['All', ...(filterOptions.regions || ['North India', 'East India', 'South India', 'West India', 'Central India'])];
  const states = ['All', ...(filterOptions.states || [])];
  const periods = [
    'All',
    ...(filterOptions.historical_periods || [
      'Ancient (Pre-1200 CE)',
      'Medieval & Mughal (1200–1750 CE)',
      'Colonial (1750–1947 CE)',
    ]),
  ];
  const types = [
    'All',
    ...(filterOptions.heritage_types || [
      'UNESCO World Heritage',
      'Temples & Spiritual',
      'Forts & Palaces',
      'Monuments & Memorials',
      'Caves & Rock-Cut',
    ]),
  ];

  const hasActiveFilters =
    selectedRegion !== 'All' ||
    (selectedState && selectedState !== 'All') ||
    selectedPeriod !== 'All' ||
    selectedType !== 'All';

  return (
    <div className="filters-row" style={{ alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
      {/* Region Filter */}
      <div>
        <select
          className="filter-select"
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value)}
          aria-label="Filter by Region"
        >
          {regions.map((r) => (
            <option key={r} value={r}>
              {r === 'All' ? '🌐 All Regions' : `📍 ${r}`}
            </option>
          ))}
        </select>
      </div>

      {/* State Filter (if available) */}
      {states.length > 1 && (
        <div>
          <select
            className="filter-select"
            value={selectedState || 'All'}
            onChange={(e) => onStateChange && onStateChange(e.target.value)}
            aria-label="Filter by State"
          >
            {states.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? '🗺️ All States' : `🏛️ ${s}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Period Filter */}
      <div>
        <select
          className="filter-select"
          value={selectedPeriod}
          onChange={(e) => onPeriodChange(e.target.value)}
          aria-label="Filter by Historical Period"
        >
          {periods.map((p) => (
            <option key={p} value={p}>
              {p === 'All' ? '⏳ All Periods' : p}
            </option>
          ))}
        </select>
      </div>

      {/* Heritage Type Filter */}
      <div>
        <select
          className="filter-select"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          aria-label="Filter by Category"
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t === 'All' ? '🏛️ All Categories' : t}
            </option>
          ))}
        </select>
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onReset}
          style={{ padding: '0.5rem 0.85rem' }}
        >
          <span>↺ Reset Filters</span>
        </button>
      )}
    </div>
  );
};

export default FilterBar;
