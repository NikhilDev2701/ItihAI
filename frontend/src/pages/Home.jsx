import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Hero from '../components/Hero';
import HeritageCard from '../components/HeritageCard';
import AudioPlayer from '../components/AudioPlayer';
import { MONUMENTS } from '../data/monuments';

export const Home = () => {
  const { t, currentLanguage, setLanguage, activeLanguages } = useLanguage();
  const featuredMonuments = MONUMENTS.slice(0, 3);

  return (
    <div>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Section: Explore India's Heritage */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-saffron" style={{ marginBottom: '0.75rem' }}>
              TIMELESS ARCHITECTURE
            </span>
            <h2 className="heading-section">{t('featured_title')}</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              {t('featured_subtitle')}
            </p>
          </div>

          <div className="heritage-grid">
            {featuredMonuments.map((site) => (
              <HeritageCard key={site.slug} site={site} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/explore" className="btn btn-primary btn-lg">
              <span>{t('view_all_sites')} (8+ Destinations)</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Section: AI-Powered Cultural Guide Showcase */}
      <section className="section section-alt">
        <div className="container">
          <div className="hero-grid" style={{ alignItems: 'center' }}>
            <div>
              <span className="badge badge-saffron" style={{ marginBottom: '0.75rem' }}>
                INTELLIGENT COMPANION
              </span>
              <h2 className="heading-section">AI-Powered Cultural Guide</h2>
              <p className="section-subtitle" style={{ marginBottom: '1.5rem' }}>
                Ask questions in your natural language and receive verified historical and architectural answers grounded in Archaeological Survey of India (ASI) records.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>✓</div>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 700 }}>Zero Hallucinations with RAG</h4>
                    <p style={{ margin: '0.2rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                      Responses cite specific historical chronicles, temple inscriptions, and certified archaeological data.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>✓</div>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 700 }}>Real-Time Cultural Etiquette</h4>
                    <p style={{ margin: '0.2rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                      Learn exact customs for footwear, modest attire, photography permissions, and offering rituals.
                    </p>
                  </div>
                </div>
              </div>

              <Link to="/guide" className="btn btn-primary">
                <span>Try the AI Cultural Guide</span>
                <span>💬</span>
              </Link>
            </div>

            {/* Chat Preview Bubble Box */}
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                <div className="brand-icon" style={{ width: '2.25rem', height: '2.25rem', fontSize: '1.1rem' }}>इ</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--color-indigo)' }}>ItihAI Live Assistant Preview</h4>
                  <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>● Online & Ready</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="chat-bubble user" style={{ alignSelf: 'flex-end', fontSize: '0.9rem' }}>
                  "Why do the Konark Sun Temple chariot wheels have 24 spokes?"
                </div>
                <div className="chat-bubble ai" style={{ fontSize: '0.9rem' }}>
                  "The 24 wheels symbolize the 24 hours of the day (and 12 months in duplicate). Each wheel functions as an intricate astronomical sundial, calculating solar time with pinpoint precision through spoke shadow angles."
                  <div className="citation-box" style={{ marginTop: '0.5rem' }}>
                    <span className="citation-chip">📖 ASI Odisha Archives</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section: Explore India in Your Language */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-saffron" style={{ marginBottom: '0.75rem' }}>
              DESIGNED FOR FOREIGN TOURISTS
            </span>
            <h2 className="heading-section">Explore India in your language</h2>
            <p className="section-subtitle" style={{ margin: '0 auto', maxWidth: '750px' }}>
              Understand India's history, culture and traditions without the language barrier. Choose your language and let ItihAI guide your journey.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginTop: '2.5rem' }}>
            {activeLanguages.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <div
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className="step-card"
                  style={{
                    cursor: 'pointer',
                    background: isSelected ? 'var(--color-primary-light)' : '#ffffff',
                    borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                    textAlign: 'left',
                    padding: '1.5rem',
                    boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    transition: 'var(--transition)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '2.25rem', lineHeight: 1 }}>{lang.flag}</span>
                    <span
                      className="badge"
                      style={{
                        background: lang.type === 'international' ? '#e0e7ff' : '#fef3c7',
                        color: lang.type === 'international' ? 'var(--color-indigo)' : '#92400e',
                        fontSize: '0.7rem',
                      }}
                    >
                      {lang.type === 'international' ? 'International' : 'Indian'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem', color: 'var(--color-indigo)' }}>
                    {lang.nativeName}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                    {lang.name}
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                    {lang.description}
                  </p>
                  {isSelected && (
                    <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      ✓ Active Selection
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/languages" className="btn btn-secondary btn-lg">
              <span>Explore Interactive Phrasebook & Languages</span>
              <span>🗣️</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Section: Listen & Learn Audio Guides */}
      <section className="section section-alt">
        <div className="container">
          <div className="hero-grid" style={{ alignItems: 'center' }}>
            <div>
              <span className="badge badge-saffron" style={{ marginBottom: '0.75rem' }}>
                IMMERSIVE AUDIO
              </span>
              <h2 className="heading-section">{t('listen_learn_title')}</h2>
              <p className="section-subtitle" style={{ marginBottom: '1.5rem' }}>
                Experience monuments hands-free. Listen to evocative story narrations of royal courtiers, master sculptors, and ancient astronomers.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                  <span style={{ color: 'var(--color-primary)' }}>✦</span> In-browser speech synthesis and pre-rendered narrations
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                  <span style={{ color: 'var(--color-primary)' }}>✦</span> Audio playback available in English, Hindi, and Bengali
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                  <span style={{ color: 'var(--color-primary)' }}>✦</span> Full interactive transcripts for easy reading
                </li>
              </ul>
            </div>

            <div>
              <AudioPlayer
                title="Echoes of Marble Love — Taj Mahal Tour"
                transcript="Welcome to the Taj Mahal. As you stand before the Great Gate, look closely at the optical illusion where the monument seems to shrink as you approach. Step forward to explore the symmetry of love and architectural mastery..."
                duration="4 min 15 sec"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section: How It Works */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-saffron" style={{ marginBottom: '0.75rem' }}>
              SEAMLESS WORKFLOW
            </span>
            <h2 className="heading-section">{t('how_it_works_title')}</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Discover → Ask → Understand → Explore
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{t('how_step1')}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                {t('how_step1_desc')}
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{t('how_step2')}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                {t('how_step2_desc')}
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{t('how_step3')}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                {t('how_step3_desc')}
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{t('how_step4')}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                {t('how_step4_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section: Cultural Hospitality Banner */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-indigo), #0f172a)', color: '#ffffff', padding: '4rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>🪔</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', marginBottom: '0.75rem', color: '#ffffff' }}>
            "Atithi Devo Bhava" (अतिथि देवो भव)
          </h2>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-gold)', fontStyle: 'italic', marginBottom: '1rem' }}>
            "The Guest is akin to God"
          </p>
          <p style={{ maxWidth: '650px', margin: '0 auto 2rem', color: '#cbd5e1', lineHeight: 1.7 }}>
            Experience the timeless warmth of Indian hospitality. Let ItihAI guide your footsteps through ancient stone corridors, sacred rivers, and vibrant cultural celebrations.
          </p>
          <Link to="/explore" className="btn btn-primary btn-lg">
            <span>Begin Exploring Heritage</span>
            <span>🏛️</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
