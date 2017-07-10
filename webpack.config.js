const path = require('path');

const webpack = require('webpack');

const SRC_DIR = path.resolve(__dirname, 'src');

module.exports = {
  entry: [
    'babel-polyfill',
    path.resolve(SRC_DIR, 'popup.js'),
  ],

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'popup.js',
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: false,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: SRC_DIR,
        exclude: /node_modules/,
        query: {
          presets: [
            'env',
          ],
        },
      },
    ],
  },
};
