import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchInfluencer } from '../api/client.js';
import './InfluencerDetailPage.css';

export default function InfluencerDetailPage() {
  const { id } = useParams();
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!influencer) return <p>Influencer not found.</p>;

  return (
    <section className="influencer-detail">
      <div className="hero">
        {influencer.imageUrl && (
          <img src={influencer.imageUrl} alt={influencer.name} className="hero-image" />
        )}
        <div>
          <h2>{influencer.name}</h2>
          <p className="muted">
            {influencer.niche} · {influencer.location || 'Location N/A'}
          </p>
          {influencer.platforms?.length ? (
            <p>Platforms: {influencer.platforms.join(', ')}</p>
          ) : null}
          {influencer.followerCount ? (
            <p>Followers: {influencer.followerCount.toLocaleString()}</p>
          ) : null}
          {influencer.engagementRate ? <p>Engagement rate: {influencer.engagementRate}%</p> : null}
          {influencer.socialLink && (
            <a
              href={influencer.socialLink}
              target="_blank"
              rel="noreferrer"
              className="primary-link"
            >
              Visit social profile
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

