/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig, Plugin } from 'vite';
import { resolve } from 'path';
// Removed: import { configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {  
  return {
    plugins: [
      tailwindcss(),
      react(),
      tsconfigPaths(),
      visualizer({
        open: false,
        gzipSize: true,
      }) as Plugin,
    ],
    
    resolve: {
      alias: {
        stream: 'stream-browserify',
        assert: 'assert',
      },
    },
    
    optimizeDeps: {
      exclude: ['pandas-js'],
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
      commonjsOptions: {
        transformMixedEsModules: true,
        include: [/node_modules/],
      },
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        external: [
          'babel-runtime/helpers/toConsumableArray',
          'babel-runtime/helpers/classCallCheck',
          'babel-runtime/helpers/createClass',
          'babel-runtime/helpers/possibleConstructorReturn',
          'babel-runtime/helpers/get',
          'babel-runtime/helpers/inherits',
          'babel-runtime/helpers/slicedToArray',
          'babel-runtime/helpers/typeof',
          'babel-runtime/regenerator'
        ],
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      // You might want to exclude node_modules explicitly if needed,
      // though Vitest often handles this by default.
      // exclude: [...configDefaults.exclude, '**/node_modules/**'],
    },
  };
});
