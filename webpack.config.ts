import path from 'path';
import zlib from 'zlib';
import webpack from 'webpack';
import CompressionPlugin from 'compression-webpack-plugin';

const config: webpack.Configuration = {
  mode: 'production',
  entry: './src/dashboard-strategy.ts',
  output: {
    clean: true,
    filename: 'dashboard-strategy.js',
    chunkFilename: 'dashboard-strategy-[name].[contenthash:8].js',
    path: path.resolve(import.meta.dirname, 'dist'),
    // The entry overrides this after finding its own resource URL. Do not use
    // 'auto': HA may load it via import() while another card owns the last script.
    publicPath: '/hacsfiles/dashboard-strategy/',
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
  optimization: {
    splitChunks: {
      // Chunk architecture:
      //   main (entry)  → tiny, registers custom element instantly
      //   lit           → Lit framework, shared by core + views + editor
      //   core          → Registry, Utils, Sections, OverviewViewStrategy, overview cards
      //                   (SummaryCard, AreaNavigationCard)
      //   views         → non-overview view strategies plus their cards (lights/covers
      //                   groups, batteries, camera, video tip); loaded eagerly with core
      //   editor        → StrategyEditor (on-demand only)
      //   yaml          → js-yaml, preloaded by the editor in the background
      cacheGroups: {
        lit: {
          test: /[\\/]node_modules[\\/](?:lit|@lit|lit-html|lit-element)[\\/]/,
          name: 'lit',
          chunks: 'async',
          enforce: true,
          priority: 20,
        },
        core: {
          test: /[\\/]src[\\/](?:Registry|utils|translations[\\/]en\.json|sections|cards[\\/](?:SummaryCard|AreaNavigationCard)\.ts$|views[\\/]OverviewViewStrategy)/,
          name: 'core',
          chunks: 'async',
          enforce: true,
          priority: 10,
        },
        views: {
          test: /[\\/]src[\\/](?:views[\\/](?!OverviewViewStrategy)|cards[\\/](?!(?:SummaryCard|AreaNavigationCard)\.ts$))/,
          name: 'views',
          chunks: 'async',
          enforce: true,
          priority: 10,
        },
        editor: {
          // Metadata is consumed by the editor/diagnostics and stays on demand.
          // Bundled English editor strings join it; other editor languages
          // stay separate `lang-editor-*` chunks.
          test: /[\\/]src[\\/]editor[\\/]|[\\/]src[\\/](?:utils[\\/]option-metadata\.ts|translations[\\/]editor[\\/]en\.json)$/,
          name: 'editor',
          chunks: 'async',
          enforce: true,
          priority: 15,
        },
      },
    },
  },
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$/,
      minRatio: 0.8,
    }),
    new CompressionPlugin({
      algorithm: 'brotliCompress',
      test: /\.js$/,
      compressionOptions: { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } } as any,
      minRatio: 0.8,
      filename: '[path][base].br',
    }),
  ],
};

export default config;
