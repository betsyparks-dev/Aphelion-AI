import { defineConfig } from "@tanstack/react-start/config";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3000,
    preset: "node",
  },
  vite: {
    plugins: [tailwindcss(), tsConfigPaths()],
  },
});