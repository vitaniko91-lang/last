/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    // Без явного url jsdom работает на непрозрачном источнике, и localStorage
    // приходит заглушкой без методов — корзина в тестах не проверяется.
    environmentOptions: { jsdom: { url: 'http://localhost' } },
  },
})
