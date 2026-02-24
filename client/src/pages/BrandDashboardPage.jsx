import './DashboardPages.css';
import { useFavorites } from '../context/FavoritesContext.jsx';
import InfluencerCard from '../components/InfluencerCard.jsx';

export default function BrandDashboardPage() {
  const { favorites } = useFavorites();

  return (
    <section className="dashboard-page">
      <h2>Brand dashboard</h2>
      <p>Your saved influencers appear here. Use the “Save” button on any card to favourite.</p>
      {favorites.length === 0 ? (
        <p>No favourites yet. Browse influencers and save a few to get started.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((inf) => (
            <InfluencerCard key={inf._id} influencer={inf} />
          ))}
        </div>
      )}
    </section>
  );
}

