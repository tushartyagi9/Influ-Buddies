import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthPages.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to login');
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
            <h2>WELCOME BACK</h2>
            <div className="auth-underline"></div>
          </div>
          
          <p className="auth-subtitle">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Email Address
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </label>

            <div className="auth-forgot-password">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="auth-social">
            <p>Or continue with</p>
            <div className="social-buttons">
              <button className="social-btn">G</button>
              <button className="social-btn">f</button>
              <button className="social-btn">𝕏</button>
              <button className="social-btn">in</button>
            </div>
          </div>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

