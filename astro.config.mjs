// @ts-check
import react from "@astrojs/react";
import { defineConfig } from "astro/config";

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), vue()],
  devToolbar: { enabled: false },
  vite: {
    server: {
      proxy: {
        "/api": {
          target: "https://atelier.place/",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  },
});