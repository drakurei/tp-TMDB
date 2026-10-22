import { useState } from "react";
import { Link } from "react-router";
import { formatRating, getImageUrl, getYear } from "../utils/movieUtils.js";
import FavoriteButton from "./FavoriteButton.jsx";

function MovieCard({ movie, index = 0 }) {
  const [imageFailed, setImageFailed] = useState(false);
  const poster = getImageUrl(movie.poster_path, "w342");
  const year = getYear(movie.release_date);
  const rating = formatRating(movie.vote_average, movie.vote_count);

  return (
    <li className="card" style={{ "--i": index }}>
      <Link to={`/movie/${movie.id}`} className="card__link">
        <div className="card__poster">
          {poster && !imageFailed ? (
            <img
              src={poster}
              alt={`Affiche de ${movie.title}`}
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="poster-fallback" aria-hidden="true">
              <span>{movie.title}</span>
            </div>
          )}
        </div>
        <h3 className="card__title">{movie.title}</h3>
        <p className="card__meta">
          <span>{year ?? "Date inconnue"}</span>
          {rating && (
            <span className="card__rating" aria-label={`Note moyenne ${rating} sur 10`}>
              ★ {rating}
            </span>
          )}
        </p>
      </Link>
      <FavoriteButton movieId={movie.id} title={movie.title} className="card__favorite" />
    </li>
  );
}

export default MovieCard;
