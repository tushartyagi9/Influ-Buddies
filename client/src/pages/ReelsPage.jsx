import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchInfluencers } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import './ReelsPage.css';

const gradients = [
  'linear-gradient(135deg, #833AB4, #E1306C)',
  'linear-gradient(135deg, #405DE6, #5851DB)',
  'linear-gradient(135deg, #F77737, #FCAF45)',
  'linear-gradient(135deg, #E1306C, #F77737)',
  'linear-gradient(135deg, #5851DB, #833AB4)',
  'linear-gradient(135deg, #C13584, #E1306C)',
];

export default function ReelsPage() {
  const { user } = useAuth();
  const [influencers, setInfluencers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchInfluencers()
      .then((data) => {
        const list = Array.isArray(data) ? data : data.influencers || [];
        setInfluencers(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const goNext = () => setCurrent((p) => Math.min(p + 1, influencers.length - 1));
  const goPrev = () => setCurrent((p) => Math.max(p - 1, 0));

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  // Touch swipe support
  const touchStartY = useRef(null);
  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (diff > 50) goNext();
    else if (diff < -50) goPrev();
    touchStartY.current = null;
  };

  if (loading) {
    return (
      <div className="reels-page">
        <div className="reels-loading">
          <div className="reels-spinner" />
          <p>Loading reels...</p>
        </div>
      </div>
    );
  }

  if (!influencers.length) {
    return (
      <div className="reels-page">
        <div className="reels-empty">
          <h2>No reels yet</h2>
          <p>Check back later for influencer profiles!</p>
        </div>
      </div>
    );
  }

  const inf = influencers[current];
  const bg = gradients[current % gradients.length];
  const platforms = [
    inf.instagramHandle && 'Instagram',
    inf.youtubeChannel && 'YouTube',
    inf.tiktokHandle && 'TikTok',
    inf.twitterHandle && 'Twitter',
  ].filter(Boolean);

  return (
    <div
      className="reels-page"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="reel-card">
        {/* Visual Area */}
        <div className="reel-visual" style={{ background: bg }}>
          {inf.imageUrl ? (
            <img src={inf.imageUrl} alt={inf.name} className="reel-image" />
          ) : (
            <div className="reel-play-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="white" opacity="0.8">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          )}
          <div className="reel-overlay-top">
            <span className="reel-counter">{current + 1} / {influencers.length}</span>
          </div>
          <div className="reel-overlay-bottom">
            <h2 className="reel-name">{inf.name}</h2>
            {inf.niche && <span className="reel-niche">{inf.niche}</span>}
          </div>
        </div>

        {/* Info Area */}
        <div className="reel-info">
          <div className="reel-stats">
            <div className="reel-stat">
              <span className="reel-stat-val">{(inf.followers ?? 0).toLocaleString()}</span>
              <span className="reel-stat-label">Followers</span>
            </div>
            <div className="reel-stat">
              <span className="reel-stat-val">{inf.engagement ?? 0}%</span>
              <span className="reel-stat-label">Engagement</span>
            </div>
            <div className="reel-stat">
              <span className="reel-stat-val">${inf.pricePerPost ?? 0}</span>
              <span className="reel-stat-label">Per Post</span>
            </div>
          </div>

          {inf.bio && <p className="reel-bio">{inf.bio}</p>}

          {platforms.length > 0 && (
            <div className="reel-platforms">
              {platforms.map((p) => (
                <span key={p} className="reel-platform-chip">{p}</span>
              ))}
            </div>
          )}

          {inf.location && (
            <p className="reel-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {inf.location}
            </p>
          )}

          <div className="reel-actions">
            <Link to={`/influencer/${inf._id}`} className="reel-btn reel-btn-primary">
              View Profile
            </Link>
            {user && (
              <Link to={`/messages?to=${inf.userId || inf._id}`} className="reel-btn reel-btn-secondary">
                Message
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="reel-nav">
        <button className="reel-nav-btn" onClick={goPrev} disabled={current === 0} aria-label="Previous">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <button className="reel-nav-btn" onClick={goNext} disabled={current === influencers.length - 1} aria-label="Next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>
    </div>
  );
}
