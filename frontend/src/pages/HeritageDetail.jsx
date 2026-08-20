import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchHeritageSiteBySlug } from '../services/api';
import { useTour } from '../context/TourContext';
import AudioPlayer from '../components/AudioPlayer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const NEUTRAL_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600' viewBox='0 0 1200 600'%3E%3Crect width='100%25' height='100%25' fill='%231a1528'/%3E%3Ctext x='50%25' y='46%25' dominant-baseline='middle' text-anchor='middle' fill='%23e0a96d' font-family='sans-serif' font-size='64'%3E🏛️%3C/text%3E%3Ctext x='50%25' y='58%25' dominant-baseline='middle' text-anchor='middle' fill='%23a7a2bd' font-family='sans-serif' font-size='22'%3EHeritage Landmark Archive%3C/text%3E%3C/svg%3E";

export const HeritageDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark, logViewedSite } = useTour();

  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(NEUTRAL_PLACEHOLDER);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadSite = async () => {
      setLoading(true);
      try {
        const data = await fetchHeritageSiteBySlug(slug);
        setSite(data);
        if (data) {
          setImgSrc(data.image_url || data.image || NEUTRAL_PLACEHOLDER);
          logViewedSite(data);
        }
      } catch (err) {
        console.error('Error fetching heritage site details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSite();
  }, [slug]);

  if (loading) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container">
          <LoadingSpinner message="Discovering verified historical and architectural archives..." />
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="section" style={{ minHeight: '60vh', paddingTop: '4rem' }}>
        <div className="container">
          <ErrorMessage
            message="We could not locate this heritage site in our database."
            onRetry={() => navigate('/explore')}
          />
        </div>
      </div>
    );
  }

  const bookmarked = isBookmarked(site.slug);
  const overviewText = site.description || site.overview || '';
  const historyText = site.historical_overview || site.history || overviewText;
  const architectureText = site.architecture || 'Detailed architectural study available via Archaeological Survey of India archives.';
  const significanceText = site.cultural_significance || site.culturalSignificance || 'Cultural and historical landmark of national and international significance.';
  const periodText = site.historical_period || site.period || 'Historical';
  const regionText = site.region || site.state || 'India';
  const isUnesco = site.heritage_type?.includes('UNESCO') || site.isUnesco;
  const factsList = site.interesting_facts || site.interestingFacts || [];
  const traditionsList = site.local_traditions || site.localTraditions || [];
  const attractionsList = site.nearby_attractions || site.nearbyAttractions || [];
  const visitInfo = site.visitor_information || site.visitingInfo || {
    bestTime: 'October to March (Pleasant winter weather)',
    hours: 'Sunrise to Sunset (General ASI timings)',
    entryFee: 'Standard monument entry fee applies',
    dressCode: 'Modest attire recommended; remove footwear before entering inner sanctums',
    photography: 'Permitted in courtyards & exterior areas',
  };

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* 1. Large Hero Banner */}
      <div style={{ position: 'relative', height: '480px', overflow: 'hidden', background: '#0f172a' }}>
        <img
          src={imgSrc}
          alt={site.name}
          onError={() => setImgSrc(NEUTRAL_PLACEHOLDER)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 60%, transparent 100%)',
          }}
        />

        <div className="container" style={{ position: 'absolute', bottom: '2.5rem', left: 0, right: 0 }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: '#cbd5e1' }}>Home</Link>
            <span>/</span>
            <Link to="/explore" style={{ color: '#cbd5e1' }}>Explore</Link>
            <span>/</span>
            <span style={{ color: 'var(--color-gold)' }}>{site.name}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            {isUnesco && <span className="badge badge-unesco">UNESCO World Heritage</span>}
            <span className="badge badge-saffron">{regionText}</span>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
              {periodText}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#ffffff', margin: 0 }}>
                {site.name}
              </h1>
              <p style={{ color: 'var(--color-gold)', fontSize: '1.1rem', marginTop: '0.25rem' }}>
                📍 {site.location}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => toggleBookmark(site.slug)}
                style={{ background: 'rgba(255,255,255,0.9)' }}
              >
                <span>{bookmarked ? '★ Bookmarked' : '☆ Save to Wishlist'}</span>
              </button>

              <Link to={`/guide?site=${site.slug}`} className="btn btn-primary btn-sm">
                <span>💬 Ask ItihAI about this place</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Details */}
      <div className="container" style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {/* Left Column: Rich Information */}
          <div style={{ gridColumn: 'span 2' }}>
            {/* Audio Guide Spotlight */}
            {site.audioNarration && (
              <div style={{ marginBottom: '2.5rem' }}>
                <AudioPlayer
                  title={`${site.audioNarration.title} — ${site.name}`}
                  transcript={site.audioNarration.transcript}
                  duration={site.audioNarration.duration}
                />
              </div>
            )}

            {/* Navigation Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                borderBottom: '2px solid var(--color-border)',
                marginBottom: '2rem',
                overflowX: 'auto',
                paddingBottom: '2px',
              }}
            >
              {[
                { key: 'overview', label: '📜 Overview & History' },
                { key: 'architecture', label: '🏛️ Architecture' },
                { key: 'significance', label: '🪔 Cultural Significance' },
                { key: 'facts', label: '💡 Interesting Facts' },
                { key: 'traditions', label: '🙏 Local Traditions' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    borderBottom: activeTab === tab.key ? '2px solid var(--color-primary)' : '2px solid transparent',
                    marginBottom: '-2px',
                    whiteSpace: 'nowrap',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-indigo)', marginBottom: '1rem' }}>
                  Historical Overview
                </h3>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text-main)', marginBottom: '1.5rem' }}>
                  {overviewText}
                </p>
                <h4 style={{ fontSize: '1.2rem', color: 'var(--color-indigo)', marginBottom: '0.75rem' }}>
                  Chronicles & Construction
                </h4>
                <p style={{ lineHeight: 1.8, color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                  {historyText}
                </p>
              </div>
            )}

            {activeTab === 'architecture' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-indigo)', marginBottom: '1rem' }}>
                  Architectural Mastery
                </h3>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text-main)', marginBottom: '1.5rem' }}>
                  {architectureText}
                </p>
              </div>
            )}

            {activeTab === 'significance' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-indigo)', marginBottom: '1rem' }}>
                  Cultural & Philosophical Significance
                </h3>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text-main)', marginBottom: '1.5rem' }}>
                  {significanceText}
                </p>
              </div>
            )}

            {activeTab === 'facts' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-indigo)', marginBottom: '1rem' }}>
                  Fascinating Facts
                </h3>
                {factsList.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {factsList.map((fact, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '1.25rem',
                          background: '#ffffff',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          gap: '1rem',
                          alignItems: 'flex-start',
                        }}
                      >
                        <span style={{ fontSize: '1.5rem' }}>💡</span>
                        <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--color-text-main)' }}>
                          {fact}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--color-text-muted)' }}>Additional archaeological notes are being compiled for this heritage landmark.</p>
                )}
              </div>
            )}

            {activeTab === 'traditions' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-indigo)', marginBottom: '1rem' }}>
                  Local Customs & Etiquette
                </h3>
                {traditionsList.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {traditionsList.map((trad, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '1.5rem',
                          background: 'var(--color-saffron-light)',
                          border: '1px solid #fde68a',
                          borderRadius: 'var(--radius-md)',
                        }}
                      >
                        <h4 style={{ margin: 0, color: '#92400e', fontSize: '1.1rem', fontWeight: 700 }}>
                          🙏 {trad.title}
                        </h4>
                        <p style={{ margin: '0.5rem 0 0.75rem', color: '#78350f', lineHeight: 1.6 }}>
                          {trad.description}
                        </p>
                        {trad.tip && (
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#b45309' }}>
                            💡 Traveler Tip: {trad.tip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--color-text-muted)' }}>Please follow standard respectful tourist etiquette and dress modestly when visiting.</p>
                )}
              </div>
            )}

            {/* Nearby Attractions */}
            {attractionsList.length > 0 && (
              <div style={{ marginTop: '3.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-indigo)', marginBottom: '1rem' }}>
                  Nearby Attractions in {site.state}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  {attractionsList.map((attr, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1.25rem',
                        background: '#ffffff',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-indigo)' }}>{attr.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>{attr.distance}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                        {attr.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Visitor Practical Guide & CTA */}
          <div>
            <div
              style={{
                position: 'sticky',
                top: '6rem',
                background: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-indigo)', marginBottom: '1.25rem', fontWeight: 700 }}>
                Practical Visitor Guide
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: 'var(--color-text-light)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>
                    BEST TIME TO VISIT
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {visitInfo.bestTime || visitInfo.best_time || 'October to March'}
                  </span>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-light)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>
                    TIMINGS
                  </span>
                  <span style={{ color: 'var(--color-text-main)' }}>
                    {visitInfo.hours || 'Sunrise to Sunset'}
                  </span>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-light)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>
                    FOREIGN TOURIST ENTRY FEE
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                    {visitInfo.entryFee || visitInfo.entry_fee || 'Standard entry applies'}
                  </span>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-light)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>
                    DRESS CODE & ETIQUETTE
                  </span>
                  <span style={{ color: 'var(--color-text-main)' }}>
                    {visitInfo.dressCode || visitInfo.dress_code || 'Modest clothing recommended'}
                  </span>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-light)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>
                    PHOTOGRAPHY RULES
                  </span>
                  <span style={{ color: 'var(--color-text-main)' }}>
                    {visitInfo.photography || 'Permitted in exterior areas'}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                <Link
                  to={`/guide?site=${site.slug}`}
                  className="btn btn-primary"
                  style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
                >
                  <span>Ask ItihAI about {site.name}</span>
                  <span>💬</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeritageDetail;
