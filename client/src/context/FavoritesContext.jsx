import { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext(null);

const STORAGE_KEY = 'influ_buddies_favorites';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setFavorites(JSON.parse(raw));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  function isFavorite(id) {
    return favorites.some((f) => f._id === id);
  }

  function toggleFavorite(influencer) {
    setFavorites((current) => {
      if (current.some((f) => f._id === influencer._id)) {
        return current.filter((f) => f._id !== influencer._id);
      }
      return [...current, influencer];
    });
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return ctx;
}

