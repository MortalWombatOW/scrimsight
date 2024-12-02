/// <reference types="vite/client" />
import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import eslintPlugin from 'vite-plugin-eslint';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      tsconfigPaths(),
      eslintPlugin({
        include: ['src/**/*.ts', 'src/**/*.tsx'],
        exclude: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**', '**/*.test.ts', '**/*.test.tsx'],
        lintOnStart: true,
        failOnError: mode === 'production',
        failOnWarning: mode === 'production',
        emitError: true,
        emitWarning: true,
        cache: true,
      }),
      visualizer({
        open: true,
        gzipSize: true,
      }),
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

    // Define env variables to be replaced in the client code
    define: {
      'process.env': env,
    },
  };
}); 
