const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackFavicons = require('webpack-favicons');

module.exports = {
  mode: 'production',
  context: path.join(__dirname, 'src'),
  entry: './main.ts',
  output: {
    path: path.join(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.scss', '.ts', '.js'],
    fallback: {
      fs: false,
      path: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: 'ts-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|svg)$/i,
        type: 'asset/inline',
      },
      {
        test: /\.(woff2?|eot|[ot]tf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.wasm$/i,
        use: 'base64-loader',
        type: 'javascript/auto',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new WebpackFavicons({
      src: './src/icon.svg',
      path: '.',
      icons: {
        favicons: true,
      },
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      //hash: true,
      scriptLoading: 'blocking',
      template: './views/index.html',
      minify: {
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        decodeEntities: true,
        ignoreCustomFragments: [
          /\<i\ .*\<\/i\>/i,
          /\<progress\ .*\<\/progress\>/i,
        ],
        noNewlinesBeforeTagClose: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeEmptyElements: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
      },
    }),
  ],
};
