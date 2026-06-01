// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import { remarkGoto } from "./src/remark/remark-goto.mjs";
import { remarkAbstract } from "./src/remark/remark-abstract.mjs";
import { remarkDate } from "./src/remark/remark-date.mjs";
import { remarkTimeline } from "./src/remark/remark-timeline.mjs";
import { remarkMapImage } from "./src/remark/remark-map-image.mjs";
import { remarkAbstractOf } from "./src/remark/remark-abstract-of";
import { rehypeHeadingIds, unified } from "@astrojs/markdown-remark";

// https://astro.build/config
export default defineConfig({
    output: "static",
    integrations: [svelte(), mdx()],

    markdown: {
        processor: unified({
            remarkPlugins: [
                remarkGfm,
                remarkDirective,
                // Custom
                remarkGoto,
                remarkAbstract,
                remarkAbstractOf,
                remarkDate,
                remarkTimeline,
                remarkMapImage,
            ],
            rehypePlugins: [rehypeHeadingIds],
        }),
    },

    vite: {
        plugins: [tailwindcss()],
    },
});
