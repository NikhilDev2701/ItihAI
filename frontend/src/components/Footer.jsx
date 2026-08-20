import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="brand-icon" style={{ width: '2rem', height: '2rem', fontSize: '1rem' }}>इ</div>
              <h3 style={{ margin: 0 }}>ItihAI</h3>
            </div>
            <p className="footer-tagline">"Understand the language, discover the culture"</p>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', maxWidth: '340px', lineHeight: 1.6 }}>
              An intelligent multilingual heritage tour platform designed for international travelers exploring the monuments, dynasties, and living traditions of India.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/">{t('nav_home')}</Link></li>
              <li><Link to="/explore">{t('nav_explore')}</Link></li>
              <li><Link to="/guide">{t('nav_guide')}</Link></li>
              <li><Link to="/languages">{t('nav_languages')}</Link></li>
              <li><Link to="/about">{t('nav_about')}</Link></li>
            </ul>
          </div>

          {/* Featured Monuments */}
          <div className="footer-col">
            <h4>Destinations</h4>
            <ul>
              <li><Link to="/heritage/taj-mahal">Taj Mahal, Agra</Link></li>
              <li><Link to="/heritage/red-fort">Red Fort, Delhi</Link></li>
              <li><Link to="/heritage/qutub-minar">Qutub Minar, Delhi</Link></li>
              <li><Link to="/heritage/konark-sun-temple">Konark Sun Temple</Link></li>
              <li><Link to="/heritage/victoria-memorial">Victoria Memorial</Link></li>
              <li><Link to="/heritage/bishnupur-temples">Bishnupur Temples</Link></li>
            </ul>
          </div>

          {/* Architecture & AI */}
          <div className="footer-col">
            <h4>Technology & Trust</h4>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1rem' }}>
              Built with verified Archaeological Survey of India records, UNESCO archives, and multilingual RAG pipelines.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-unesco">UNESCO Sites</span>
              <span className="badge badge-saffron">ASI Verified</span>
              <span className="badge badge-demo">Phase 2 UI</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} ItihAI Heritage Tour Platform. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy</span>
            <span>Terms</span>
            <span>ASI Cultural Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
