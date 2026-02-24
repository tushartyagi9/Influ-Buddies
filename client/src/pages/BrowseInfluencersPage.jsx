import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchInfluencers } from '../api/client.js';
import FilterBar from '../components/FilterBar.jsx';
import InfluencerCard from '../components/InfluencerCard.jsx';
import './BrowseInfluencersPage.css';

export default function BrowseInfluencersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    niche: searchParams.get('niche') || '',
    location: searchParams.get('location') || '',
    platform: searchParams.get('platform') || '',
    gender: searchParams.get('gender') || ''
  });
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const nextParams = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) nextParams[key] = value;
    });
    setSearchParams(nextParams);
  }, [filters, setSearchParams]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await fetchInfluencers(Object.fromEntries(searchParams.entries()));
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to load influencers');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [searchParams]);

  return (
    <section className="browse-page">
      <h2>Browse influencers</h2>
      <div className="category-chips">
        {['all', 'beauty', 'dance', 'fashion'].map((cat) => (
          <button
            key={cat}
            type="button"
            className={`chip ${filters.niche === '' && cat === 'all' ? 'chip--active' : ''} ${
              filters.niche === cat && cat !== 'all' ? 'chip--active' : ''
            }`}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                niche: cat === 'all' ? '' : cat
              }))
            }
          >
            {cat === 'all' ? 'All' : cat[0].toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      <FilterBar filters={filters} onChange={setFilters} />
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {data.items.map((influencer) => (
          <InfluencerCard key={influencer._id} influencer={influencer} />
        ))}
      </div>
      {!loading && !data.items.length && <p>No influencers found. Try adjusting your filters.</p>}
    </section>
  );
}

