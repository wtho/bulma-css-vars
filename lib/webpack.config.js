const path = require('path')

const esm = {
  mode: 'production',
  entry: './src/web-bundle-entry.ts',
  output: {
    path: path.resolve(__dirname, 'dist/esm'),
    filename: 'bulma-css-vars.web-bundle.js',
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
  target: 'web',
  resolve: {
    extensions: ['.ts', '.js'],
  },
}
const cjs = {
  mode: 'production',
  entry: './src/web-bundle-entry.ts',
  output: {
    path: path.resolve(__dirname, 'dist/cjs'),
    filename: 'bulma-css-vars.web-bundle.js',
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
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js'],
  },
}

module.exports = [esm, cjs]
