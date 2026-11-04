# Atelier Website

This website is hosted on Cloudflare Pages and uses Astro as the static site generator.

Check the notion for access to Cloudflare Pages.

## Session board

Run `pnpm dev --port 23576` and open `/session` (23576 is the permanent local port, randomly selected once). `/session/new` redirects there through `public/_redirects`, which only applies to the deployed site and `wrangler dev`, not `pnpm dev`.

The `/session` editor uses System 1 chrome and the bundled Chicago bitmap recreation in `public/fonts/system-1`. Keep this theme confined to the editor; `.session-board-content` retains the original slideshow typography, colors, and artwork. The editor follows the system light/dark setting. Slides stay on automatic Vancouver sunrise/sunset timing, independently of the editor.

The merch artwork has black text on transparency. `MerchInkFilter.vue` inverts just the title and price-label bands in dark mode, preserving the photo colors. Update its band positions if the artwork changes.

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
