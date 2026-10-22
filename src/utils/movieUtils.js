const IMAGE_URL = "https://image.tmdb.org/t/p";

// Returns null instead of building an URL that ends with "null"
export function getImageUrl(path, size = "w500") {
  return path ? `${IMAGE_URL}/${size}${path}` : null;
}

export function getYear(date) {
  return date ? date.slice(0, 4) : null;
}

export function formatRating(vote, count = 1) {
  if (!vote || !count) return null;
  return vote.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function formatDate(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function formatRuntime(minutes) {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours} h ${String(rest).padStart(2, "0")}` : `${rest} min`;
}
