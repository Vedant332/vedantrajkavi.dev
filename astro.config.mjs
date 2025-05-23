import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import astroOGImage from "./plugins/og-image";

// https://astro.build/config
export default defineConfig({
  site: "https://vedant332.github.io/vedantrajkavi.dev", // ✅ GitHub Pages site URL
  base: "/vedantrajkavi.dev/",                            // ✅ Add this line
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    react(),
    sitemap(),
    astroOGImage({
      config: {
        path: "/posts",
      },
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
});