import pkg from './package.json'

const config = {
  entry: `${__dirname}/src/LocalSync.js`,
  output: {
    libraryTarget: 'umd',
    library: 'LocalSync',
    path: 'dist',
    filename: `${pkg.name}.js`,
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel', include: [`${__dirname}/src`]},
    ],
  },
}

export default config
