import React from 'react';

export const LoadingSpinner = ({ message = 'Loading Indian heritage records...' }) => {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <div
        style={{
          display: 'inline-block',
          width: '2.75rem',
          height: '2.75rem',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin-pulse 1s linear infinite',
        }}
      />
      <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
        {message}
      </p>
      <style>{`
        @keyframes spin-pulse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
