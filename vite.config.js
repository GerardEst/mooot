/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    // Serve the app from the `pages/` directory in dev/preview
    root: resolve(__dirname, 'pages'),
    // Load .env from the repository root (not pages/)
    envDir: resolve(__dirname),
    // Keep using the repository-level public directory for assets
    publicDir: resolve(__dirname, 'public'),
    resolve: {
        alias: {
            '@src': resolve(__dirname, 'src'),
        },
    },
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
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'pages/index.html'),
                joc: resolve(__dirname, 'pages/joc/index.html'),
                trofeus: resolve(__dirname, 'pages/trofeus/index.html'),
            },
        },
    },
})
