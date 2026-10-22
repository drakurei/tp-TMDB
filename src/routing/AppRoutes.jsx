import { Route, Routes } from "react-router";
import HomePage from "../pages/HomePage.jsx";
import MovieDetailPage from "../pages/MovieDetailPage.jsx";
import FavoritesPage from "../pages/FavoritesPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

// Every page of the app and its URL
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movie/:id" element={<MovieDetailPage />} />
      <Route path="/favoris" element={<FavoritesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
