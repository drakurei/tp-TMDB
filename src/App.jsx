import { useEffect } from "react";
import { useLocation } from "react-router";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import IntroAnimation from "./components/IntroAnimation.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import AppRoutes from "./routing/AppRoutes.jsx";

function App() {
  const { pathname } = useLocation();

  // A new page starts at the top (search changes keep the scroll)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <FavoritesProvider>
      {/* The intro is an overlay: the pages and TMDB requests load behind it */}
      <IntroAnimation />
      <a href="#main" className="skip-link">
        Aller au contenu
      </a>
      <Header />
      <main id="main" key={pathname} className="page">
        <AppRoutes />
      </main>
      <Footer />
    </FavoritesProvider>
  );
}

export default App;
