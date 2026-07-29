import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter(),
        csrf: { checkOrigin: true },
        paths: {
            base: process.env.BASE_PATH ?? ''
        }
    }
};