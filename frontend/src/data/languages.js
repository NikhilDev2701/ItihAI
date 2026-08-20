/**
 * Supported Languages for ItihAI
 * Designed primarily for international foreign tourists visiting India,
 * with support for major global languages and key Indian regional languages.
 */

export const INTERNATIONAL_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    type: 'international',
    description: 'International tourist standard language & global lingua franca',
    isDefault: true,
    active: true,
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    type: 'international',
    description: 'For travelers from France, Canada, Belgium, Switzerland & Francophone regions',
    active: true,
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    type: 'international',
    description: 'For travelers from Germany, Austria, Switzerland & Central Europe',
    active: true,
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    type: 'international',
    description: 'For travelers from Spain, Mexico, and across Latin America',
    active: true,
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    type: 'international',
    description: 'For travelers from Japan, cultural historians & Buddhist circuit visitors',
    active: true,
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    type: 'international',
    description: 'For travelers from Italy, art historians & architectural enthusiasts',
    active: true,
  },
];

export const INDIAN_LANGUAGES = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    type: 'indian',
    description: 'Most widely spoken national language across North & Central India',
    active: true,
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇮🇳',
    type: 'indian',
    description: 'Rich cultural and literary language of Eastern India & Bengal heritage',
    active: true,
  },
];

export const ACTIVE_LANGUAGES = [...INTERNATIONAL_LANGUAGES, ...INDIAN_LANGUAGES];
export const ALL_LANGUAGES = ACTIVE_LANGUAGES;
export const UPCOMING_LANGUAGES = [];
