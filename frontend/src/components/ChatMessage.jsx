import React, { useState } from 'react';
import { speakText } from '../utils/speech';

export const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayVoice = () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    speakText(
      message.text,
      message.language || 'en',
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  return (
    <div className={`chat-bubble ${isUser ? 'user' : 'ai'}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8 }}>
          {isUser ? '👤 You' : '🏛️ ItihAI Cultural Guide'}
        </span>
        <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>
          {message.timestamp || 'Just now'}
        </span>
      </div>

      <div style={{ whiteSpace: 'pre-line' }}>{message.text}</div>

      {/* Citations if available */}
      {message.sources && message.sources.length > 0 && (
        <div className="citation-box">
          <span style={{ fontWeight: 600 }}>Verified Sources:</span>
          {message.sources.map((src, i) => (
            <span key={i} className="citation-chip">
              📖 {src}
            </span>
          ))}
        </div>
      )}

      {/* AI Message Audio Actions */}
      {!isUser && (
        <div className="chat-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handlePlayVoice}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
            title="Read aloud using voice synthesis"
          >
            <span>{isPlayingAudio ? '🔊 Playing...' : '🔈 Listen'}</span>
          </button>

          {message.isDemo && (
            <span
              style={{
                fontSize: '0.7rem',
                color: '#854d0e',
                background: '#fef08a',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                alignSelf: 'center',
              }}
            >
              Demo Preview (LLM in Phase 5)
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
