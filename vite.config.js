import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The site is published on GitHub Pages under /tp-TMDB/
export default defineConfig({
  plugins: [react()],
  base: "/tp-TMDB/",
});
