import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createOpportunity, fetchMyOpportunities, deleteOpportunity, fetchApplicationsForOpportunity, updateApplicationStatus } from '../api/client.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import InfluencerCard from '../components/InfluencerCard.jsx';
import './DashboardPages.css';

const CATEGORIES = ['beauty','fashion','fitness','wellness','food','travel','tech','gaming','entertainment','music','education','lifestyle','sustainability'];
const PLATFORMS = ['instagram','youtube','tiktok','twitter','linkedin'];

export default function BrandDashboardPage() {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const [tab, setTab] = useState('overview');
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
    if (tab === 'ads' || tab === 'overview') {
      fetchMyOpportunities().then(setMyAds).catch(() => {});
    }
  }, [tab]);

  const totalApplicants = myAds.reduce((sum, ad) => sum + (ad.applicantCount || 0), 0);
  const activeAds = myAds.filter(ad => ad.status === 'open').length;

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
      <div className="dash-header">
        <div className="dash-header-info">
          <div className="dash-header-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <h2>Welcome back, {user?.name?.split(' ')[0] || 'Brand'}</h2>
            <p className="dash-header-subtitle">Manage your campaigns and discover influencers</p>
          </div>
        </div>
      </div>

      <div className="dash-tabs">
        <button className={`dash-tab${tab === 'overview' ? ' active' : ''}`} onClick={() => setTab('overview')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
          Overview
        </button>
        <button className={`dash-tab${tab === 'create' ? ' active' : ''}`} onClick={() => setTab('create')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          Create Ad
        </button>
        <button className={`dash-tab${tab === 'ads' ? ' active' : ''}`} onClick={() => setTab('ads')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
          My Ads
        </button>
        <button className={`dash-tab${tab === 'saved' ? ' active' : ''}`} onClick={() => setTab('saved')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          Saved
        </button>
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="dash-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{background: 'var(--accent-subtle)', color: 'var(--accent)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
              </div>
              <div className="stat-info">
                <span className="stat-number">{myAds.length}</span>
                <span className="stat-label">Total Campaigns</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{background: 'var(--success-subtle)', color: 'var(--success)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div className="stat-info">
                <span className="stat-number">{activeAds}</span>
                <span className="stat-label">Active Campaigns</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{background: 'var(--warning-subtle)', color: 'var(--warning)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div className="stat-info">
                <span className="stat-number">{totalApplicants}</span>
                <span className="stat-label">Total Applicants</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{background: 'var(--accent-secondary-subtle)', color: 'var(--accent-secondary)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div className="stat-info">
                <span className="stat-number">{favorites.length}</span>
                <span className="stat-label">Saved Influencers</span>
              </div>
            </div>
          </div>

          <div className="dash-section">
            <div className="dash-section-header">
              <h3>Recent Campaigns</h3>
              <button className="dash-link-btn" onClick={() => setTab('ads')}>View All</button>
            </div>
            {myAds.length === 0 ? (
              <div className="dash-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                <h4>No campaigns yet</h4>
                <p>Create your first ad to start connecting with influencers</p>
                <button className="dash-action-btn apply" onClick={() => setTab('create')}>Create Your First Ad</button>
              </div>
            ) : (
              <div className="dash-cards">
                {myAds.slice(0, 3).map((ad) => (
                  <div key={ad._id} className="dash-card">
                    <div className="dash-card-header">
                      <h3>{ad.title}</h3>
                      <span className={`status-badge status-${ad.status || 'open'}`}>{ad.status || 'open'}</span>
                    </div>
                    <p className="dash-card-desc">{ad.description?.slice(0, 100)}{ad.description?.length > 100 ? '...' : ''}</p>
                    <div className="dash-card-meta">
                      {ad.category && <span className="dash-chip">{ad.category}</span>}
                      {ad.budget && <span className="dash-chip budget">₹ {ad.budget.toLocaleString()}</span>}
                      <span className="dash-chip">{ad.applicantCount || 0} applicants</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dash-quick-actions">
            <h3>Quick Actions</h3>
            <div className="quick-actions-grid">
              <button className="quick-action-card" onClick={() => setTab('create')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                <span>Create New Ad</span>
              </button>
              <Link to="/browse" className="quick-action-card">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <span>Find Influencers</span>
              </Link>
              <Link to="/ai-matcher" className="quick-action-card">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-2 4-4 4s-4-2.05-4-4a4 4 0 0 1 4-4z"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
                <span>AI Matcher</span>
              </Link>
              <Link to="/messages" className="quick-action-card">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span>Messages</span>
              </Link>
            </div>
          </div>
        </div>
      )}

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
              <label>Budget (₹)</label>
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
            <div className="dash-empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
              <h4>No ads yet</h4>
              <p>Go to Create Ad to get started!</p>
              <button className="dash-action-btn apply" onClick={() => setTab('create')}>Create Ad</button>
            </div>
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
                  {ad.budget && <span className="dash-chip budget">₹ {ad.budget.toLocaleString()}</span>}
                  {ad.deadline && <span className="dash-chip">{new Date(ad.deadline).toLocaleDateString()}</span>}
                  <span className="dash-chip">{ad.applicantCount || 0} applicants</span>
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
                            <div className="dash-app-header-row">
                              <div className="dash-app-avatar">
                                {app.influencerProfile?.imageUrl ? (
                                  <img src={app.influencerProfile.imageUrl} alt="" />
                                ) : (
                                  <span>{(app.influencer?.name || 'A')[0].toUpperCase()}</span>
                                )}
                              </div>
                              <div className="dash-app-name-block">
                                <strong>{app.influencer?.name || 'Applicant'}</strong>
                                {app.influencerProfile?.niche && (
                                  <span className="dash-app-niche">{app.influencerProfile.niche}</span>
                                )}
                                {app.influencerProfile?.followerCount && (
                                  <span className="dash-app-followers">{app.influencerProfile.followerCount.toLocaleString()} followers</span>
                                )}
                              </div>
                              <span className={`status-badge status-${app.status}`}>{app.status}</span>
                            </div>
                            {app.message && <p className="dash-app-letter">"{app.message}"</p>}
                          </div>
                          <div className="dash-app-actions">
                            {app.influencerProfile?._id && (
                              <Link to={`/influencers/${app.influencerProfile._id}`} className="dash-action-btn view-profile">
                                View Profile
                              </Link>
                            )}
                            {app.status === 'pending' && (
                              <>
                                <button className="dash-action-btn accept" onClick={() => handleAppStatus(ad._id, app._id, 'accepted')}>Accept</button>
                                <button className="dash-action-btn danger" onClick={() => handleAppStatus(ad._id, app._id, 'rejected')}>Reject</button>
                              </>
                            )}
                            {app.status === 'accepted' && (
                              <Link to={`/messages?to=${app.influencer?._id}`} className="dash-action-btn message-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                Message
                              </Link>
                            )}
                          </div>
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
          <div className="dash-empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            <h4>No saved influencers</h4>
            <p>Browse and save influencers to see them here</p>
            <Link to="/browse" className="dash-action-btn apply">Browse Influencers</Link>
          </div>
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

