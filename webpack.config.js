const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'examples', 'index.js'),
  output: {
    path: path.join(__dirname, 'examples'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']
          }
        }
      }
    ]
  }
};
