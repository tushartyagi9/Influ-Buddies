import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  return (
    <section className="home-hero">
      <div className="hero-text">
        <h1>Connect brands with the right influencers.</h1>
        <p>
          Influ-Buddies helps brands discover, evaluate, and connect with social media influencers
          across niches and platforms.
        </p>
        <div className="hero-actions">
          <Link to="/browse" className="primary-link">
            Browse influencers
          </Link>
          <Link to="/signup" className="secondary-link">
            Join as brand or influencer
          </Link>
        </div>
      </div>
    </section>
  );
}

