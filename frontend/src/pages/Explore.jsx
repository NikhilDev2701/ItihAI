import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import HeritageGrid from '../components/HeritageGrid';
import { fetchHeritageSites, fetchHeritageFilters } from '../services/api';

export const Explore = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || 'All');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'All');
  const [selectedPeriod, setSelectedPeriod] = useState(searchParams.get('period') || 'All');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Dynamic filter options state
  const [filterOptions, setFilterOptions] = useState({
    states: [],
    regions: [],
    heritage_types: [],
    historical_periods: [],
  });

  // Data & Status state
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch dynamic filter options once on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const filters = await fetchHeritageFilters();
        if (filters) {
          setFilterOptions(filters);
        }
      } catch (err) {
        console.warn('Error loading dynamic filters:', err);
      }
    };
    loadFilters();
  }, []);

  // 2. Fetch paginated heritage sites when search, filter, or page changes
  const loadSites = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchHeritageSites({
        search: searchQuery,
        region: selectedRegion,
        state: selectedState,
        period: selectedPeriod,
        type: selectedType,
        page: currentPage,
        limit: limit,
      });

      if (response && Array.isArray(response.items)) {
        setSites(response.items);
        setTotalItems(response.total);
        setTotalPages(response.total_pages || 1);
      } else if (Array.isArray(response)) {
        setSites(response);
        setTotalItems(response.length);
        setTotalPages(Math.ceil(response.length / limit) || 1);
      } else {
        setSites([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Failed to load heritage sites:', err);
      setError("We couldn't load the heritage sites. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, [searchQuery, selectedRegion, selectedState, selectedPeriod, selectedType, currentPage, limit]);

  // Reset to page 1 whenever filters or search query change
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleRegionChange = (val) => {
    setSelectedRegion(val);
    setCurrentPage(1);
  };

  const handleStateChange = (val) => {
    setSelectedState(val);
    setCurrentPage(1);
  };

  const handlePeriodChange = (val) => {
    setSelectedPeriod(val);
    setCurrentPage(1);
  };

  const handleTypeChange = (val) => {
    setSelectedType(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRegion('All');
    setSelectedState('All');
    setSelectedPeriod('All');
    setSelectedType('All');
    setCurrentPage(1);
  };

  return (
    <div className="section" style={{ minHeight: '80vh', paddingTop: '3rem', paddingBottom: '5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-saffron">DESTINATION DIRECTORY</span>
            <span className="badge badge-unesco">Verified Heritage APIs</span>
          </div>
          <h1 className="heading-section">Explore India's Heritage</h1>
          <p className="section-subtitle">
            Discover verified historical monuments, ancient stone temples, royal fortresses, rock-cut cave architecture, and UNESCO World Heritage sites across India.
          </p>
        </div>

        {/* Search & Multi-filter Box */}
        <div className="search-filter-box" style={{ marginBottom: '2rem' }}>
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={() => handleSearchChange('')}
          />

          <FilterBar
            filterOptions={filterOptions}
            selectedRegion={selectedRegion}
            onRegionChange={handleRegionChange}
            selectedState={selectedState}
            onStateChange={handleStateChange}
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
            selectedType={selectedType}
            onTypeChange={handleTypeChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Error State */}
        {error && (
          <div
            style={{
              padding: '1.5rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              color: '#991b1b',
            }}
          >
            <div>
              <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Service Notice</strong>
              <span>{error}</span>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={loadSites}
            >
              <span>↺ Try Again</span>
            </button>
          </div>
        )}

        {/* Results Count & Active Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--color-border)',
            fontSize: '0.925rem',
            color: 'var(--color-text-muted)',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div>
            Showing <strong style={{ color: 'var(--color-indigo)' }}>{sites.length}</strong> of{' '}
            <strong style={{ color: 'var(--color-indigo)' }}>{totalItems}</strong> heritage destinations
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
            ● Verified PostgreSQL Database Connected
          </div>
        </div>

        {/* Monuments Grid */}
        <HeritageGrid sites={sites} loading={loading} />

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '3rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{ opacity: currentPage <= 1 ? 0.5 : 1, cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }}
            >
              ← Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCurrentPage(pageNum)}
                style={{
                  minWidth: '2.5rem',
                  fontWeight: currentPage === pageNum ? 700 : 500,
                }}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={{ opacity: currentPage >= totalPages ? 0.5 : 1, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
