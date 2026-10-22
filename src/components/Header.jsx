import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useFavorites } from "../context/FavoritesContext.jsx";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { favoriteIds } = useFavorites();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Goes back to the home page and asks the search bar to take the focus
  function openSearch() {
    navigate("/", { state: { focusSearch: Date.now() } });
  }

  return (
    <header className={`header ${scrolled ? "header--solid" : ""}`}>
      <div className="header__inner container">
        <Link to="/" className="logo" aria-label="JFLIX, accueil">
          J<span>F</span>LIX
        </Link>
        <nav className="nav" aria-label="Navigation principale">
          <NavLink to="/" end className="nav__link">
            Accueil
          </NavLink>
          <button type="button" className="nav__link" onClick={openSearch}>
            Recherche
          </button>
          <NavLink to="/favoris" className="nav__link">
            Ma liste
            {favoriteIds.length > 0 && <span className="nav__count">{favoriteIds.length}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
