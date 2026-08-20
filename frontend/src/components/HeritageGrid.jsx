import React from 'react';
import HeritageCard from './HeritageCard';

export const HeritageGrid = ({ sites = [], loading = false }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div style={{ display: 'inline-block', width: '2.5rem', height: '2.5rem', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Loading Indian heritage wonders...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-indigo)', marginBottom: '0.5rem' }}>No Heritage Sites Found</h3>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto' }}>
          Try clearing your search query or selecting a different region or historical period filter.
        </p>
      </div>
    );
  }

  return (
    <div className="heritage-grid">
      {sites.map((site) => (
        <HeritageCard key={site.id || site.slug} site={site} />
      ))}
    </div>
  );
};

export default HeritageGrid;
