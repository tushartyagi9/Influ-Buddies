import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchOpportunities, applyToOpportunity, fetchMyApplications, fetchInfluencers, updateInfluencer } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import './DashboardPages.css';

export default function InfluencerDashboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [loadingOpps, setLoadingOpps] = useState(false);
  const [loadingApps, setLoadingApps] = useState(false);
  const [applyingTo, setApplyingTo] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyError, setApplyError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    // Load applications for overview stats
    fetchMyApplications().then(setApplications).catch(() => {});
    // Try to find own influencer profile
    fetchInfluencers().then((data) => {
      const list = Array.isArray(data) ? data : data.items || data.influencers || [];
      const mine = list.find(inf => inf.owner === user?.id || inf.owner === user?._id);
      if (mine) setMyProfile(mine);
    }).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (tab === 'opportunities') {
      setLoadingOpps(true);
      fetchOpportunities()
        .then((data) => setOpportunities(data.items || []))
        .catch(() => {})
        .finally(() => setLoadingOpps(false));
    }
    if (tab === 'applications') {
      setLoadingApps(true);
      fetchMyApplications()
        .then(setApplications)
        .catch(() => {})
        .finally(() => setLoadingApps(false));
    }
  }, [tab]);

  const acceptedApps = applications.filter(a => a.status === 'accepted').length;
  const pendingApps = applications.filter(a => a.status === 'pending').length;

  async function handleApply(oppId) {
    setApplyError('');
    try {
      await applyToOpportunity(oppId, { message: coverLetter });
      setApplyingTo(null);
      setCoverLetter('');
      fetchMyApplications().then(setApplications).catch(() => {});
      setTab('applications');
    } catch (err) {
      setApplyError(err.message || 'Failed to apply');
    }
  }

  function startEditing() {
    setEditForm({
      name: myProfile?.name || user?.name || '',
      bio: myProfile?.bio || '',
      niche: myProfile?.niche || '',
      location: myProfile?.location || '',
      socialLink: myProfile?.socialLink || '',
      platforms: myProfile?.platforms || [],
      followerCount: myProfile?.followerCount || '',
      engagementRate: myProfile?.engagementRate || '',
      tags: myProfile?.tags?.join(', ') || '',
    });
    setEditError('');
    setEditMode(true);
  }

  function toggleEditPlatform(p) {
    setEditForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter(x => x !== p)
        : [...prev.platforms, p],
    }));
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    if (!myProfile?._id) return;
    setEditSaving(true);
    setEditError('');
    try {
      const payload = {
        ...editForm,
        followerCount: Number(editForm.followerCount) || 0,
        engagementRate: Number(editForm.engagementRate) || 0,
        tags: editForm.tags ? editForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      const updated = await updateInfluencer(myProfile._id, payload);
      setMyProfile(updated);
      setEditMode(false);
    } catch (err) {
      setEditError(err.message || 'Failed to save profile');
    } finally {
      setEditSaving(false);
    }
  }

  return (
    <section className="dashboard-page">
      <div className="dash-header">
        <div className="dash-header-info">
          <div className="dash-header-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <h2>Welcome back, {user?.name?.split(' ')[0] || 'Creator'}</h2>
            <p className="dash-header-subtitle">Track your applications and discover opportunities</p>
          </div>
        </div>
      </div>

      <div className="dash-tabs">
        <button className={`dash-tab${tab === 'overview' ? ' active' : ''}`} onClick={() => setTab('overview')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
          Overview
        </button>
        <button className={`dash-tab${tab === 'opportunities' ? ' active' : ''}`} onClick={() => setTab('opportunities')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
          Opportunities
        </button>
        <button className={`dash-tab${tab === 'applications' ? ' active' : ''}`} onClick={() => setTab('applications')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Applications
        </button>
        <button className={`dash-tab${tab === 'profile' ? ' active' : ''}`} onClick={() => setTab('profile')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Profile
        </button>
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="dash-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{background: 'var(--accent-subtle)', color: 'var(--accent)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div className="stat-info">
                <span className="stat-number">{applications.length}</span>
                <span className="stat-label">Total Applications</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{background: 'var(--success-subtle)', color: 'var(--success)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div className="stat-info">
                <span className="stat-number">{acceptedApps}</span>
                <span className="stat-label">Accepted</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{background: 'var(--warning-subtle)', color: 'var(--warning)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div className="stat-info">
                <span className="stat-number">{pendingApps}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{background: 'var(--accent-secondary-subtle)', color: 'var(--accent-secondary)'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              </div>
              <div className="stat-info">
                <span className="stat-number">{myProfile ? `${myProfile.engagementRate}%` : '—'}</span>
                <span className="stat-label">Engagement Rate</span>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="dash-section">
            <div className="dash-section-header">
              <h3>Recent Applications</h3>
              <button className="dash-link-btn" onClick={() => setTab('applications')}>View All</button>
            </div>
            {applications.length === 0 ? (
              <div className="dash-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <h4>No applications yet</h4>
                <p>Browse opportunities and apply to get started</p>
                <button className="dash-action-btn apply" onClick={() => setTab('opportunities')}>Browse Opportunities</button>
              </div>
            ) : (
              <div className="dash-cards">
                {applications.slice(0, 3).map((app) => (
                  <div key={app._id} className="dash-card">
                    <div className="dash-card-header">
                      <h3>{app.opportunity?.title || 'Opportunity'}</h3>
                      <span className={`status-badge status-${app.status}`}>{app.status}</span>
                    </div>
                    {app.opportunity?.brandName && <p className="dash-card-brand">by {app.opportunity.brandName}</p>}
                    <div className="dash-card-meta">
                      {app.opportunity?.category && <span className="dash-chip">{app.opportunity.category}</span>}
                      {app.opportunity?.budget && <span className="dash-chip budget">₹ {app.opportunity.budget.toLocaleString()}</span>}
                    </div>
                    {app.status === 'accepted' && (
                      <div className="dash-card-actions">
                        <Link to={`/messages?to=${app.opportunity?.brand || ''}`} className="dash-action-btn message-btn">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          Message Brand
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dash-quick-actions">
            <h3>Quick Actions</h3>
            <div className="quick-actions-grid">
              <button className="quick-action-card" onClick={() => setTab('opportunities')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <span>Find Opportunities</span>
              </button>
              <Link to="/messages" className="quick-action-card">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span>Messages</span>
              </Link>
              <Link to="/reels" className="quick-action-card">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><line x1="2" y1="8" x2="22" y2="8"/><polygon points="10 12 10 18 16 15 10 12"/></svg>
                <span>View Reels</span>
              </Link>
              <button className="quick-action-card" onClick={() => setTab('profile')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>My Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Opportunities Tab */}
      {tab === 'opportunities' && (
        <div className="dash-cards">
          {loadingOpps ? (
            <p className="dash-empty">Loading opportunities...</p>
          ) : opportunities.length === 0 ? (
            <div className="dash-empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
              <h4>No open opportunities</h4>
              <p>Check back soon for new collaboration opportunities!</p>
            </div>
          ) : (
            opportunities.map((opp) => (
              <div key={opp._id} className="dash-card">
                <div className="dash-card-header">
                  <h3>{opp.title}</h3>
                  <span className="status-badge status-open">Open</span>
                </div>
                {opp.brandName && <p className="dash-card-brand">by {opp.brandName}</p>}
                <p className="dash-card-desc">{opp.description}</p>
                <div className="dash-card-meta">
                  {opp.category && <span className="dash-chip">{opp.category}</span>}
                  {opp.budget && <span className="dash-chip budget">₹ {opp.budget.toLocaleString()}</span>}
                  {opp.platforms?.map((p) => <span key={p} className="dash-chip platform">{p}</span>)}
                  {opp.deadline && <span className="dash-chip">{new Date(opp.deadline).toLocaleDateString()}</span>}
                  {opp.location && <span className="dash-chip">{opp.location}</span>}
                </div>
                {opp.requirements && <p className="dash-card-requirements"><strong>Requirements:</strong> {opp.requirements}</p>}

                {applyingTo === opp._id ? (
                  <div className="apply-form">
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Why are you a great fit for this campaign? Share your experience and what makes you stand out..."
                      rows={4}
                    />
                    {applyError && <p className="error-message">{applyError}</p>}
                    <div className="apply-form-actions">
                      <button className="dash-action-btn accept" onClick={() => handleApply(opp._id)}>Submit Application</button>
                      <button className="dash-action-btn" onClick={() => { setApplyingTo(null); setApplyError(''); }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="dash-card-actions">
                    <button className="dash-action-btn apply" onClick={() => setApplyingTo(opp._id)}>Apply Now</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Applications Tab */}
      {tab === 'applications' && (
        <div className="dash-cards">
          {loadingApps ? (
            <p className="dash-empty">Loading your applications...</p>
          ) : applications.length === 0 ? (
            <div className="dash-empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <h4>No applications yet</h4>
              <p>Browse opportunities and submit your first application</p>
              <button className="dash-action-btn apply" onClick={() => setTab('opportunities')}>Browse Opportunities</button>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app._id} className="dash-card">
                <div className="dash-card-header">
                  <h3>{app.opportunity?.title || 'Opportunity'}</h3>
                  <span className={`status-badge status-${app.status}`}>{app.status}</span>
                </div>
                {app.opportunity?.brandName && <p className="dash-card-brand">by {app.opportunity.brandName}</p>}
                <div className="dash-card-meta">
                  {app.opportunity?.category && <span className="dash-chip">{app.opportunity.category}</span>}
                  {app.opportunity?.budget && <span className="dash-chip budget">₹ {app.opportunity.budget.toLocaleString()}</span>}
                </div>
                {app.message && <p className="dash-card-desc">"{app.message}"</p>}
                <p className="dash-card-date">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                {app.status === 'accepted' && (
                  <div className="dash-card-actions">
                    <Link to={`/messages?to=${app.opportunity?.brand || ''}`} className="dash-action-btn message-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      Message Brand
                    </Link>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Profile Tab */}
      {tab === 'profile' && (
        editMode ? (
          <form className="profile-edit-form" onSubmit={handleSaveProfile}>
            <h3 className="profile-edit-title">Edit Profile</h3>
            {editError && <p className="error-message">{editError}</p>}
            <label className="profile-edit-label">
              Name
              <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} required />
            </label>
            <label className="profile-edit-label">
              Bio
              <textarea rows={3} value={editForm.bio} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell brands about yourself..." />
            </label>
            <label className="profile-edit-label">
              Niche
              <select value={editForm.niche} onChange={e => setEditForm(f => ({ ...f, niche: e.target.value }))} required>
                <option value="">Select niche</option>
                {['Fashion', 'Fitness', 'Tech', 'Food', 'Travel', 'Beauty', 'Gaming', 'Education', 'Lifestyle', 'Music', 'Photography', 'Art', 'Finance', 'Health'].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
            <label className="profile-edit-label">
              Location
              <input type="text" value={editForm.location} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Mumbai, India" />
            </label>
            <label className="profile-edit-label">
              Social Link
              <input type="url" value={editForm.socialLink} onChange={e => setEditForm(f => ({ ...f, socialLink: e.target.value }))} placeholder="https://instagram.com/yourhandle" />
            </label>
            <div className="profile-edit-label">
              Platforms
              <div className="platform-pills">
                {[
                  { value: 'instagram', label: 'Instagram' },
                  { value: 'youtube', label: 'YouTube' },
                  { value: 'tiktok', label: 'TikTok' },
                  { value: 'twitter', label: 'Twitter' },
                  { value: 'linkedin', label: 'LinkedIn' },
                  { value: 'facebook', label: 'Facebook' },
                ].map(({ value, label }) => (
                  <button key={value} type="button" className={`platform-pill${editForm.platforms.includes(value) ? ' selected' : ''}`} onClick={() => toggleEditPlatform(value)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="profile-edit-row">
              <label className="profile-edit-label">
                Followers
                <input type="number" value={editForm.followerCount} onChange={e => setEditForm(f => ({ ...f, followerCount: e.target.value }))} min="0" />
              </label>
              <label className="profile-edit-label">
                Engagement Rate (%)
                <input type="number" value={editForm.engagementRate} onChange={e => setEditForm(f => ({ ...f, engagementRate: e.target.value }))} min="0" max="100" step="0.1" />
              </label>
            </div>
            <label className="profile-edit-label">
              Tags (comma-separated)
              <input type="text" value={editForm.tags} onChange={e => setEditForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. lifestyle, fitness, vlog" />
            </label>
            <div className="profile-edit-actions">
              <button type="submit" className="dash-action-btn apply" disabled={editSaving}>
                {editSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="dash-action-btn" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="profile-card-enhanced">
            <div className="profile-cover">
              <div className="profile-avatar-lg">
                {myProfile?.imageUrl ? (
                  <img src={myProfile.imageUrl} alt={user?.name} />
                ) : (
                  <span>{user?.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
            </div>
            <div className="profile-body">
              <h3 className="profile-name">{myProfile?.name || user?.name}</h3>
              <p className="profile-email">{user?.email}</p>
              <span className="profile-role">{user?.role}</span>
              {(myProfile?.location || user?.location) && (
                <p className="profile-location">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {myProfile?.location || user?.location}
                </p>
              )}
              {(myProfile?.bio || user?.bio) && <p className="profile-bio">{myProfile?.bio || user?.bio}</p>}
              {myProfile?.niche && <span className="dash-chip" style={{margin: '0.5rem auto', display: 'inline-block'}}>{myProfile.niche}</span>}
              {myProfile && (
                <div className="profile-stats-row">
                  <div className="profile-stat">
                    <span className="profile-stat-val">{myProfile.followerCount?.toLocaleString() || '0'}</span>
                    <span className="profile-stat-label">Followers</span>
                  </div>
                  <div className="profile-stat">
                    <span className="profile-stat-val">{myProfile.engagementRate || 0}%</span>
                    <span className="profile-stat-label">Engagement</span>
                  </div>
                  <div className="profile-stat">
                    <span className="profile-stat-val">{applications.length}</span>
                    <span className="profile-stat-label">Applications</span>
                  </div>
                  <div className="profile-stat">
                    <span className="profile-stat-val">{acceptedApps}</span>
                    <span className="profile-stat-label">Accepted</span>
                  </div>
                </div>
              )}
              {myProfile?.platforms?.length > 0 && (
                <div className="profile-platforms">
                  {myProfile.platforms.map(p => (
                    <span key={p} className="dash-chip platform">{p}</span>
                  ))}
                </div>
              )}
              {myProfile?.socialLink && (
                <a href={myProfile.socialLink} target="_blank" rel="noopener noreferrer" className="dash-action-btn view-profile" style={{marginTop: '1rem', display: 'inline-flex'}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Social Profile
                </a>
              )}
              {myProfile && (
                <div style={{marginTop: '1.25rem'}}>
                  <button className="dash-action-btn apply" onClick={startEditing}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </section>
  );
}
