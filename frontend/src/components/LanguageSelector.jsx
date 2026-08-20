import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { INTERNATIONAL_LANGUAGES, INDIAN_LANGUAGES, ACTIVE_LANGUAGES } from '../data/languages';

export const LanguageSelector = ({ compact = false }) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLangObj = ACTIVE_LANGUAGES.find((l) => l.code === currentLanguage) || ACTIVE_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="language-selector-wrap" ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: compact ? '0.35rem 0.8rem' : '0.5rem 1rem',
          borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{currentLangObj.flag}</span>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{currentLangObj.nativeName}</span>
        <span style={{ fontSize: '0.65rem', opacity: 0.7, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            padding: '0.5rem',
            width: '260px',
            maxHeight: '420px',
            overflowY: 'auto',
            zIndex: 1050,
          }}
        >
          {/* Section: International Languages */}
          <div
            style={{
              padding: '0.35rem 0.6rem 0.25rem',
              fontSize: '0.7rem',
              color: 'var(--color-primary)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            🌍 International Languages
          </div>

          {INTERNATIONAL_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'var(--color-primary-light)' : 'transparent',
                  color: isSelected ? 'var(--color-primary)' : 'var(--color-text-main)',
                  fontWeight: isSelected ? 700 : 500,
                  textAlign: 'left',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  marginBottom: '2px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{lang.flag}</span>
                  <div>
                    <div style={{ fontSize: '0.9rem', lineHeight: 1.2 }}>{lang.nativeName}</div>
                    <div style={{ fontSize: '0.75rem', color: isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                      {lang.name}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <span style={{ color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 700 }}>✓</span>
                )}
              </button>
            );
          })}

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--color-border)', margin: '0.4rem 0' }} />

          {/* Section: Indian Languages */}
          <div
            style={{
              padding: '0.35rem 0.6rem 0.25rem',
              fontSize: '0.7rem',
              color: '#d97706',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            🇮🇳 Indian Regional Languages
          </div>

          {INDIAN_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'var(--color-primary-light)' : 'transparent',
                  color: isSelected ? 'var(--color-primary)' : 'var(--color-text-main)',
                  fontWeight: isSelected ? 700 : 500,
                  textAlign: 'left',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  marginBottom: '2px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{lang.flag}</span>
                  <div>
                    <div style={{ fontSize: '0.9rem', lineHeight: 1.2 }}>{lang.nativeName}</div>
                    <div style={{ fontSize: '0.75rem', color: isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                      {lang.name}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <span style={{ color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 700 }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
