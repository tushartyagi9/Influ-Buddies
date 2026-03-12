import { Link } from 'react-router-dom';
import './InfluencerCard.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

export default function InfluencerCard({ influencer }) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const canFavorite = user?.role === 'brand';
  const favorite = isFavorite(influencer._id);

  return (
    <article className="influencer-card">
      <div className="influencer-image-wrapper">
        {influencer.imageUrl ? (
          <img src={influencer.imageUrl} alt={influencer.name} />
        ) : (
          <div className="placeholder-avatar">{influencer.name.charAt(0)}</div>
        )}
      </div>
      <div className="influencer-body">
        <h3>{influencer.name}</h3>
        <p className="muted">
          {influencer.niche} · {influencer.location || 'Location N/A'}
        </p>
        {influencer.platforms?.length ? (
          <p className="platforms">Platforms: {influencer.platforms.join(', ')}</p>
        ) : null}
        {influencer.followerCount ? (
          <p className="stats">
            {influencer.followerCount.toLocaleString()} followers
            {influencer.engagementRate ? ` · ${influencer.engagementRate}% engagement` : ''}
          </p>
        ) : null}
        <div className="card-actions">
          <Link to={`/influencers/${influencer._id}`} className="primary-link">
            View profile
          </Link>
          {influencer.socialLink && (
            <a
              href={influencer.socialLink}
              target="_blank"
              rel="noreferrer"
              className="secondary-link"
            >
              Visit social
            </a>
          )}
          {canFavorite && (
            <button
              type="button"
              className={`favorite-btn ${favorite ? 'favorite-btn--active' : ''}`}
              onClick={() => toggleFavorite(influencer)}
            >
              {favorite ? '★ Saved' : '☆ Save'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

