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

function formatCount(n) {
  if (!n) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

export default function ReelsPage() {
  const { user } = useAuth();
  const [influencers, setInfluencers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    fetchInfluencers({ limit: 100 })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.items || data.influencers || [];
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

  // Double-tap to like
  const lastTap = useRef(0);
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      const inf = influencers[current];
      if (inf) setLiked(prev => ({ ...prev, [inf._id]: !prev[inf._id] }));
    }
    lastTap.current = now;
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
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><line x1="2" y1="8" x2="22" y2="8"/><polygon points="10 12 10 18 16 15 10 12"/></svg>
          <h2>No reels yet</h2>
          <p>Check back later for influencer content!</p>
        </div>
      </div>
    );
  }

  const inf = influencers[current];
  const bg = gradients[current % gradients.length];
  const isLiked = liked[inf._id];

  return (
    <div
      className="reels-page"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="reel-card" onClick={handleDoubleTap}>
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
            <span className="reel-badge">Reels</span>
          </div>
          <div className="reel-overlay-bottom">
            <Link to={`/influencers/${inf._id}`} className="reel-creator-row">
              <div className="reel-creator-avatar">
                {inf.imageUrl ? <img src={inf.imageUrl} alt="" /> : <span>{inf.name?.[0]}</span>}
              </div>
              <span className="reel-creator-name">{inf.name}</span>
            </Link>
            {inf.reelCaption && <p className="reel-caption">{inf.reelCaption}</p>}
            {!inf.reelCaption && inf.bio && <p className="reel-caption">{inf.bio.slice(0, 100)}...</p>}
            {inf.tags?.length > 0 && (
              <div className="reel-hashtags">
                {inf.tags.slice(0, 4).map(t => <span key={t}>#{t}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* Side Actions (Instagram-style) */}
        <div className="reel-side-actions">
          <button
            className={`reel-side-btn ${isLiked ? 'liked' : ''}`}
            onClick={(e) => { e.stopPropagation(); setLiked(prev => ({ ...prev, [inf._id]: !prev[inf._id] })); }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill={isLiked ? '#ef4444' : 'none'} stroke={isLiked ? '#ef4444' : 'currentColor'} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>{isLiked ? 'Liked' : 'Like'}</span>
          </button>
          <Link to={`/influencers/${inf._id}`} className="reel-side-btn" onClick={(e) => e.stopPropagation()}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Profile</span>
          </Link>
          {user && (
            <Link to={`/messages?to=${inf.owner || inf._id}`} className="reel-side-btn" onClick={(e) => e.stopPropagation()}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>Message</span>
            </Link>
          )}
        </div>

        {/* Info Area */}
        <div className="reel-info">
          <div className="reel-stats">
            <div className="reel-stat">
              <span className="reel-stat-val">{formatCount(inf.followerCount)}</span>
              <span className="reel-stat-label">Followers</span>
            </div>
            <div className="reel-stat">
              <span className="reel-stat-val">{inf.engagementRate ?? 0}%</span>
              <span className="reel-stat-label">Engagement</span>
            </div>
            <div className="reel-stat">
              <span className="reel-stat-val">{inf.platforms?.length || 0}</span>
              <span className="reel-stat-label">Platforms</span>
            </div>
          </div>

          {inf.niche && <span className="reel-niche-chip">{inf.niche}</span>}

          {inf.platforms?.length > 0 && (
            <div className="reel-platforms">
              {inf.platforms.map((p) => (
                <span key={p} className="reel-platform-chip">{p.charAt(0).toUpperCase() + p.slice(1)}</span>
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
            <Link to={`/influencers/${inf._id}`} className="reel-btn reel-btn-primary">
              View Profile
            </Link>
            {user && (
              <Link to={`/messages?to=${inf.owner || inf._id}`} className="reel-btn reel-btn-secondary">
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
        <div className="reel-progress">
          {influencers.slice(
            Math.max(0, current - 2),
            Math.min(influencers.length, current + 3)
          ).map((_, i) => {
            const idx = Math.max(0, current - 2) + i;
            return (
              <button
                key={idx}
                className={`reel-dot ${idx === current ? 'active' : ''}`}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to reel ${idx + 1}`}
              />
            );
          })}
        </div>
        <button className="reel-nav-btn" onClick={goNext} disabled={current === influencers.length - 1} aria-label="Next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>
    </div>
  );
}
