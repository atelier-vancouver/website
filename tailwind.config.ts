import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#FAF6F2",
      },
      fontFamily: {
        handwriting: ["handwriting", "cursive"],
        hahmlet: ["Hahmlet", "sans-serif"],
        ibm: ["IBM Plex Mono", "sans-serif"],
      },
      colors: {
        "off-white": "#FFFDF5",
        "off-black": "#1A1A1A",
      },
    },
  },
  plugins: [],
};
export default config;
