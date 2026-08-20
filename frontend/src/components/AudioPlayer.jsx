import React, { useState, useEffect } from 'react';
import { speakText, stopSpeech } from '../utils/speech';

export const AudioPlayer = ({
  title = 'Heritage Narration',
  transcript = '',
  duration = '3 min 30 sec',
  language = 'en',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakText(
        transcript || title,
        language,
        () => setIsPlaying(true),
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
    }
  };

  return (
    <div className="audio-player-card">
      <button
        type="button"
        className="audio-play-btn"
        onClick={handleTogglePlay}
        aria-label={isPlaying ? 'Pause narration' : 'Play audio guide'}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      <div className="audio-track-info">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold)' }}>
            🎧 AI Audio Guide Narration
          </span>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{duration}</span>
        </div>

        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
          {title}
        </h4>

        {/* Progress simulator */}
        <div
          style={{
            height: '4px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '2px',
            marginTop: '0.75rem',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: isPlaying ? '100%' : '0%',
              background: 'linear-gradient(90deg, var(--color-saffron), var(--color-gold))',
              transition: isPlaying ? 'width 15s linear' : 'none',
            }}
          />
        </div>

        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            style={{ fontSize: '0.8rem', color: 'var(--color-gold)', textDecoration: 'underline' }}
          >
            {showTranscript ? 'Hide Transcript' : 'View Full Transcript'}
          </button>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {isPlaying ? '🔊 Voice Narrator Active' : 'Ready to stream'}
          </span>
        </div>

        {showTranscript && transcript && (
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              lineHeight: 1.6,
              color: '#cbd5e1',
            }}
          >
            "{transcript}"
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
