/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: ['./test-setup.js'],
        globals: true, // Allows using describe, it, expect without imports
    },
})
