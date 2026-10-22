import { useCallback, useRef } from "react";
import { useLocation, useSearchParams } from "react-router";
import Hero from "../components/Hero.jsx";
import SearchBar from "../components/SearchBar.jsx";
import GenreFilter from "../components/GenreFilter.jsx";
import MovieGrid from "../components/MovieGrid.jsx";
import Pagination from "../components/Pagination.jsx";
import { GridSkeleton, StatusMessage } from "../components/LoadingState.jsx";
import { useTmdb } from "../hooks/useTmdb.js";
import { getPopularMovies, MAX_PAGE, searchMovies } from "../services/tmdbApi.js";

function HomePage() {
  // Search, page and genre live in the URL (?q=...&page=...&genre=...),
  // so coming back from a movie page restores the same results
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const genre = searchParams.get("genre") ?? "";
  const page = Math.min(Math.max(Number(searchParams.get("page")) || 1, 1), MAX_PAGE);
  const location = useLocation();
  const listRef = useRef(null);

  const hero = useTmdb((signal) => getPopularMovies(1, "", signal), []);
  const list = useTmdb(
    (signal) => (query ? searchMovies(query, page, signal) : getPopularMovies(page, genre, signal)),
    [query, page, query ? "" : genre],
  );

  const heroMovie = hero.data?.results.find((movie) => movie.backdrop_path) ?? null;
  const totalPages = Math.min(list.data?.total_pages ?? 0, MAX_PAGE);

  // TMDB search has no genre parameter: the genre is applied to the
  // results of the current page instead
  const movies = (list.data?.results ?? []).filter(
    (movie) => !query || !genre || movie.genre_ids.includes(Number(genre)),
  );

  const updateParams = useCallback(
    (changes) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleSearch = useCallback((value) => updateParams({ q: value, page: "" }), [updateParams]);

  function scrollToList() {
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function changePage(value) {
    updateParams({ page: value > 1 ? String(value) : "" });
    scrollToList();
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

        <GenreFilter selected={genre} onChange={(value) => updateParams({ genre: value, page: "" })} />

        {list.error ? (
          <StatusMessage title="Les films n'ont pas pu être chargés">{list.error.message}</StatusMessage>
        ) : list.loading && !list.data ? (
          <GridSkeleton />
        ) : movies.length === 0 ? (
          <StatusMessage title={query ? "Aucun film ne correspond à cette recherche" : "Aucun film dans ce genre"}>
            {query && genre
              ? "Aucun résultat de cette page n'appartient à ce genre. Essayez la page suivante ou un autre genre."
              : "Vérifiez l'orthographe ou essayez le titre original du film."}
          </StatusMessage>
        ) : (
          <div className={list.loading ? "is-refreshing" : ""}>
            <MovieGrid key={`${query}-${genre}-${page}`} movies={movies} />
          </div>
        )}

        {!list.error && <Pagination page={page} totalPages={totalPages} onChange={changePage} />}
      </section>
    </>
  );
}

export default HomePage;
