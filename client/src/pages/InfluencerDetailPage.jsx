import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchInfluencer } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import './InfluencerDetailPage.css';

function formatFollowers(n) {
  if (!n) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

export default function InfluencerDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchInfluencer(id);
        setInfluencer(data);
      } catch (err) {
        setError(err.message || 'Failed to load influencer');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="detail-loading"><div className="detail-spinner" /><p>Loading profile...</p></div>;
  if (error) return <div className="detail-error"><p>{error}</p><Link to="/browse">Back to Browse</Link></div>;
  if (!influencer) return <div className="detail-error"><p>Influencer not found.</p><Link to="/browse">Back to Browse</Link></div>;

  const canFavorite = user?.role === 'brand';
  const favorite = isFavorite(influencer._id);

  return (
    <section className="influencer-detail">
      {/* Cover / Hero */}
      <div className="detail-hero">
        <div className="detail-hero-bg" />
        <div className="detail-hero-content">
          <div className="detail-avatar-wrapper">
            {influencer.imageUrl ? (
              <img src={influencer.imageUrl} alt={influencer.name} className="detail-avatar-img" />
            ) : (
              <div className="detail-avatar-placeholder">{influencer.name.charAt(0)}</div>
            )}
          </div>
          <div className="detail-hero-info">
            <div className="detail-name-row">
              <h1>{influencer.name}</h1>
              <span className="detail-niche-badge">{influencer.niche}</span>
            </div>
            {influencer.location && (
              <p className="detail-location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {influencer.location}
              </p>
            )}
            <div className="detail-actions">
              {influencer.socialLink && (
                <a href={influencer.socialLink} target="_blank" rel="noreferrer" className="detail-btn detail-btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Visit Profile
                </a>
              )}
              {user && (
                <Link to={`/messages?to=${influencer.owner || influencer._id}`} className="detail-btn detail-btn-secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Message
                </Link>
              )}
              {canFavorite && (
                <button className={`detail-btn detail-btn-fav ${favorite ? 'active' : ''}`} onClick={() => toggleFavorite(influencer)}>
                  {favorite ? '★ Saved' : '☆ Save'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="detail-stats">
        <div className="detail-stat">
          <span className="detail-stat-val">{formatFollowers(influencer.followerCount)}</span>
          <span className="detail-stat-label">Followers</span>
        </div>
        <div className="detail-stat">
          <span className="detail-stat-val">{influencer.engagementRate || 0}%</span>
          <span className="detail-stat-label">Engagement</span>
        </div>
        <div className="detail-stat">
          <span className="detail-stat-val">{influencer.platforms?.length || 0}</span>
          <span className="detail-stat-label">Platforms</span>
        </div>
        {influencer.gender && (
          <div className="detail-stat">
            <span className="detail-stat-val" style={{textTransform: 'capitalize'}}>{influencer.gender}</span>
            <span className="detail-stat-label">Gender</span>
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="detail-grid">
        {/* About */}
        <div className="detail-card detail-about">
          <h3>About</h3>
          <p>{influencer.bio || `${influencer.name} is a ${influencer.niche} creator based in ${influencer.location || 'India'}, creating engaging content for their ${formatFollowers(influencer.followerCount)} followers.`}</p>
        </div>

        {/* Platforms */}
        <div className="detail-card detail-platforms-card">
          <h3>Platforms</h3>
          <div className="detail-platform-list">
            {influencer.platforms?.length > 0 ? (
              influencer.platforms.map((p) => (
                <div key={p} className="detail-platform-item">
                  <span className="detail-platform-icon">{
                    p === 'instagram' ? '📸' :
                    p === 'youtube' ? '🎬' :
                    p === 'tiktok' ? '🎵' :
                    p === 'twitter' ? '🐦' :
                    p === 'linkedin' ? '💼' : '🌐'
                  }</span>
                  <span className="detail-platform-name">{p.charAt(0).toUpperCase() + p.slice(1)}</span>
                </div>
              ))
            ) : (
              <p className="detail-muted">No platforms listed</p>
            )}
          </div>
        </div>

        {/* Tags */}
        {influencer.tags?.length > 0 && (
          <div className="detail-card detail-tags-card">
            <h3>Content Topics</h3>
            <div className="detail-tags">
              {influencer.tags.map((tag) => (
                <span key={tag} className="detail-tag">#{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Collaboration Info */}
        <div className="detail-card detail-collab">
          <h3>Collaboration</h3>
          <div className="detail-collab-items">
            <div className="detail-collab-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>Open to collaborations</span>
            </div>
            <div className="detail-collab-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>Responds within 24 hours</span>
            </div>
            <div className="detail-collab-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              <span>{influencer.niche} niche specialist</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

