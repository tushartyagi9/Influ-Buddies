import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect, useState } from 'react';
import { fetchInfluencers, fetchOpportunities } from '../api/client.js';
import './HomePage.css';

export default function HomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ influencers: 0, opportunities: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [infRes, oppRes] = await Promise.all([
          fetchInfluencers({ limit: 1 }),
          fetchOpportunities({ limit: 1 }),
        ]);
        setStats({
          influencers: infRes?.total ?? infRes?.length ?? 0,
          opportunities: oppRes?.total ?? 0,
        });
      } catch {
        /* ignore */
      }
    })();
  }, []);

  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="hero-badge">🚀 India's #1 Influencer-Brand Marketplace</div>
        <h1>
          Connect <span className="text-accent">Brands</span> with the Right{' '}
          <span className="text-accent-secondary">Influencers</span>
        </h1>
        <p className="hero-subtitle">
          Influ-Buddies makes it effortless for brands to discover, evaluate, and collaborate with
          social media influencers — and for creators to land paid opportunities that match their
          niche.
        </p>
        <div className="hero-actions">
          <Link to="/browse" className="primary-link hero-cta">
            Browse Influencers
          </Link>
          {user?.role === 'brand' ? (
            <Link to="/dashboard/brand" className="secondary-link hero-cta">
              Post an Opportunity →
            </Link>
          ) : user?.role === 'influencer' ? (
            <Link to="/dashboard/influencer" className="secondary-link hero-cta">
              Find Opportunities →
            </Link>
          ) : (
            <Link to="/signup" className="secondary-link hero-cta">
              Join Free →
            </Link>
          )}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="home-stats">
        <div className="stat-card">
          <span className="stat-number">{stats.influencers}+</span>
          <span className="stat-label">Verified Influencers</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.opportunities}+</span>
          <span className="stat-label">Open Opportunities</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">15+</span>
          <span className="stat-label">Niches Covered</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">6+</span>
          <span className="stat-label">Platforms Supported</span>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="home-section">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Three simple steps to start collaborating</p>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon">📝</div>
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your free account as a brand or influencer. Complete your profile to get discovered.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">🔍</div>
            <div className="step-number">2</div>
            <h3>Discover &amp; Match</h3>
            <p>Brands browse influencers by niche, location, and platform. Influencers explore paid collaboration opportunities.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">🤝</div>
            <div className="step-number">3</div>
            <h3>Collaborate</h3>
            <p>Apply to opportunities, manage applications, and launch successful marketing campaigns together.</p>
          </div>
        </div>
      </section>

      {/* ── For Brands & Influencers ── */}
      <section className="home-section">
        <h2 className="section-title">Built for Both Sides</h2>
        <p className="section-subtitle">Whether you&apos;re a brand or a creator, we&apos;ve got you covered</p>
        <div className="dual-grid">
          <div className="dual-card">
            <div className="dual-icon">🏢</div>
            <h3>For Brands</h3>
            <ul>
              <li>Search influencers by niche, platform, followers &amp; location</li>
              <li>AI-powered campaign matcher for smart recommendations</li>
              <li>Post collaboration opportunities &amp; manage applications</li>
              <li>Track engagement rates and analytics</li>
            </ul>
            {!user && (
              <Link to="/signup" className="primary-link">
                Join as Brand
              </Link>
            )}
          </div>
          <div className="dual-card">
            <div className="dual-icon">🌟</div>
            <h3>For Influencers</h3>
            <ul>
              <li>Get discovered by brands in your niche</li>
              <li>Browse &amp; apply to paid opportunities</li>
              <li>Track your application status in real time</li>
              <li>Showcase your profile, stats &amp; portfolio</li>
            </ul>
            {!user && (
              <Link to="/signup" className="primary-link">
                Join as Influencer
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="home-section">
        <h2 className="section-title">Platform Features</h2>
        <p className="section-subtitle">Everything you need for influencer collaboration</p>
        <div className="features-grid">
          {[
            { icon: '🤖', title: 'AI Campaign Matcher', desc: 'Describe your campaign and get smart influencer recommendations instantly.' },
            { icon: '📊', title: 'Analytics Dashboard', desc: 'Track follower counts, engagement rates, and campaign performance.' },
            { icon: '🔒', title: 'Secure Auth', desc: 'JWT-based authentication with role-based access for brands & influencers.' },
            { icon: '📱', title: 'Multi-Platform', desc: 'Support for Instagram, YouTube, TikTok, Twitter, Twitch & LinkedIn.' },
            { icon: '💼', title: 'Opportunity Board', desc: 'Brands post campaigns, influencers apply — all in one marketplace.' },
            { icon: '🎯', title: 'Smart Filters', desc: 'Filter by niche, location, budget, platform, gender & follower count.' },
          ].map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="home-cta-section">
        <h2>Ready to Start Collaborating?</h2>
        <p>Join hundreds of brands and influencers already growing together on Influ-Buddies.</p>
        <div className="hero-actions" style={{ justifyContent: 'center' }}>
          <Link to="/browse" className="primary-link hero-cta">
            Explore Influencers
          </Link>
          {!user && (
            <Link to="/signup" className="primary-link hero-cta" style={{ background: 'var(--accent-secondary)' }}>
              Create Free Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

