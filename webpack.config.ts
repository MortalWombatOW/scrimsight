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
    : {devtool: 'eval-source-map'}),

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [new TsconfigPathsPlugin({configFile: './tsconfig.json'})],
  },
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'build.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        // loader: 'ts-loader',
        include: path.resolve(__dirname, 'src'),
        exclude: /build/,
        use: [
          //   {
          //     loader: 'babel-loader',
          //     options: {
          //       presets: ['@babel/preset-env', '@babel/preset-react'],
          //     },
          //   },
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
});

export default webpackConfig;
