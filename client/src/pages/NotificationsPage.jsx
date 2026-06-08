import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchMyApplications, fetchMyOpportunities, fetchApplicationsForOpportunity } from '../api/client.js';
import './NotificationsPage.css';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [opps, setOpps] = useState([]);
  const [oppApps, setOppApps] = useState({});

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (user?.role === 'influencer') {
          const apps = await fetchMyApplications();
          setApplications(apps || []);
        } else if (user?.role === 'brand') {
          const myOpps = await fetchMyOpportunities();
          setOpps(myOpps || []);
          // fetch applications for each opportunity in parallel
          const fetches = (myOpps || []).map((o) => fetchApplicationsForOpportunity(o._id).then((data) => ({ id: o._id, apps: data || [] })).catch(() => ({ id: o._id, apps: [] })));
          const results = await Promise.all(fetches);
          const map = Object.fromEntries(results.map(r => [r.id, r.apps]));
          setOppApps(map);
        }
      } catch (err) {
        // ignore errors
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) return <div className="notifications-page"><p>Loading notifications...</p></div>;

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>
      {user?.role === 'influencer' ? (
        <div>
          {applications.length === 0 ? (
            <div className="notif-empty">You have no application updates yet.</div>
          ) : (
            <div className="notif-list">
              {applications.map((a) => (
                <div key={a._id} className={`notif-item notif-${a.status}`}>
                  <div className="notif-left">
                    <strong>{a.opportunity?.title || 'Opportunity'}</strong>
                    <div className="notif-meta">{a.opportunity?.brandName || ''} • Applied {new Date(a.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="notif-right">
                    <span className={`notif-status`}>{a.status}</span>
                    {a.status !== 'pending' && (
                      <Link to={`/messages?to=${a.opportunity?.brand || ''}`} className="notif-action">Message</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {opps.length === 0 ? (
            <div className="notif-empty">No campaigns yet — create an ad to start receiving applicants.</div>
          ) : (
            <div className="notif-list">
              {opps.map((o) => (
                <div key={o._id} className="notif-item">
                  <div className="notif-left">
                    <strong>{o.title}</strong>
                    <div className="notif-meta">{o.applicantCount || 0} applicants • {o.category || ''}</div>
                  </div>
                  <div className="notif-right">
                    <Link to={`/dashboard/brand`} className="notif-action">Manage</Link>
                  </div>
                  {oppApps[o._id] && oppApps[o._id].length > 0 && (
                    <div className="notif-children">
                      {oppApps[o._id].slice(0,3).map((app) => (
                        <div key={app._id} className={`notif-sub-item notif-${app.status}`}>
                          <div>{app.influencer?.name || 'Applicant'}</div>
                          <div className="notif-sub-meta">{app.status} • Applied {new Date(app.createdAt).toLocaleDateString()}</div>
                          <div className="notif-sub-actions">
                            <Link to={`/influencers/${app.influencerProfile?._id || ''}`} className="notif-action">View</Link>
                            <Link to={`/messages?to=${app.influencer?._id || ''}`} className="notif-action">Message</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
