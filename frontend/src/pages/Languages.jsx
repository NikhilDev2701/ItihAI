import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { INTERNATIONAL_LANGUAGES, INDIAN_LANGUAGES } from '../data/languages';
import { PHRASES, PHRASEBOOK_CATEGORIES } from '../data/phrasebook';
import { speakText } from '../utils/speech';

export const Languages = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [playingPhraseId, setPlayingPhraseId] = useState(null);

  const filteredPhrases =
    selectedCategory === 'All'
      ? PHRASES
      : PHRASES.filter((p) => p.category === selectedCategory);

  const handlePlayVoice = (text, lang, phraseId) => {
    setPlayingPhraseId(phraseId);
    speakText(
      text,
      lang,
      () => setPlayingPhraseId(phraseId),
      () => setPlayingPhraseId(null),
      () => setPlayingPhraseId(null)
    );
  };

  return (
    <div className="section" style={{ paddingTop: '3rem', minHeight: '80vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-saffron">FOREIGN TOURIST MULTILINGUAL SUPPORT</span>
            <span className="badge badge-unesco">8 Supported Languages</span>
          </div>
          <h1 className="heading-section">Multilingual Support & Travel Phrasebook</h1>
          <p className="section-subtitle" style={{ fontSize: '1.15rem', color: 'var(--color-indigo)', fontWeight: 500 }}>
            ItihAI helps international travelers understand India's heritage and culture in the language they are most comfortable with.
          </p>
        </div>

        {/* 1. International Languages */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-indigo)', margin: 0 }}>
                🌍 Primary International Languages
              </h2>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                Tailored for global tourists exploring historical monuments and cultural routes across India.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {INTERNATIONAL_LANGUAGES.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <div
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  style={{
                    padding: '1.5rem',
                    background: isSelected ? 'var(--color-primary-light)' : '#ffffff',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    position: 'relative',
                    boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '2.25rem', lineHeight: 1 }}>{lang.flag}</span>
                    <span
                      className="badge"
                      style={{
                        background: isSelected ? 'var(--color-primary)' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#475569',
                        fontWeight: 600,
                      }}
                    >
                      {isSelected ? 'Active Selection' : 'Select'}
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.25rem', color: 'var(--color-indigo)' }}>
                    {lang.nativeName} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>({lang.name})</span>
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    {lang.description}
                  </p>
                  {isSelected && (
                    <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      ✓ Current UI & Guide Language
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Indian Regional Languages */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-indigo)', margin: 0 }}>
              🇮🇳 Indian Regional Languages
            </h2>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Key national and regional languages spoken across popular heritage circuits.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {INDIAN_LANGUAGES.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <div
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  style={{
                    padding: '1.5rem',
                    background: isSelected ? 'var(--color-primary-light)' : '#ffffff',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    position: 'relative',
                    boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '2.25rem', lineHeight: 1 }}>{lang.flag}</span>
                    <span
                      className="badge"
                      style={{
                        background: isSelected ? 'var(--color-primary)' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#475569',
                        fontWeight: 600,
                      }}
                    >
                      {isSelected ? 'Active Selection' : 'Select'}
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.25rem', color: 'var(--color-indigo)' }}>
                    {lang.nativeName} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>({lang.name})</span>
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    {lang.description}
                  </p>
                  {isSelected && (
                    <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      ✓ Current UI & Guide Language
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase Disclaimer Notice */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem',
            marginBottom: '4rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>💡</span>
          <div>
            <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', color: 'var(--color-indigo)' }}>
              Frontend Language Switcher (Phase 2 Preview)
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Selecting any language above updates the navigation, categories, and AI prompt context. Live neural translation and speech synthesis will connect to the backend translation pipeline in the upcoming Translation API phase.
            </p>
          </div>
        </div>

        {/* 3. Interactive Travel Phrasebook */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-indigo)', margin: 0 }}>
                Tourist Essential Phrasebook
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                Everyday phrases translated from English to Hindi & Bengali with phonetic guides and audio pronunciation for on-the-ground communication.
              </p>
            </div>

            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {PHRASEBOOK_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.4rem 0.9rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-full)',
                    background: selectedCategory === cat ? 'var(--color-indigo)' : '#ffffff',
                    color: selectedCategory === cat ? '#ffffff' : 'var(--color-text-muted)',
                    border: '1px solid var(--color-border)',
                    whiteSpace: 'nowrap',
                    transition: 'var(--transition)',
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Phrases Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {filteredPhrases.map((phrase) => (
              <div
                key={phrase.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                      {phrase.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                      #{phrase.id}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', color: 'var(--color-indigo)', marginBottom: '1rem', fontWeight: 600 }}>
                    "{phrase.english}"
                  </h3>

                  {/* Hindi & Bengali Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                    {/* Hindi */}
                    <div
                      style={{
                        padding: '0.75rem',
                        background: 'var(--color-saffron-light)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#92400e' }}>
                          {phrase.hindi}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#b45309', fontStyle: 'italic' }}>
                          Phonetic: "{phrase.hindiTranslit}"
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePlayVoice(phrase.hindi, 'hi', `hi-${phrase.id}`)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                        title="Listen to Hindi pronunciation"
                      >
                        {playingPhraseId === `hi-${phrase.id}` ? '🔊 Playing' : '🔈 Listen'}
                      </button>
                    </div>

                    {/* Bengali */}
                    <div
                      style={{
                        padding: '0.75rem',
                        background: '#f1f5f9',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                          {phrase.bengali}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#475569', fontStyle: 'italic' }}>
                          Phonetic: "{phrase.bengaliTranslit}"
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePlayVoice(phrase.bengali, 'bn', `bn-${phrase.id}`)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                        title="Listen to Bengali pronunciation"
                      >
                        {playingPhraseId === `bn-${phrase.id}` ? '🔊 Playing' : '🔈 Listen'}
                      </button>
                    </div>
                  </div>
                </div>

                {phrase.context && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', borderTop: '1px dashed var(--color-border)', paddingTop: '0.5rem' }}>
                    💡 <strong>Traveler Context:</strong> {phrase.context}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Languages;
