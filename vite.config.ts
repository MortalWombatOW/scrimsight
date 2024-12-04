/// <reference types="vite/client" />
import { defineConfig, Plugin } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {  
  return {
    plugins: [
      react(),
      tsconfigPaths(),
      visualizer({
        open: true,
        gzipSize: true,
      }) as Plugin,
    ],
    
    resolve: {
      alias: {
        stream: 'stream-browserify',
        assert: 'assert',
      },
    },

    server: {
      port: 3000,
      open: true,
      watch: {
        usePolling: true,
      },
      hmr: true,
    },

    build: {
      outDir: 'build',
      sourcemap: mode === 'development',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
      },
    },
  };
}); 
