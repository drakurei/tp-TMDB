import { useTmdb } from "../hooks/useTmdb.js";
import { getGenres } from "../services/tmdbApi.js";

function GenreFilter({ selected, onChange }) {
  const { data: genres } = useTmdb((signal) => getGenres(signal), []);

  // The filter is optional: if genres fail to load, it is simply hidden
  if (!genres) return null;

  return (
    <ul className="genres" aria-label="Filtrer par genre">
      <li>
        <button type="button" className="genre" aria-pressed={!selected} onClick={() => onChange("")}>
          Tous les genres
        </button>
      </li>
      {genres.map((genre) => (
        <li key={genre.id}>
          <button
            type="button"
            className="genre"
            aria-pressed={selected === String(genre.id)}
            onClick={() => onChange(String(genre.id))}
          >
            {genre.name}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default GenreFilter;
