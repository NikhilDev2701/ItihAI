import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Left Text */}
          <div>
            <div className="hero-tag">
              <span>🏛️</span>
              <span>AI-GUIDED MULTILINGUAL HERITAGE TOUR</span>
            </div>

            <h1 className="heading-hero">
              ItihAI
            </h1>

            <p className="hero-tagline">
              "Understand the language, discover the culture"
            </p>

            <p className="hero-desc">
              Your intelligent multilingual companion for discovering India's heritage, history and culture.
            </p>

            <div className="hero-ctas">
              <Link to="/explore" className="btn btn-primary btn-lg">
                <span>{t('explore_heritage')}</span>
                <span>→</span>
              </Link>
              <Link to="/guide" className="btn btn-secondary btn-lg">
                <span>💬</span>
                <span>{t('ask_itihai')}</span>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <h4>35+</h4>
                <p>UNESCO & Iconic Sites</p>
              </div>
              <div className="stat-item">
                <h4>8+</h4>
                <p>Global & Indian Languages</p>
              </div>
              <div className="stat-item">
                <h4>100%</h4>
                <p>Verified Historical Knowledge</p>
              </div>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="hero-visual">
            <div className="hero-card-stack">
              <img
                src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"
                alt="Taj Mahal Agra"
              />
              <div className="hero-card-badge">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span className="badge badge-unesco">Featured Wonder</span>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Agra, India</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Taj Mahal</h3>
                <p style={{ fontSize: '0.825rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  "Echoes of Marble Love" • 4 min audio tour available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
