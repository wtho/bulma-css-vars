const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/color-updater.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bulma-css-vars.web-bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
    ]
  },
  target: 'web',
  resolve: {
    extensions: ['.ts', '.js']
  },
}
