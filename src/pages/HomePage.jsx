import { useCallback, useRef } from "react";
import { useLocation, useSearchParams } from "react-router";
import Hero from "../components/Hero.jsx";
import SearchBar from "../components/SearchBar.jsx";
import MovieGrid from "../components/MovieGrid.jsx";
import { GridSkeleton, StatusMessage } from "../components/LoadingState.jsx";
import { useTmdb } from "../hooks/useTmdb.js";
import { getPopularMovies, searchMovies } from "../services/tmdbApi.js";

function HomePage() {
  // The search lives in the URL (?q=...), so coming back from a
  // movie page restores the same results
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const location = useLocation();
  const listRef = useRef(null);

  const hero = useTmdb((signal) => getPopularMovies(1, "", signal), []);
  const list = useTmdb(
    (signal) => (query ? searchMovies(query, 1, signal) : getPopularMovies(1, "", signal)),
    [query],
  );

  const heroMovie = hero.data?.results.find((movie) => movie.backdrop_path) ?? null;
  const movies = list.data?.results ?? [];

  const handleSearch = useCallback(
    (value) => {
      setSearchParams(value ? { q: value } : {}, { replace: true });
    },
    [setSearchParams],
  );

  function scrollToList() {
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <Hero movie={heroMovie} onExplore={scrollToList} />

      <div className="container search-wrap">
        <SearchBar query={query} onSearch={handleSearch} focusSignal={location.state?.focusSearch} />
      </div>

      <section className="catalog container" ref={listRef} aria-labelledby="catalog-title">
        <div className="catalog__head">
          <div>
            <h2 id="catalog-title" className="section-title">
              {query ? `Résultats pour « ${query} »` : "À l'affiche"}
            </h2>
            <p className="section-text">
              {query
                ? list.data && `${list.data.total_results.toLocaleString("fr-FR")} films trouvés sur TMDB`
                : "Les films les plus populaires sur TMDB en ce moment."}
            </p>
          </div>
          {query && (
            <button type="button" className="btn btn--ghost" onClick={() => handleSearch("")}>
              Revenir aux films populaires
            </button>
          )}
        </div>

        {list.error ? (
          <StatusMessage title="Les films n'ont pas pu être chargés">{list.error.message}</StatusMessage>
        ) : list.loading && !list.data ? (
          <GridSkeleton />
        ) : movies.length === 0 ? (
          <StatusMessage title="Aucun film ne correspond à cette recherche">
            Vérifiez l'orthographe ou essayez le titre original du film.
          </StatusMessage>
        ) : (
          <div className={list.loading ? "is-refreshing" : ""}>
            <MovieGrid key={query} movies={movies} />
          </div>
        )}
      </section>
    </>
  );
}

export default HomePage;
