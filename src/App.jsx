import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import HomePage from "./pages/HomePage.jsx";
import MovieDetailPage from "./pages/MovieDetailPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  const { pathname } = useLocation();

  // A new page starts at the top (search changes keep the scroll)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <FavoritesProvider>
      <a href="#main" className="skip-link">
        Aller au contenu
      </a>
      <Header />
      <main id="main" key={pathname} className="page">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/favoris" element={<FavoritesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </FavoritesProvider>
  );
}

export default App;
