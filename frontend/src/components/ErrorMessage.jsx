import React from 'react';

export const ErrorMessage = ({ message = 'An unexpected error occurred.', onRetry }) => {
  return (
    <div
      style={{
        padding: '1.5rem',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: 'var(--radius-md)',
        color: '#991b1b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '1.5rem 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
        <div>
          <h4 style={{ margin: 0, fontWeight: 700 }}>Something went wrong</h4>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#b91c1c' }}>{message}</p>
        </div>
      </div>

      {onRetry && (
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onRetry}
          style={{ borderColor: '#f87171', color: '#991b1b' }}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
