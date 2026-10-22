import { Link } from "react-router";
import MovieGrid from "../components/MovieGrid.jsx";
import { GridSkeleton, StatusMessage } from "../components/LoadingState.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { useTmdb } from "../hooks/useTmdb.js";
import { getMovieDetails } from "../services/tmdbApi.js";

function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  // localStorage only keeps ids: each movie is loaded from TMDB
  const { data, loading, error } = useTmdb(
    (signal) => Promise.all(favoriteIds.map((id) => getMovieDetails(id, signal))),
    [favoriteIds.join(",")],
  );

  // Hide a movie right away when it is removed from the list
  const movies = (data ?? []).filter((movie) => favoriteIds.includes(movie.id));

  return (
    <section className="catalog catalog--page container" aria-labelledby="favorites-title">
      <div className="catalog__head">
        <div>
          <h1 id="favorites-title" className="section-title">
            Ma liste
          </h1>
          <p className="section-text">Les films que vous avez gardés de côté, enregistrés sur cet appareil.</p>
        </div>
      </div>

      {favoriteIds.length === 0 ? (
        <StatusMessage
          title="Votre liste est vide"
          action={
            <Link to="/" className="btn btn--primary">
              Explorer les films
            </Link>
          }
        >
          Ajoutez un film avec le cœur affiché sur son affiche ou sur sa page.
        </StatusMessage>
      ) : error ? (
        <StatusMessage title="Votre liste n'a pas pu être chargée">{error.message}</StatusMessage>
      ) : loading && !data ? (
        <GridSkeleton count={favoriteIds.length} />
      ) : (
        <MovieGrid movies={movies} />
      )}
    </section>
  );
}

export default FavoritesPage;
