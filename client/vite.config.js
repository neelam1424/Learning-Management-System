// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })




import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ Ensure objects/arrays are mutable by spreading into new arrays
export default defineConfig({
  plugins: [
    react()
  ],

  resolve: {
    alias: [
      { find: '@', replacement: '/src' } // adjust if you use "@/..." imports
    ]
  },

  build: {
    rollupOptions: {
      // ✅ Copy objects instead of mutating frozen ones
      output: {
        manualChunks: undefined
      }
    }
  },

  optimizeDeps: {
    // ✅ Forces Vite to pre-bundle dependencies in a mutable way
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
});
