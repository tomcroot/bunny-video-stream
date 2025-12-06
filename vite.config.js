import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        tailwindcss(),
        vue(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vue ecosystem
                    'vue-vendor': ['vue', '@inertiajs/vue3'],
                    // UI libraries
                    'ui-vendor': ['lucide-vue-next', 'reka-ui', 'class-variance-authority'],
                    // Video libraries
                    'video-vendor': ['hls.js'],
                    // Form validation
                    'form-vendor': ['vee-validate', '@vee-validate/zod', 'zod'],
                    // Utilities
                    'utils-vendor': ['@vueuse/core', 'clsx', 'tailwind-merge'],
                    // Other vendor libraries
                    'vendor': ['axios'],
                },
            },
        },
        chunkSizeWarningLimit: 1000, // Increase limit to 1000kb
    },
});
