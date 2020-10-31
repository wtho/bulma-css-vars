const webpack = require('webpack')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const webpackBaseConfig = require('./webpack.base')

module.exports = merge(webpackBaseConfig, {
  mode: 'development',
  entry: ['./src/dev-client.js'],
  module: {
    rules: [{
        test: /\.s(a|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass')
            }
          }
        ]
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: true
    }),
    // new FriendlyErrorsPlugin()
  ]
})
