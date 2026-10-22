import { useFavorites } from "../context/FavoritesContext.jsx";

function FavoriteButton({ movieId, title, className = "", withLabel = false }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(movieId);
  const label = active ? `Retirer ${title} de ma liste` : `Ajouter ${title} à ma liste`;

  return (
    <button
      type="button"
      className={`favorite ${active ? "favorite--active" : ""} ${className}`}
      aria-pressed={active}
      aria-label={withLabel ? undefined : label}
      title={label}
      onClick={() => toggleFavorite(movieId)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20.5 4.2 13a4.9 4.9 0 0 1 7-6.9l.8.8.8-.8a4.9 4.9 0 0 1 7 6.9z" />
      </svg>
      {withLabel && <span>{active ? "Dans ma liste" : "Ajouter à ma liste"}</span>}
    </button>
  );
}

export default FavoriteButton;
