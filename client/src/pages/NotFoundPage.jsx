import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', textAlign: 'center', padding: '2rem', gap: '1rem',
    }}>
      <div style={{ fontSize: '5rem', lineHeight: 1 }}>404</div>
      <h2 style={{ margin: 0 }}>Page not found</h2>
      <p style={{ color: 'var(--text-muted)', margin: 0 }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" style={{
        marginTop: '0.5rem', padding: '0.6rem 1.5rem',
        background: 'var(--accent)', color: '#fff',
        borderRadius: '8px', textDecoration: 'none', fontWeight: 500,
      }}>
        Go Home
      </Link>
    </div>
  );
}
