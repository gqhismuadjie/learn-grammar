import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves this project from a subpath:
//   https://<user>.github.io/learn-grammar/
// The `base` must match the repo name so built asset URLs resolve.
export default defineConfig({
  base: "/learn-grammar/",
  plugins: [react()],
});
