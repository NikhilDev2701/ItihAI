/**
 * Speech Utilities for In-Browser Text-to-Speech (TTS) and Speech-to-Text (STT).
 * Provides immediate interactive voice feedback for foreign tourists.
 */

export const isSpeechSynthesisSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export const isSpeechRecognitionSupported = () => {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );
};

/**
 * Synthesize speech in the browser using the Web Speech API.
 */
export const speakText = (text, language = 'en', onStart, onEnd, onError) => {
  if (!isSpeechSynthesisSupported()) {
    console.warn('Speech synthesis is not supported on this browser.');
    if (onError) onError(new Error('Speech synthesis not supported'));
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set language tag
  const langMap = {
    en: 'en-US',
    hi: 'hi-IN',
    bn: 'bn-IN',
    fr: 'fr-FR',
    de: 'de-DE',
    es: 'es-ES',
    ja: 'ja-JP',
    it: 'it-IT',
  };

  utterance.lang = langMap[language] || 'en-US';
  utterance.rate = 0.95; // slightly slower for better tourist comprehension
  utterance.pitch = 1.0;

  // Try to find a matching natural voice
  const voices = window.speechSynthesis.getVoices();
  const targetVoice = voices.find(
    (v) => v.lang.toLowerCase().includes(language) || v.lang.toLowerCase().startsWith(language)
  );
  if (targetVoice) {
    utterance.voice = targetVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Initialize speech recognition listener.
 */
export const createSpeechRecognizer = (language = 'en', onResult, onError, onEnd) => {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  const langMap = {
    en: 'en-US',
    hi: 'hi-IN',
    bn: 'bn-IN',
    fr: 'fr-FR',
    de: 'de-DE',
    es: 'es-ES',
    ja: 'ja-JP',
    it: 'it-IT',
  };

  recognition.lang = langMap[language] || 'en-US';
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    if (onResult) onResult(transcript, event.results[0].isFinal);
  };

  if (onError) recognition.onerror = onError;
  if (onEnd) recognition.onend = onEnd;

  return recognition;
};
