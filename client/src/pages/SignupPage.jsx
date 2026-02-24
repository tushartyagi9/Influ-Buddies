import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
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
    <section className="auth-page">
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Role
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="brand">Brand</option>
            <option value="influencer">Influencer</option>
          </select>
        </label>
        <label>
          Location
          <input name="location" value={form.location} onChange={handleChange} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
    </section>
  );
}

