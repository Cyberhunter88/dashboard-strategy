import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/dashboard-strategy.ts',
  output: {
    clean: true,
    filename: 'dashboard-strategy.js',
    // Separate folder: dist/ holds the tracked HACS release artifacts.
    path: path.resolve(import.meta.dirname, 'dist-dev'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};

export default config;
