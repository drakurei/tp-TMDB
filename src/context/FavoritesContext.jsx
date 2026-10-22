import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "jflix-favorites";
const FavoritesContext = createContext(null);

// Only the movie ids are saved; details are fetched again from TMDB
function readStoredIds() {
  try {
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState(readStoredIds);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // Storage can be blocked (private mode): favorites stay in memory
    }
  }, [favoriteIds]);

  function toggleFavorite(id) {
    setFavoriteIds((ids) => (ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]));
  }

  const isFavorite = (id) => favoriteIds.includes(id);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
