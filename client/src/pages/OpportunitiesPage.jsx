import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchOpportunities } from '../api/client.js';
import './OpportunitiesPage.css';

const CATEGORIES = [
  '', 'beauty', 'fashion', 'fitness', 'wellness', 'food', 'tech',
  'gaming', 'travel', 'lifestyle', 'music', 'entertainment',
  'education', 'sustainability',
];

export default function OpportunitiesPage() {
  const { user } = useAuth();
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const params = { limit: 50 };
        if (category) params.category = category;
        if (search) params.search = search;
        const data = await fetchOpportunities(params);
        setOpps(data.items || []);
      } catch { /* */ }
      finally { setLoading(false); }
    })();
  }, [category, search]);

  return (
    <div className="opps-page">
      <div className="opps-header">
        <h2>Brand Opportunities</h2>
        <p>Browse paid collaboration opportunities from top brands</p>
      </div>

      <div className="opps-filters">
        <input
          type="text"
          placeholder="Search opportunities..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="opps-search"
        />
        <select value={category} onChange={e => setCategory(e.target.value)} className="opps-select">
          <option value="">All Categories</option>
          {CATEGORIES.filter(Boolean).map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="muted" style={{ textAlign: 'center', padding: '2rem' }}>Loading opportunities...</p>
      ) : opps.length === 0 ? (
        <div className="opps-empty">
          <p>No opportunities found.</p>
          <p className="muted">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="opps-grid">
          {opps.map(o => (
            <div key={o._id} className="opp-public-card">
              <div className="opp-public-top">
                <span className="opp-chip">{o.category}</span>
                {o.budget > 0 && <span className="opp-chip budget">₹{o.budget.toLocaleString()}</span>}
              </div>
              <h3>{o.title}</h3>
              <p className="opp-brand-name">by {o.brandName}</p>
              <p className="opp-desc">{o.description?.slice(0, 120)}{o.description?.length > 120 ? '...' : ''}</p>
              <div className="opp-public-meta">
                {o.platforms?.map(p => <span key={p} className="opp-chip platform">{p}</span>)}
                {o.location && <span className="opp-chip">{o.location}</span>}
              </div>
              <div className="opp-public-footer">
                {o.deadline && <span className="opp-deadline">Deadline: {new Date(o.deadline).toLocaleDateString()}</span>}
                <span className="opp-applicants">{o.applicantCount || 0} applicant{(o.applicantCount || 0) !== 1 ? 's' : ''}</span>
              </div>
              {user?.role === 'influencer' ? (
                <Link to="/dashboard/influencer" className="primary-link opp-apply-link">Apply Now</Link>
              ) : !user ? (
                <Link to="/login" className="primary-link opp-apply-link">Login to Apply</Link>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
