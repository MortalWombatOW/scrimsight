import * as path from 'path';
import * as webpack from 'webpack';
import 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import InterpolateHtmlPlugin from 'interpolate-html-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import keysTransformer from 'ts-transformer-keys/transformer';

const webpackConfig = () => ({
  entry: './src/index.tsx',
  ...(process.env.production || !process.env.development
    ? {}
    : { devtool: 'eval-source-map' }),

  resolve: {
    extensions: ['.ts', '.tsx', '.json', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
    fallback: {
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert/'),
    },
  },
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'build.js',
  },
  module: {
    rules: [
      {
        test: /\.worker\.ts$/,
        use: {
          loader: 'worker-loader',
          options: {
            // Use directory structure & typical names of chunks produces by "react-scripts"
            filename: 'static/js/[name].[contenthash:8].js',
          },
        },
      },
      {
        test: /.(ts|tsx|json)?$/,
        // loader: 'ts-loader',
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, '../wombat-data-framework/src'),
        ],
        exclude: '/node_modules/',
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/env',
                '@babel/preset-typescript',
                '@babel/react',
              ],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-syntax-import-assertions',
              ],
            },
          },
          {
            loader: 'ts-loader',
            options: {
              getCustomTransformers: (program) => ({
                before: [keysTransformer(program)],
              }),
            },
          },

          //   // {
          //   //   loader: 'ts-node/esm',
          //   // },
        ],
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      //  {
      //   test: /\.json$/,
      //   loader: 'json-loader'
      // }
    ],
  },
  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      // HtmlWebpackPlugin simplifies creation of HTML files to serve your webpack bundles
      template: './public/index.html',
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, process.env),
    // DefinePlugin allows you to create global constants which can be configured at compile time

    new ForkTsCheckerWebpackPlugin({
      // Speeds up TypeScript type checking and ESLint linting (by moving each to a separate process)
      // eslint: {
      //   files: './src/**/*.{ts,tsx,js,jsx}',
      // },
    }),
    new Dotenv({
      path: `./.env.${process.env.NODE_ENV}`,
    }),
  ],
  optimization: {
    minimize: true,
  },
});

export default webpackConfig;
