import React, { createContext, useContext, useState, useEffect } from 'react';

const TourContext = createContext();

export const TourProvider = ({ children }) => {
  const [activeSite, setActiveSite] = useState(null);
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('itihai_bookmarks')) || [];
    } catch {
      return [];
    }
  });
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem('itihai_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('Unable to persist bookmarks');
    }
  }, [bookmarks]);

  const toggleBookmark = (siteSlug) => {
    setBookmarks((prev) =>
      prev.includes(siteSlug) ? prev.filter((s) => s !== siteSlug) : [...prev, siteSlug]
    );
  };

  const isBookmarked = (siteSlug) => bookmarks.includes(siteSlug);

  const logViewedSite = (site) => {
    if (!site) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((s) => s.slug !== site.slug);
      return [site, ...filtered].slice(0, 5);
    });
  };

  return (
    <TourContext.Provider
      value={{
        activeSite,
        setActiveSite,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        recentlyViewed,
        logViewedSite,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
