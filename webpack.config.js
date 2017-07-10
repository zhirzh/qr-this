const path = require('path');

const webpack = require('webpack');

const SRC_DIR = path.resolve(__dirname, 'src');

module.exports = {
  entry: path.resolve(SRC_DIR, 'index.js'),

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: SRC_DIR,
        query: {
          presets: [
            'env',
          ],
        },
      },
    ],
  },
};
