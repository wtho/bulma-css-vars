const path = require('path')

module.exports = {
  entry: [ './src/index.ts', './src/main.scss' ],
  output: {
    path: path.join(__dirname, '../docs'),
    filename: 'bundle.js'
  },
  target: 'web',
  resolve: {
    extensions: ['.ts', '.js']
  },
}
