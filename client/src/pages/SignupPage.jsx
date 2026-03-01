import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthPages.css';

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'brand',
    location: '',
    // Influencer specific fields
    niche: '',
    platforms: [],
    gender: '',
    followerCount: '',
    engagementRate: '',
    socialLink: '',
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setForm((prev) => {
        const platforms = checked
          ? [...prev.platforms, name]
          : prev.platforms.filter((p) => p !== name);
        return { ...prev, platforms };
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // For influencer, convert numeric fields
      const submitData = { ...form };
      if (form.role === 'influencer') {
        if (!form.niche) {
          setError('Please select a niche for your profile');
          setLoading(false);
          return;
        }
        submitData.followerCount = form.followerCount ? parseInt(form.followerCount) : 0;
        submitData.engagementRate = form.engagementRate ? parseFloat(form.engagementRate) : 0;
      }
      
      await register(submitData);
      if (form.role === 'brand') {
        navigate('/dashboard/brand');
      } else {
        navigate('/dashboard/influencer');
      }
    } catch (err) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      {/* Left Sidebar - Logo and Info */}
      <div className="auth-left-sidebar">
        <div className="logo-section">
          <h1 className="auth-logo">Influ<br/>Buddies</h1>
          <p className="auth-tagline">Connect with influencers<br/>that match your brand</p>
        </div>
      </div>

      {/* Left Panel - Illustration Space */}
      <div className="auth-left-panel">
        <svg viewBox="0 0 300 400" className="auth-illustration">
          {/* User Circle */}
          <circle cx="150" cy="100" r="50" fill="#4a90e2" opacity="0.1" />
          <circle cx="150" cy="100" r="40" fill="none" stroke="#FFD700" strokeWidth="2" />
          
          {/* User Icon */}
          <circle cx="150" cy="85" r="12" fill="#FFD700" />
          <path d="M 130 105 Q 150 120 170 105" fill="#FFD700" />
          
          {/* Decorative Elements */}
          <circle cx="80" cy="200" r="8" fill="#FFD700" opacity="0.5" />
          <circle cx="220" cy="250" r="12" fill="#4a90e2" opacity="0.3" />
          <circle cx="100" cy="320" r="6" fill="#FFD700" opacity="0.6" />
          
          {/* Connecting Lines */}
          <line x1="150" y1="140" x2="150" y2="200" stroke="#FFD700" strokeWidth="2" opacity="0.3" />
        </svg>
      </div>

      {/* Right Panel - Form */}
      <div className="auth-right-panel">
        <section className="auth-page">
          <div className="auth-header">
            <h2>CREATE ACCOUNT</h2>
            <div className="auth-underline"></div>
          </div>
          
          <p className="auth-subtitle">Join Influ-Buddies today</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Full Name
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="Your full name"
                required 
              />
            </label>

            <label>
              Email Address
              <input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder="you@example.com"
                required 
              />
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter a strong password"
                required
              />
            </label>

            <label>
              I am a...
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="brand">Brand/Company</option>
                <option value="influencer">Influencer/Creator</option>
              </select>
            </label>

            <label>
              Location
              <input 
                name="location" 
                value={form.location} 
                onChange={handleChange}
                placeholder="City, Country"
              />
            </label>

            {/* Additional fields for influencers */}
            {form.role === 'influencer' && (
              <>
                <label>
                  Your Niche/Category *
                  <select name="niche" value={form.niche} onChange={handleChange} required>
                    <option value="">Select your niche</option>
                    <option value="beauty">Beauty</option>
                    <option value="fashion">Fashion</option>
                    <option value="fitness">Fitness</option>
                    <option value="wellness">Wellness</option>
                    <option value="food">Food & Cooking</option>
                    <option value="travel">Travel</option>
                    <option value="tech">Technology</option>
                    <option value="gaming">Gaming</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="music">Music</option>
                    <option value="education">Education</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="sustainability">Sustainability</option>
                  </select>
                </label>

                <label>
                  Your Platforms
                  <div className="platforms-grid">
                    <label style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        name="instagram"
                        checked={form.platforms.includes('instagram')}
                        onChange={handleChange}
                      />
                      Instagram
                    </label>
                    <label style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        name="youtube"
                        checked={form.platforms.includes('youtube')}
                        onChange={handleChange}
                      />
                      YouTube
                    </label>
                    <label style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        name="tiktok"
                        checked={form.platforms.includes('tiktok')}
                        onChange={handleChange}
                      />
                      TikTok
                    </label>
                    <label style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        name="twitter"
                        checked={form.platforms.includes('twitter')}
                        onChange={handleChange}
                      />
                      Twitter
                    </label>
                    <label style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        name="linkedin"
                        checked={form.platforms.includes('linkedin')}
                        onChange={handleChange}
                      />
                      LinkedIn
                    </label>
                  </div>
                </label>

                <label>
                  Gender
                  <select name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label>
                  Follower Count
                  <input
                    name="followerCount"
                    type="number"
                    value={form.followerCount}
                    onChange={handleChange}
                    placeholder="e.g., 100000"
                  />
                </label>

                <label>
                  Engagement Rate (%)
                  <input
                    name="engagementRate"
                    type="number"
                    step="0.1"
                    value={form.engagementRate}
                    onChange={handleChange}
                    placeholder="e.g., 4.5"
                  />
                </label>

                <label>
                  Social Media Link
                  <input
                    name="socialLink"
                    type="url"
                    value={form.socialLink}
                    onChange={handleChange}
                    placeholder="https://instagram.com/yourprofile"
                  />
                </label>

                <label>
                  Profile Image URL
                  <input
                    name="imageUrl"
                    type="url"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/photo.jpg"
                  />
                </label>
              </>
            )}

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-social">
            <p>Or sign up with</p>
            <div className="social-buttons">
              <button className="social-btn">G</button>
              <button className="social-btn">f</button>
              <button className="social-btn">𝕏</button>
              <button className="social-btn">in</button>
            </div>
          </div>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Log in here</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

