import React, { useState, useEffect } from 'react';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../utils/speech';

export const VoiceButton = ({ onTranscript, language = 'en', disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
  }, []);

  const handleToggleListening = () => {
    if (disabled) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    if (!isSupported) {
      // Simulate voice input for testing/browser compatibility
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        if (onTranscript) {
          onTranscript('Why was the Taj Mahal built?');
        }
      }, 2000);
      return;
    }

    const recognizer = createSpeechRecognizer(
      language,
      (text, isFinal) => {
        if (onTranscript) onTranscript(text);
        if (isFinal) setIsListening(false);
      },
      (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (recognizer) {
      try {
        recognizer.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  return (
    <button
      type="button"
      className={`voice-mic-btn ${isListening ? 'listening' : ''}`}
      onClick={handleToggleListening}
      disabled={disabled}
      aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      title={
        isListening
          ? 'Listening... Click to stop'
          : isSupported
          ? 'Ask with voice'
          : 'Voice demo simulation'
      }
    >
      <span>{isListening ? '🔴' : '🎙️'}</span>
    </button>
  );
};

export default VoiceButton;
