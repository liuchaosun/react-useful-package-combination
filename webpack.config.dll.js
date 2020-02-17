
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
  mode: 'production',
  entry: {
    commonLibrary: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-redux',
      'redux-thunk',
      'redux-logger'
    ]
  },
  output: {
    filename: '[name].dll.js',
    path: path.join(__dirname, 'lib'),
    library: '[name]'
  },

  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      name: '[name]',
      path: path.join(__dirname, 'lib/[name].json')
    })
  ]
};
