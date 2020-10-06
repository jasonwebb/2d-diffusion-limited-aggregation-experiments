const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    basicDLA: path.resolve('experiments/01-basic-dla/js/entry.js'),
    directionalBias: path.resolve('experiments/02-directional-bias/js/entry.js'),
    differentSizes: path.resolve('experiments/03-different-sizes/js/entry.js'),
    differentShapes: path.resolve('experiments/04-different-shapes/js/entry.js'),
    svgInput: path.resolve('experiments/05-svg-input/js/entry.js'),
    interactivity: path.resolve('experiments/06-interactivity/js/entry.js'),
    flowfields: path.resolve('experiments/07-flowfields/js/entry.js')
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    host: '127.0.0.1',
    port: 9001,
    publicPath: '/dist/',
    contentBase: path.resolve('./'),
    compress: true,
    open: true,
    watchContentBase: true
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve('dist')
  }
}