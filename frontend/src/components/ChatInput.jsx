import React, { useState } from 'react';
import VoiceButton from './VoiceButton';

export const ChatInput = ({ onSendMessage, language = 'en', loading = false, suggestions = [] }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || loading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleVoiceTranscript = (transcript) => {
    if (transcript) {
      setInputText(transcript);
    }
  };

  return (
    <div>
      {/* Suggestion Chips */}
      {suggestions.length > 0 && (
        <div
          style={{
            padding: '0.75rem 1.5rem',
            background: '#ffffff',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', alignSelf: 'center', fontWeight: 600 }}>
            💡 Try asking:
          </span>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSendMessage(s)}
              disabled={loading}
              style={{
                fontSize: '0.8rem',
                padding: '0.3rem 0.75rem',
                background: 'var(--color-saffron-light)',
                color: '#92400e',
                border: '1px solid #fde68a',
                borderRadius: 'var(--radius-full)',
                transition: 'var(--transition)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Main Input Bar */}
      <form onSubmit={handleSubmit} className="chat-input-bar">
        <VoiceButton
          onTranscript={handleVoiceTranscript}
          language={language}
          disabled={loading}
        />

        <input
          type="text"
          className="chat-input"
          placeholder="Ask anything about Indian monuments, history, or temple traditions..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={loading}
          aria-label="Cultural guide question"
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!inputText.trim() || loading}
          style={{ padding: '0.75rem 1.25rem' }}
        >
          {loading ? 'Thinking...' : 'Send →'}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
