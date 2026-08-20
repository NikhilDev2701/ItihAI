import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTour } from '../context/TourContext';

const NEUTRAL_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='100%25' height='100%25' fill='%231a1528'/%3E%3Ctext x='50%25' y='46%25' dominant-baseline='middle' text-anchor='middle' fill='%23e0a96d' font-family='sans-serif' font-size='48'%3E🏛️%3C/text%3E%3Ctext x='50%25' y='58%25' dominant-baseline='middle' text-anchor='middle' fill='%23a7a2bd' font-family='sans-serif' font-size='18'%3EHeritage Image Unavailable%3C/text%3E%3C/svg%3E";

export const HeritageCard = ({ site }) => {
  const { isBookmarked, toggleBookmark } = useTour();
  const initialImage = site.image_url || site.image || NEUTRAL_PLACEHOLDER;
  const [imgSrc, setImgSrc] = useState(initialImage);
  const bookmarked = isBookmarked(site.slug);

  // Sync state if site prop updates
  React.useEffect(() => {
    setImgSrc(site.image_url || site.image || NEUTRAL_PLACEHOLDER);
  }, [site.image_url, site.image]);

  const description = site.description || site.shortDescription || '';
  const periodText = (site.historical_period || site.period || '').split(' ')[0] || 'Historical';
  const regionText = site.region || site.state || 'India';
  const isUnesco = site.isUnesco || (site.heritage_type && site.heritage_type.includes('UNESCO'));

  const handleImageError = () => {
    if (imgSrc !== NEUTRAL_PLACEHOLDER) {
      setImgSrc(NEUTRAL_PLACEHOLDER);
    }
  };

  return (
    <article className="heritage-card">
      <div className="card-image-wrap">
        <img
          src={imgSrc}
          alt={site.name}
          loading="lazy"
          onError={handleImageError}
        />
        
        <div className="card-badges">
          {isUnesco && <span className="badge badge-unesco">UNESCO</span>}
          <span className="badge badge-saffron">{regionText}</span>
        </div>

        <button
          type="button"
          className={`card-bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            toggleBookmark(site.slug);
          }}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark site'}
          title={bookmarked ? 'Bookmarked' : 'Save to wishlist'}
        >
          {bookmarked ? '★' : '☆'}
        </button>
      </div>

      <div className="card-body">
        <div className="card-meta">
          <span>📍 {site.location}</span>
          <span>•</span>
          <span>🏛️ {periodText}</span>
        </div>

        <h3 className="card-title">{site.name}</h3>

        <p className="card-desc">{description}</p>

        <div className="card-footer">
          <Link to={`/explore/${site.slug}`} className="btn btn-primary btn-sm">
            <span>Explore Details</span>
            <span>→</span>
          </Link>
          
          <Link
            to={`/guide?site=${site.slug}`}
            className="btn btn-secondary btn-sm"
            title={`Ask ItihAI about ${site.name}`}
          >
            <span>💬 Ask AI</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default HeritageCard;
