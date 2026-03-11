import { useState, useEffect } from 'react';
import { createOpportunity, fetchMyOpportunities, deleteOpportunity, fetchApplicationsForOpportunity, updateApplicationStatus } from '../api/client.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import InfluencerCard from '../components/InfluencerCard.jsx';
import './DashboardPages.css';

const CATEGORIES = ['beauty','fashion','fitness','wellness','food','travel','tech','gaming','entertainment','music','education','lifestyle','sustainability'];
const PLATFORMS = ['instagram','youtube','tiktok','twitter','linkedin'];

export default function BrandDashboardPage() {
  const { favorites } = useFavorites();
  const [tab, setTab] = useState('create');
  const [myAds, setMyAds] = useState([]);
  const [adForm, setAdForm] = useState({
    title: '', description: '', category: '', platforms: [], budget: '', location: '', deadline: '', requirements: '',
  });
  const [creating, setCreating] = useState(false);
  const [adError, setAdError] = useState('');
  const [adSuccess, setAdSuccess] = useState('');
  const [expandedAd, setExpandedAd] = useState(null);
  const [apps, setApps] = useState({});

  useEffect(() => {
    if (tab === 'ads') {
      fetchMyOpportunities().then(setMyAds).catch(() => {});
    }
  }, [tab]);

  function handleAdChange(e) {
    setAdForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function toggleAdPlatform(p) {
    setAdForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p) ? prev.platforms.filter((x) => x !== p) : [...prev.platforms, p],
    }));
  }

  async function handleCreateAd(e) {
    e.preventDefault();
    setCreating(true);
    setAdError('');
    setAdSuccess('');
    try {
      await createOpportunity({
        ...adForm,
        budget: adForm.budget ? Number(adForm.budget) : undefined,
      });
      setAdSuccess('Ad created successfully!');
      setAdForm({ title: '', description: '', category: '', platforms: [], budget: '', location: '', deadline: '', requirements: '' });
      setTimeout(() => setAdSuccess(''), 3000);
    } catch (err) {
      setAdError(err.message || 'Failed to create');
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteAd(id) {
    if (!confirm('Delete this ad?')) return;
    try {
      await deleteOpportunity(id);
      setMyAds((p) => p.filter((a) => a._id !== id));
    } catch { /* ignore */ }
  }

  async function toggleApps(adId) {
    if (expandedAd === adId) { setExpandedAd(null); return; }
    setExpandedAd(adId);
    if (!apps[adId]) {
      try {
        const data = await fetchApplicationsForOpportunity(adId);
        setApps((p) => ({ ...p, [adId]: data }));
      } catch { setApps((p) => ({ ...p, [adId]: [] })); }
    }
  }

  async function handleAppStatus(adId, appId, status) {
    try {
      await updateApplicationStatus(adId, appId, status);
      setApps((p) => ({
        ...p,
        [adId]: p[adId].map((a) => (a._id === appId ? { ...a, status } : a)),
      }));
    } catch { /* ignore */ }
  }

  return (
    <section className="dashboard-page">
      <h2>Brand Dashboard</h2>

      <div className="dash-tabs">
        <button className={`dash-tab${tab === 'create' ? ' active' : ''}`} onClick={() => setTab('create')}>Create Ad</button>
        <button className={`dash-tab${tab === 'ads' ? ' active' : ''}`} onClick={() => setTab('ads')}>My Ads</button>
        <button className={`dash-tab${tab === 'saved' ? ' active' : ''}`} onClick={() => setTab('saved')}>Saved</button>
      </div>

      {tab === 'create' && (
        <form className="dash-form" onSubmit={handleCreateAd}>
          <div className="form-group">
            <label>Ad Title *</label>
            <input name="title" value={adForm.title} onChange={handleAdChange} placeholder="e.g., Summer Beauty Campaign" required />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" value={adForm.description} onChange={handleAdChange} placeholder="Describe the collaboration..." rows={4} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={adForm.category} onChange={handleAdChange}>
                <option value="">Any</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Budget ($)</label>
              <input name="budget" type="number" value={adForm.budget} onChange={handleAdChange} placeholder="5000" />
            </div>
          </div>
          <div className="form-group">
            <label>Platforms</label>
            <div className="platform-pills">
              {PLATFORMS.map((p) => (
                <button key={p} type="button" className={`platform-pill${adForm.platforms.includes(p) ? ' selected' : ''}`} onClick={() => toggleAdPlatform(p)}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input name="location" value={adForm.location} onChange={handleAdChange} placeholder="City, Country" />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input name="deadline" type="date" value={adForm.deadline} onChange={handleAdChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Requirements</label>
            <textarea name="requirements" value={adForm.requirements} onChange={handleAdChange} placeholder="Minimum followers, content type, etc." rows={3} />
          </div>
          {adError && <p className="error-message">{adError}</p>}
          {adSuccess && <p className="success-message">{adSuccess}</p>}
          <button type="submit" className="dash-submit-btn" disabled={creating}>
            {creating ? 'Creating...' : 'Publish Ad'}
          </button>
        </form>
      )}

      {tab === 'ads' && (
        <div className="dash-cards">
          {myAds.length === 0 ? (
            <p className="dash-empty">No ads yet. Go to Create Ad to get started!</p>
          ) : (
            myAds.map((ad) => (
              <div key={ad._id} className="dash-card">
                <div className="dash-card-header">
                  <h3>{ad.title}</h3>
                  <span className={`status-badge status-${ad.status || 'open'}`}>{ad.status || 'open'}</span>
                </div>
                <p className="dash-card-desc">{ad.description}</p>
                <div className="dash-card-meta">
                  {ad.category && <span className="dash-chip">{ad.category}</span>}
                  {ad.budget && <span className="dash-chip budget">$ {ad.budget}</span>}
                  {ad.deadline && <span className="dash-chip">{new Date(ad.deadline).toLocaleDateString()}</span>}
                </div>
                <div className="dash-card-actions">
                  <button className="dash-action-btn" onClick={() => toggleApps(ad._id)}>
                    {expandedAd === ad._id ? 'Hide' : 'View'} Applications
                  </button>
                  <button className="dash-action-btn danger" onClick={() => handleDeleteAd(ad._id)}>Delete</button>
                </div>
                {expandedAd === ad._id && (
                  <div className="dash-applications">
                    {!apps[ad._id] ? (
                      <p>Loading...</p>
                    ) : apps[ad._id].length === 0 ? (
                      <p className="dash-empty">No applications yet</p>
                    ) : (
                      apps[ad._id].map((app) => (
                        <div key={app._id} className="dash-app-item">
                          <div className="dash-app-info">
                            <strong>{app.influencer?.name || app.influencerName || 'Applicant'}</strong>
                            <span className={`status-badge status-${app.status}`}>{app.status}</span>
                          </div>
                          {app.coverLetter && <p className="dash-app-letter">{app.coverLetter}</p>}
                          {app.status === 'pending' && (
                            <div className="dash-app-actions">
                              <button className="dash-action-btn accept" onClick={() => handleAppStatus(ad._id, app._id, 'accepted')}>Accept</button>
                              <button className="dash-action-btn danger" onClick={() => handleAppStatus(ad._id, app._id, 'rejected')}>Reject</button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'saved' && (
        favorites.length === 0 ? (
          <p className="dash-empty">No saved influencers yet. Browse and save some to see them here.</p>
        ) : (
          <div className="favorites-grid">
            {favorites.map((inf) => (
              <InfluencerCard key={inf._id} influencer={inf} />
            ))}
          </div>
        )
      )}
    </section>
  );
}

