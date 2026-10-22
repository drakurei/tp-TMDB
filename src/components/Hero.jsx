import { Link } from "react-router";
import { getImageUrl, getYear } from "../utils/movieUtils.js";

// `movie` is a real movie returned by TMDB; null while loading or on error
function Hero({ movie, onExplore }) {
  const backdrop = getImageUrl(movie?.backdrop_path, "w1280");

  return (
    <section className="hero" aria-labelledby="hero-title">
      {backdrop ? (
        <img className="hero__image" src={backdrop} alt="" fetchPriority="high" />
      ) : (
        <div className="hero__image hero__image--empty" />
      )}
      <div className="hero__shade" />

      <div className="hero__content container">
        {movie ? (
          <>
            <p className="hero__kicker">
              Le film le plus populaire sur TMDB en ce moment
              {movie.release_date && `, sortie ${getYear(movie.release_date)}`}
            </p>
            <h1 id="hero-title" className="hero__title">
              {movie.title}
            </h1>
            <p className="hero__text">
              Les films du moment, leurs affiches et leurs histoires, réunis dans une salle qui ne ferme
              jamais.
            </p>
          </>
        ) : (
          <>
            <h1 id="hero-title" className="hero__title">
              La salle est prête
            </h1>
            <p className="hero__text">
              Choisissez un film parmi les sorties populaires ou cherchez un titre précis.
            </p>
          </>
        )}

        <div className="hero__actions">
          <button type="button" className="btn btn--primary" onClick={onExplore}>
            Explorer les films
          </button>
          {movie && (
            <Link to={`/movie/${movie.id}`} className="btn btn--ghost">
              Voir ce film
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;
