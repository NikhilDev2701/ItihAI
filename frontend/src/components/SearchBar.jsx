import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const SearchBar = ({ value, onChange, onClear }) => {
  const { t } = useLanguage();

  return (
    <div className="search-input-wrap">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        placeholder={t('search_placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search Heritage Sites"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          style={{
            position: 'absolute',
            right: '1.25rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-light)',
            fontSize: '1.1rem',
            padding: '0.25rem',
          }}
          aria-label="Clear Search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
