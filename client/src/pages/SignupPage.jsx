import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthPages.css';

const NICHES = [
  'beauty', 'fashion', 'fitness', 'wellness', 'food', 'travel',
  'tech', 'gaming', 'entertainment', 'music', 'education', 'lifestyle', 'sustainability',
];

const PLATFORM_LIST = ['instagram', 'youtube', 'tiktok', 'twitter', 'linkedin'];

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'brand',
    location: '',
    bio: '',
    niche: '',
    platforms: [],
    gender: '',
    followerCount: '',
    engagementRate: '',
    socialLink: '',
    imageUrl: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function togglePlatform(p) {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter((x) => x !== p)
        : [...prev.platforms, p],
    }));
  }

  function goStep2() {
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setStep(2);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const submitData = { ...form };
      if (form.role === 'influencer') {
        if (!form.niche) { setError('Please select a niche'); setLoading(false); return; }
        submitData.followerCount = form.followerCount ? parseInt(form.followerCount) : 0;
        submitData.engagementRate = form.engagementRate ? parseFloat(form.engagementRate) : 0;
      }
      await register(submitData);
      navigate(form.role === 'brand' ? '/dashboard/brand' : '/dashboard/influencer');
    } catch (err) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-right-panel">
        <section className="auth-page">
          <div className="auth-header">
            <h2>Create account</h2>
            <div className="auth-underline"></div>
          </div>

          {/* Sliding Toggle */}
          <div className="role-toggle">
            <button
              type="button"
              className={`toggle-option${form.role === 'brand' ? ' active' : ''}`}
              onClick={() => { setForm((p) => ({ ...p, role: 'brand' })); setStep(1); }}
            >
              Brand
            </button>
            <button
              type="button"
              className={`toggle-option${form.role === 'influencer' ? ' active' : ''}`}
              onClick={() => { setForm((p) => ({ ...p, role: 'influencer' })); setStep(1); }}
            >
              Influencer
            </button>
            <div className={`toggle-slider${form.role === 'influencer' ? ' toggle-right' : ''}`} />
          </div>

          <p className="auth-subtitle">
            {form.role === 'brand' ? 'Register your brand' : step === 1 ? 'Step 1 — Basic info' : 'Step 2 — Your profile'}
          </p>

          <form onSubmit={form.role === 'influencer' && step === 1 ? (e) => { e.preventDefault(); goStep2(); } : handleSubmit} className="auth-form">
            {step === 1 && (
              <>
                <label>
                  Full Name *
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
                </label>
                <label>
                  Email Address *
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                </label>
                <label>
                  Password *
                  <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Strong password" required />
                </label>
                <label>
                  Location
                  <input name="location" value={form.location} onChange={handleChange} placeholder="City, Country" />
                </label>
                {form.role === 'brand' && (
                  <label>
                    Company Bio
                    <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Tell us about your brand" rows={3} />
                  </label>
                )}
              </>
            )}

            {step === 2 && form.role === 'influencer' && (
              <>
                <label>
                  Your Niche *
                  <select name="niche" value={form.niche} onChange={handleChange} required>
                    <option value="">Select your niche</option>
                    {NICHES.map((n) => (
                      <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Platforms
                  <div className="platform-pills">
                    {PLATFORM_LIST.map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`platform-pill${form.platforms.includes(p) ? ' selected' : ''}`}
                        onClick={() => togglePlatform(p)}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </label>

                <label>
                  Gender
                  <select name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <div className="input-row">
                  <label>
                    Followers
                    <input name="followerCount" type="number" value={form.followerCount} onChange={handleChange} placeholder="100000" />
                  </label>
                  <label>
                    Engagement %
                    <input name="engagementRate" type="number" step="0.1" value={form.engagementRate} onChange={handleChange} placeholder="4.5" />
                  </label>
                </div>

                <label>
                  Social Media Link
                  <input name="socialLink" type="url" value={form.socialLink} onChange={handleChange} placeholder="https://instagram.com/you" />
                </label>
                <label>
                  Profile Image URL
                  <input name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} placeholder="https://example.com/photo.jpg" />
                </label>
                <label>
                  Bio
                  <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Tell brands about yourself..." rows={3} />
                </label>
              </>
            )}

            {error && <p className="error-message">{error}</p>}

            <div className="auth-btn-row">
              {step === 2 && (
                <button type="button" className="auth-back-btn" onClick={() => setStep(1)}>
                  Back
                </button>
              )}
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {form.role === 'influencer' && step === 1
                  ? 'Next →'
                  : loading
                  ? 'Creating...'
                  : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Log in here</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

