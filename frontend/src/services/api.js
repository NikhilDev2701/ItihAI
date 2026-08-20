/**
 * ItihAI API Service Layer.
 * Interacts with FastAPI backend (`/api`) with resilient error handling and graceful fallbacks.
 *
 * NOTE: Environment variable VITE_API_BASE_URL can override the default API endpoint.
 * Secret keys are strictly maintained on the backend and NEVER exposed here.
 */

import { MONUMENTS } from '../data/monuments';
import { ACTIVE_LANGUAGES } from '../data/languages';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Health check endpoint test
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Backend currently offline or unreachable; using local mock mode.', error);
    return { status: 'mock_mode', service: 'ItihAI Frontend (Demo Mode)' };
  }
};

/**
 * Fetch dynamic filter categories from PostgreSQL backend
 */
export const fetchHeritageFilters = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/heritage/filters`);
    if (response.ok) {
      const data = await response.json();
      if (data && (data.states?.length > 0 || data.regions?.length > 0)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Heritage filters API unavailable; using fallback default categories.', err);
  }

  // Fallback defaults derived from local data
  return {
    states: ['Delhi', 'Uttar Pradesh', 'West Bengal', 'Odisha', 'Madhya Pradesh', 'Maharashtra', 'Karnataka', 'Bihar'],
    regions: ['North India', 'East India', 'South India', 'West India', 'Central India'],
    heritage_types: ['UNESCO World Heritage', 'Temples & Spiritual', 'Forts & Palaces', 'Monuments & Memorials', 'Caves & Rock-Cut'],
    historical_periods: ['Ancient (Pre-1200 CE)', 'Medieval & Mughal (1200–1750 CE)', 'Colonial (1750–1947 CE)'],
  };
};

/**
 * Fetch paginated heritage sites from PostgreSQL backend with search and multi-criteria filters
 */
export const fetchHeritageSites = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }
    if (filters.state && filters.state !== 'All') {
      params.append('state', filters.state);
    }
    if (filters.region && filters.region !== 'All') {
      params.append('region', filters.region);
    }
    const period = filters.period || filters.historical_period;
    if (period && period !== 'All') {
      params.append('historical_period', period);
    }
    const type = filters.type || filters.heritage_type;
    if (type && type !== 'All') {
      params.append('heritage_type', type);
    }
    if (filters.page) {
      params.append('page', String(filters.page));
    }
    if (filters.limit) {
      params.append('limit', String(filters.limit));
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/heritage${queryString}`);

    if (response.ok) {
      const data = await response.json();
      // Handle paginated object response { items, total, page, limit, total_pages }
      if (data && Array.isArray(data.items)) {
        return data;
      }
      // Handle legacy array response
      if (Array.isArray(data)) {
        return {
          items: data,
          total: data.length,
          page: 1,
          limit: data.length,
          total_pages: 1,
        };
      }
    }
  } catch (err) {
    console.warn('PostgreSQL API unavailable; falling back to local dataset.', err);
  }

  // Fallback filtering over local dataset
  let results = [...MONUMENTS];
  if (filters.search && filters.search.trim()) {
    const term = filters.search.trim().toLowerCase();
    results = results.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.location.toLowerCase().includes(term) ||
        (m.state && m.state.toLowerCase().includes(term)) ||
        (m.shortDescription && m.shortDescription.toLowerCase().includes(term)) ||
        (m.description && m.description.toLowerCase().includes(term))
    );
  }
  if (filters.state && filters.state !== 'All') {
    results = results.filter((m) => m.state === filters.state);
  }
  if (filters.region && filters.region !== 'All') {
    results = results.filter((m) => m.region === filters.region || (m.region && m.region.includes(filters.region.replace(' India', ''))));
  }
  const period = filters.period || filters.historical_period;
  if (period && period !== 'All') {
    results = results.filter((m) => (m.period || m.historical_period || '').includes(period));
  }
  const type = filters.type || filters.heritage_type;
  if (type && type !== 'All') {
    results = results.filter((m) => (m.type || m.heritage_type) === type);
  }

  const page = filters.page || 1;
  const limit = filters.limit || 6;
  const total = results.length;
  const total_pages = Math.ceil(total / limit) || 0;
  const startIndex = (page - 1) * limit;
  const paginatedItems = results.slice(startIndex, startIndex + limit);

  return {
    items: paginatedItems,
    total,
    page,
    limit,
    total_pages,
  };
};

/**
 * Fetch single heritage site by slug
 */
export const fetchHeritageSiteBySlug = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/heritage/slug/${slug}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.name) return data;
    }
  } catch (err) {
    console.warn(`PostgreSQL API unavailable for site slug '${slug}'; checking generic endpoint or local fallback.`, err);
  }

  // Try direct generic endpoint as fallback
  try {
    const directRes = await fetch(`${API_BASE_URL}/heritage/${slug}`);
    if (directRes.ok) {
      const data = await directRes.json();
      if (data && data.name) return data;
    }
  } catch (err) {
    // Proceed to local fallback
  }

  const localSite = MONUMENTS.find((m) => m.slug === slug);
  return localSite || null;
};

/**
 * Fetch single heritage site by integer ID
 */
export const fetchHeritageSiteById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/heritage/${id}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.name) return data;
    }
  } catch (err) {
    console.warn(`PostgreSQL API unavailable for site ID ${id}; using local fallback.`, err);
  }

  const localSite = MONUMENTS.find((m) => m.id === Number(id));
  return localSite || null;
};

/**
 * Fetch supported languages from PostgreSQL backend
 */
export const fetchLanguages = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/languages`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Languages API unavailable; falling back to local language list.', err);
  }

  return ACTIVE_LANGUAGES;
};

/**
 * Send Chat Message to ItihAI AI Guide (POST /api/ai/chat)
 * Powered by Google Gemini via FastAPI backend.
 */
export const sendChatMessageApi = async ({ message, language = 'en', heritageSiteId = null }) => {
  const payload = {
    message: message.trim(),
    language: language || 'en',
  };
  if (heritageSiteId) {
    payload.heritage_site_id = Number(heritageSiteId);
  }

  const response = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server returned status ${response.status}`);
  }

  return await response.json();
};

/**
 * Ask Cultural Guide (Backward-compatible wrapper routing to live Gemini API or fallback)
 */
export const askCulturalGuideApi = async ({ query, siteSlug, language = 'en', heritageSiteId = null }) => {
  try {
    const result = await sendChatMessageApi({
      message: query,
      language,
      heritageSiteId,
    });
    return {
      query,
      response_text: result.response,
      language: result.language,
      heritage_site_name: result.heritage_site_name,
      context_sources: result.heritage_site_name ? [result.heritage_site_name] : ['Archaeological Survey of India'],
      is_demo: false,
    };
  } catch (err) {
    console.error('Error connecting to ItihAI AI Guide API:', err);
    throw err;
  }
};

/**
 * Translate Text (Demo Simulation)
 */
export const translateTextApi = async ({ text, sourceLanguage = 'en', targetLanguage = 'hi' }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/culture/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        source_language: sourceLanguage,
        target_language: targetLanguage,
      }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    // Local fallback
  }

  return {
    original_text: text,
    translated_text: `[${targetLanguage.toUpperCase()}]: ${text}`,
    source_language: sourceLanguage,
    target_language: targetLanguage,
    is_demo: true,
  };
};
