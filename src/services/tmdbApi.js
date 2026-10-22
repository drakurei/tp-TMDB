const API_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;

// TMDB refuses any page above 500, even when total_pages says more
export const MAX_PAGE = 500;

export class TmdbError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Successful responses are kept in memory, so going back to a list
// or reopening a movie does not call TMDB a second time
const cache = new Map();

async function request(path, params = {}, signal) {
  if (!TOKEN) {
    throw new TmdbError(
      "Le jeton TMDB est absent. Copiez .env.example en .env, ajoutez votre jeton de lecture puis relancez npm run dev.",
      "missing-token",
    );
  }

  const url = new URL(API_URL + path);
  url.search = new URLSearchParams({ language: "fr-FR", ...params });
  const key = url.toString();
  if (cache.has(key)) return cache.get(key);

  let response;
  try {
    response = await fetch(url, {
      signal,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new TmdbError("Impossible de joindre TMDB. Vérifiez votre connexion internet.", "network");
  }

  if (!response.ok) {
    const messages = {
      401: "Le jeton TMDB est refusé. Vérifiez la valeur de VITE_TMDB_READ_ACCESS_TOKEN.",
      404: "Ce film est introuvable sur TMDB.",
      429: "Trop de requêtes envoyées à TMDB. Patientez quelques secondes puis réessayez.",
    };
    throw new TmdbError(
      messages[response.status] ?? `TMDB a répondu avec une erreur (${response.status}).`,
      response.status,
    );
  }

  const data = await response.json();
  cache.set(key, data);
  return data;
}

export function getPopularMovies(page = 1, genreId = "", signal) {
  const params = { sort_by: "popularity.desc", include_adult: "false", page };
  if (genreId) params.with_genres = genreId;
  return request("/discover/movie", params, signal);
}

export function searchMovies(query, page = 1, signal) {
  return request("/search/movie", { query, page, include_adult: "false" }, signal);
}

export function getMovieDetails(id, signal) {
  return request(`/movie/${id}`, {}, signal);
}

export async function getGenres(signal) {
  const data = await request("/genre/movie/list", {}, signal);
  return data.genres;
}
