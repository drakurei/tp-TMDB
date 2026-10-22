import MovieCard from "./MovieCard.jsx";

function MovieGrid({ movies }) {
  return (
    <ul className="grid">
      {movies.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} index={index} />
      ))}
    </ul>
  );
}

export default MovieGrid;
