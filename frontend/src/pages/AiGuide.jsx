import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { sendChatMessageApi, fetchHeritageSites } from '../services/api';
import { MONUMENTS } from '../data/monuments';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';

export const AiGuide = () => {
  const { currentLanguage, setLanguage, internationalLanguages, indianLanguages } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialSiteSlug = searchParams.get('site') || searchParams.get('heritage') || '';

  const [sitesList, setSitesList] = useState(MONUMENTS);
  const [selectedSiteSlug, setSelectedSiteSlug] = useState(initialSiteSlug);
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'Namaste! I am ItihAI, your intelligent cultural companion for exploring Indian heritage. How may I assist your journey through India today?',
      language: 'en',
      sources: ['Archaeological Survey of India', 'UNESCO World Heritage Center'],
      timestamp: 'Just now',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Load authoritative heritage sites from API to resolve live database IDs
  useEffect(() => {
    const loadSites = async () => {
      try {
        const data = await fetchHeritageSites({ limit: 50 });
        if (data && data.items && data.items.length > 0) {
          setSitesList(data.items);
        }
      } catch (err) {
        console.warn('Using local monument dataset for AI Guide context selector.');
      }
    };
    loadSites();
  }, []);

  // Synchronize site slug from URL if query params change
  useEffect(() => {
    if (initialSiteSlug) {
      setSelectedSiteSlug(initialSiteSlug);
    }
  }, [initialSiteSlug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const activeSite = sitesList.find((m) => m.slug === selectedSiteSlug);

  const handleSendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await sendChatMessageApi({
        message: text.trim(),
        language: currentLanguage || 'en',
        heritageSiteId: activeSite?.id || null,
      });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.response,
        language: response.language || currentLanguage,
        sources: response.heritage_site_name
          ? [response.heritage_site_name, 'Archaeological Survey of India']
          : ['Archaeological Survey of India', 'UNESCO World Heritage Archives'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: err.message || 'I encountered an issue connecting to the AI guide service. Please try again.',
        language: currentLanguage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const starterQuestions = selectedSiteSlug
    ? [
        `Why was ${activeSite?.name || 'this monument'} built?`,
        `What architectural style is ${activeSite?.name || 'this'}?`,
        `What visitor etiquette and shoe rules apply here for foreign tourists?`,
        `Tell me a fascinating historical fact about this place.`,
      ]
    : [
        'Why was the Taj Mahal built?',
        'What temple etiquette should foreign tourists follow in India?',
        'Explain the astronomical sundial wheels at Konark Sun Temple.',
        'What is the history of the Red Fort in Delhi?',
      ];

  return (
    <div className="section" style={{ paddingTop: '2.5rem', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header & Notice */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-saffron">AI CULTURAL COMPANION</span>
              <span className="badge badge-unesco">Powered by Google Gemini</span>
            </div>
            <h1 className="heading-section" style={{ margin: 0 }}>
              Ask ItihAI Cultural Guide
            </h1>
          </div>

          {/* Context Monument Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              Monument Context:
            </label>
            <select
              className="filter-select"
              value={selectedSiteSlug}
              onChange={(e) => setSelectedSiteSlug(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              <option value="">🏛️ General Indian Heritage</option>
              {sitesList.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name} ({m.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat Application Container */}
        <div className="chat-container">
          {/* Header Bar */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">इ</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff' }}>
                  ItihAI Cultural Guide
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)' }}>
                  {activeSite ? `Focus: ${activeSite.name}` : 'Knowledge Base: All Indian Heritage'}
                </span>
              </div>
            </div>

            {/* Language Selector Inside Chat */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Response Language:</span>
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  padding: '0.4rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #475569',
                  background: '#1e293b',
                  color: '#ffffff',
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                <optgroup label="International Languages">
                  {(internationalLanguages || []).map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.nativeName} ({l.name})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Indian Languages">
                  {(indianLanguages || []).map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.nativeName} ({l.name})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {loading && (
              <div className="chat-bubble ai" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '1rem',
                    height: '1rem',
                    border: '2px solid var(--color-border)',
                    borderTopColor: 'var(--color-primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  Consulting cultural knowledge & synthesizing response with Gemini...
                </span>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Suggestions */}
          <ChatInput
            onSendMessage={handleSendMessage}
            language={currentLanguage}
            loading={loading}
            suggestions={starterQuestions}
          />
        </div>

        {/* Informational Footer */}
        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
          🔒 ItihAI maintains Gemini API keys strictly on the backend. Responses are culturally grounded and historically verified.
        </div>
      </div>
    </div>
  );
};

export default AiGuide;
