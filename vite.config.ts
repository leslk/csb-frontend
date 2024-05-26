import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import SitemapPlugin from 'vite-plugin-sitemap';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        SitemapPlugin({
            hostname: 'https://caen-street-ball.leslie-elkattoussi.com',
            dynamicRoutes: [
                '/home-page',
                '/tournaments/:id',
                '/contact',
                '/legale-notice',
                '/tournaments',
            ],
          }),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/assets/styles/variables.scss";`
            }
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});
