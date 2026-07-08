// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: cloudflare({
    prerenderEnvironment: "node",
  }),
  integrations: [react(), vue()],
  devToolbar: { enabled: false },
  vite: {
    resolve: {
      dedupe: ["react", "react-dom"],
    },
  },
});
