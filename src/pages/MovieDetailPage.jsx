import { useLocation, useNavigate, useParams, Link } from "react-router";
import FavoriteButton from "../components/FavoriteButton.jsx";
import { StatusMessage } from "../components/LoadingState.jsx";
import { useTmdb } from "../hooks/useTmdb.js";
import { getMovieDetails } from "../services/tmdbApi.js";
import { formatDate, formatRating, formatRuntime, getImageUrl } from "../utils/movieUtils.js";

function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: movie, loading, error } = useTmdb((signal) => getMovieDetails(id, signal), [id]);

  // Go back to the previous list (with its search), or home on a direct visit
  function goBack() {
    if (location.key !== "default") navigate(-1);
    else navigate("/");
  }

  const backButton = (
    <button type="button" className="back-button" onClick={goBack}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 5 8 12l7 7" />
      </svg>
      Retour à l'exploration
    </button>
  );

  if (loading) {
    return (
      <div className="detail detail--loading container">
        {backButton}
        <div className="detail__layout">
          <div className="skeleton skeleton--poster detail__poster" />
          <div className="detail__info">
            <div className="skeleton skeleton--title" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line skeleton--short" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const notFound = error.status === 404;
    return (
      <div className="detail container">
        {backButton}
        <StatusMessage
          title={notFound ? "Ce film est introuvable" : "Le film n'a pas pu être chargé"}
          action={
            <Link to="/" className="btn btn--primary">
              Voir les films populaires
            </Link>
          }
        >
          {notFound ? "Le lien est peut-être incorrect ou le film a été retiré de TMDB." : error.message}
        </StatusMessage>
      </div>
    );
  }

  const backdrop = getImageUrl(movie.backdrop_path, "w1280");
  const poster = getImageUrl(movie.poster_path, "w500");
  const rating = formatRating(movie.vote_average, movie.vote_count);
  const facts = [
    { label: "Sortie", value: formatDate(movie.release_date) },
    { label: "Durée", value: formatRuntime(movie.runtime) },
    { label: "Note TMDB", value: rating && `${rating} / 10 (${movie.vote_count.toLocaleString("fr-FR")} votes)` },
    { label: "Titre original", value: movie.original_title !== movie.title ? movie.original_title : null },
  ].filter((fact) => fact.value);

  return (
    <article className="detail">
      <div className="detail__backdrop" aria-hidden="true">
        {backdrop && <img src={backdrop} alt="" />}
      </div>

      <div className="container">
        {backButton}
        <div className="detail__layout">
          <div className="detail__poster">
            {poster ? (
              <img src={poster} alt={`Affiche de ${movie.title}`} />
            ) : (
              <div className="poster-fallback">
                <span>{movie.title}</span>
              </div>
            )}
          </div>

          <div className="detail__info">
            <h1 className="detail__title">{movie.title}</h1>
            {movie.tagline && <p className="detail__tagline">{movie.tagline}</p>}

            {movie.genres?.length > 0 && (
              <ul className="detail__genres" aria-label="Genres">
                {movie.genres.map((genre) => (
                  <li key={genre.id}>{genre.name}</li>
                ))}
              </ul>
            )}

            <p className="detail__overview">
              {movie.overview || "Aucun résumé en français n'est disponible pour ce film."}
            </p>

            {facts.length > 0 && (
              <dl className="detail__facts">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <FavoriteButton movieId={movie.id} title={movie.title} withLabel className="favorite--large" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default MovieDetailPage;
