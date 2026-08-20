import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export const Navbar = () => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Brand */}
          <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
            <div className="brand-icon">इ</div>
            <div>
              <span style={{ letterSpacing: '-0.03em' }}>ItihAI</span>
              <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--color-primary)', fontWeight: 600, marginTop: '-3px' }}>
                HERITAGE TOUR AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav>
            <ul className="navbar-links">
              <li>
                <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  {t('nav_home')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/explore" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  {t('nav_explore')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/guide" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  {t('nav_guide')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/languages" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  {t('nav_languages')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  {t('nav_about')}
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Actions */}
          <div className="navbar-actions">
            <LanguageSelector compact />
            
            <Link to="/explore" className="btn btn-primary btn-sm" style={{ display: 'none', md: 'inline-flex' }}>
              <span>{t('start_journey')}</span>
              <span>→</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav open">
          <ul className="mobile-links">
            <li>
              <NavLink to="/" onClick={closeMobileMenu} className="nav-link">
                {t('nav_home')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/explore" onClick={closeMobileMenu} className="nav-link">
                {t('nav_explore')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/guide" onClick={closeMobileMenu} className="nav-link">
                {t('nav_guide')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/languages" onClick={closeMobileMenu} className="nav-link">
                {t('nav_languages')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={closeMobileMenu} className="nav-link">
                {t('nav_about')}
              </NavLink>
            </li>
          </ul>
          <Link to="/explore" onClick={closeMobileMenu} className="btn btn-primary" style={{ width: '100%' }}>
            {t('start_journey')} →
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
