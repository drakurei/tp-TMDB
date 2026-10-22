import { useEffect, useRef, useState } from "react";

const DEBOUNCE_DELAY = 500;

// Controlled input. `query` is the search stored in the URL,
// `onSearch` updates it (after a short pause, or right away on submit).
function SearchBar({ query, onSearch, focusSignal }) {
  const [text, setText] = useState(query);
  const inputRef = useRef(null);

  // Follow the URL when it changes from outside (back button, reset)
  useEffect(() => {
    setText((current) => (current.trim() === query ? current : query));
  }, [query]);

  useEffect(() => {
    if (text.trim() === query) return;
    const timer = setTimeout(() => onSearch(text.trim()), DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [text, query, onSearch]);

  useEffect(() => {
    if (!focusSignal) return;
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [focusSignal]);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(text.trim());
  }

  return (
    <form className="search" role="search" onSubmit={handleSubmit}>
      <label htmlFor="search-input" className="visually-hidden">
        Rechercher un film
      </label>
      <svg className="search__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </svg>
      <input
        ref={inputRef}
        id="search-input"
        type="search"
        className="search__input"
        placeholder="Un titre, une saga, un souvenir de film…"
        value={text}
        onChange={(event) => setText(event.target.value)}
        autoComplete="off"
      />
      <button type="submit" className="btn btn--light search__button">
        Rechercher
      </button>
    </form>
  );
}

export default SearchBar;
