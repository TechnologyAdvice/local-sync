const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: `${__dirname}/src/LocalSync.js`,
  output: {
    libraryTarget: 'umd',
    library: 'LocalSync',
    path: 'dist/umd',
    filename: 'local-sync.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', include: [`${__dirname}/src`] },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `${__dirname}/docs/src/index.html`,
      hash: false,
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true,
      },
    }),
  ],
}
