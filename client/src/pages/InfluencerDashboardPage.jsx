import { useState, useEffect } from 'react';
import { fetchOpportunities, applyToOpportunity, fetchMyApplications } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import './DashboardPages.css';

export default function InfluencerDashboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('opportunities');
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingOpps, setLoadingOpps] = useState(false);
  const [loadingApps, setLoadingApps] = useState(false);
  const [applyingTo, setApplyingTo] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyError, setApplyError] = useState('');

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

  async function handleApply(oppId) {
    setApplyError('');
    try {
      await applyToOpportunity(oppId, { coverLetter });
      setApplyingTo(null);
      setCoverLetter('');
      // Refresh
      fetchMyApplications().then(setApplications).catch(() => {});
      setTab('applications');
    } catch (err) {
      setApplyError(err.message || 'Failed to apply');
    }
  }

  return (
    <section className="dashboard-page">
      <h2>Influencer Dashboard</h2>

      <div className="dash-tabs">
        <button className={`dash-tab${tab === 'opportunities' ? ' active' : ''}`} onClick={() => setTab('opportunities')}>
          Browse Opportunities
        </button>
        <button className={`dash-tab${tab === 'applications' ? ' active' : ''}`} onClick={() => setTab('applications')}>
          My Applications
        </button>
        <button className={`dash-tab${tab === 'profile' ? ' active' : ''}`} onClick={() => setTab('profile')}>
          My Profile
        </button>
      </div>

      {/* Opportunities Tab */}
      {tab === 'opportunities' && (
        <div className="dash-cards">
          {loadingOpps ? (
            <p className="dash-empty">Loading opportunities...</p>
          ) : opportunities.length === 0 ? (
            <p className="dash-empty">No open opportunities right now. Check back soon!</p>
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
                  {opp.budget && <span className="dash-chip budget">$ {opp.budget}</span>}
                  {opp.platforms?.map((p) => <span key={p} className="dash-chip platform">{p}</span>)}
                  {opp.deadline && <span className="dash-chip">{new Date(opp.deadline).toLocaleDateString()}</span>}
                </div>

                {applyingTo === opp._id ? (
                  <div className="apply-form">
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Why are you a great fit for this campaign?"
                      rows={3}
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
            <p className="dash-empty">You haven't applied to any opportunities yet.</p>
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
                  {app.opportunity?.budget && <span className="dash-chip budget">$ {app.opportunity.budget}</span>}
                </div>
                {app.coverLetter && <p className="dash-card-desc">{app.coverLetter}</p>}
                <p className="dash-card-date">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="profile-card">
          <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <h3 className="profile-name">{user?.name}</h3>
          <p className="profile-email">{user?.email}</p>
          <span className="profile-role">{user?.role}</span>
          {user?.location && <p className="profile-location">{user.location}</p>}
          {user?.bio && <p className="profile-bio">{user.bio}</p>}
        </div>
      )}
    </section>
  );
}
