const config = {
  entry: `${__dirname}/src/LocalSync.js`,
  output: {
    libraryTarget: 'umd',
    library: 'LocalSync',
    path: 'dist',
    filename: `local-sync.js`,
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel', include: [`${__dirname}/src`]},
    ],
  },
}

export default config
