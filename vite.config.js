import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'js', // output folder
    emptyOutDir: false,
    rollupOptions: {
      input: 'src/search.ts',
      output: {
        entryFileNames: 'search.js', // final filename
        format: 'iife', // immediately runs in the browser
      },
    },
  },
});
