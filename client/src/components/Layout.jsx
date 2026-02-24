import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Layout.css';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="logo-area">
          <Link to="/" className="brand">
            Influ-Buddies
          </Link>
        </div>
        <nav className="nav-links">
          <NavLink to="/browse">Browse Influencers</NavLink>
          {user?.role === 'brand' && <NavLink to="/dashboard/brand">Brand Dashboard</NavLink>}
          {user?.role === 'influencer' && (
            <NavLink to="/dashboard/influencer">Influencer Dashboard</NavLink>
          )}
        </nav>
        <div className="auth-actions">
          {user ? (
            <>
              <span className="user-pill">{user.name}</span>
              <button type="button" onClick={logout} className="secondary-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup" className="primary-link">
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">© {new Date().getFullYear()} Influ-Buddies</footer>
    </div>
  );
}

