import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    server: {
        proxy: {
            '/data': {
                target: process.env.BACKEND_URL ?? 'http://localhost:6666',
                changeOrigin: true
            }
        }
    }
});
