import React from 'react';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className="section" style={{ paddingTop: '3.5rem', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-saffron">ABOUT THE PLATFORM</span>
          </div>
          <h1 className="heading-hero" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', marginBottom: '0.75rem' }}>
            ItihAI
          </h1>
          <p className="hero-tagline" style={{ margin: '0 auto 1.5rem', fontSize: '1.4rem' }}>
            "Understand the language, discover the culture"
          </p>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', lineHeight: 1.8, maxWidth: '700px', margin: '0 auto' }}>
            An AI-guided multilingual heritage tour platform designed to make India's profound history, magnificent architecture, and living traditions accessible to international tourists.
          </p>
        </div>

        {/* 1. What is ItihAI? */}
        <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', marginBottom: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-indigo)', marginBottom: '1rem' }}>
            🏛️ What is ItihAI?
          </h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text-main)', marginBottom: '1rem' }}>
            <strong>ItihAI</strong> (derived from <em>Itihasa</em>, the Sanskrit word for "history" or "veritable tradition", and AI) is an intelligent cultural companion. Rather than operating as a generic AI chatbot, ItihAI is built specifically as a tourism-grade cultural guide that merges historical rigor with intuitive language accessibility.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
            It integrates verified archives from the Archaeological Survey of India (ASI) and UNESCO documentation into a high-precision RAG (Retrieval-Augmented Generation) pipeline, delivering dependable, citation-backed answers without hallucination.
          </p>
        </div>

        {/* 2. Why was ItihAI created? */}
        <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', marginBottom: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-indigo)', marginBottom: '1.25rem' }}>
            🌍 Why Was It Created?
          </h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text-main)', marginBottom: '1.5rem' }}>
            India is home to thousands of years of continuous civilization, 42 UNESCO World Heritage Sites, and hundreds of regional spoken dialects. Foreign tourists visiting India often face three major challenges:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1.25rem', background: '#fafaf9', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🗣️</div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-indigo)' }}>The Language Barrier</h3>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Navigating regional signage, local dialects, and negotiating auto fares or monument tickets can be daunting for foreign visitors.
              </p>
            </div>

            <div style={{ padding: '1.25rem', background: '#fafaf9', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📚</div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-indigo)' }}>Fragmented History</h3>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Standard online search yields oversimplified or contradictory stories about complex dynasties and architectural symbolism.
              </p>
            </div>

            <div style={{ padding: '1.25rem', background: '#fafaf9', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🙏</div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-indigo)' }}>Cultural Nuances</h3>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Understanding temple etiquette, dress codes, footwear removal, and sacred customs prevents unintentional cultural disrespect.
              </p>
            </div>
          </div>
        </div>

        {/* 3. How It Helps Foreign Tourists */}
        <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', marginBottom: '3rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-indigo)', marginBottom: '1.25rem' }}>
            ✨ How It Helps Tourists
          </h2>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>1.</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-indigo)' }}>Instant Natural Q&A</h3>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  Ask questions naturally by voice or text and receive clear, culturally sensitive explanations in your native tongue.
                </p>
              </div>
            </li>

            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>2.</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-indigo)' }}>Phonetic Travel Phrasebooks</h3>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  Access practical phrases for bargaining, ordering non-spicy meals, requesting bottled water, and greeting locals with audio pronunciation.
                </p>
              </div>
            </li>

            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>3.</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-indigo)' }}>Hands-Free Audio Narrations</h3>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  Immerse yourself while walking through monuments with high quality voice tours and readable synchronized transcripts.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/explore" className="btn btn-primary btn-lg">
            <span>Start Exploring Indian Heritage</span>
            <span>🏛️</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
