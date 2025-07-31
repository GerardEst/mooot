/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: ['./test-setup.ts'],
        globals: true, // Allows using describe, it, expect without imports
        coverage: {
            reporter: ['text', 'html'],
            exclude: [
                'scripts/**',
                'dist/**',
                'vite.config.js',
                'test-setup.js',
                'main.ts',
            ],
        },
    },
    build: {
        rollupOptions: {
            input: {
                main: './index.html',
                bot: './pages/bot/index.html',
            },
        },
    },
})
