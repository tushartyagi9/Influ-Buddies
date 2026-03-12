import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthPages.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('brand');
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
      const res = await login(form);
      if (res.user?.role === 'brand') {
        navigate('/dashboard/brand');
      } else if (res.user?.role === 'influencer') {
        navigate('/dashboard/influencer');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-right-panel">
        <section className="auth-page">
          <div className="auth-header">
            <h2>Welcome back</h2>
            <div className="auth-underline"></div>
          </div>

          {/* Sliding Toggle */}
          <div className="role-toggle">
            <button
              type="button"
              className={`toggle-option${role === 'brand' ? ' active' : ''}`}
              onClick={() => setRole('brand')}
            >
              Brand
            </button>
            <button
              type="button"
              className={`toggle-option${role === 'influencer' ? ' active' : ''}`}
              onClick={() => setRole('influencer')}
            >
              Influencer
            </button>
            <div className={`toggle-slider${role === 'influencer' ? ' toggle-right' : ''}`} />
          </div>

          <p className="auth-subtitle">
            Sign in as {role === 'brand' ? 'a Brand' : 'an Influencer'}
          </p>

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



            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="auth-footer">
            Don&apos;t have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

