// @ts-check
import react from "@astrojs/react";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  devToolbar: { enabled: false },
  vite: {
    server: {
      proxy: {
        "/api": {
          target: "https://atelier.ac/",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  },
});
