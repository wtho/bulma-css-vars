const publicPath = '/'
const staticFolder = 'assets'

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackConfig = require('./webpack.dev')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || 8080

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: publicPath,
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {},
})
// force page reload when html-webpack-plugin template changes
let lastHtml = ''
compiler.hooks.compilation.tap('CustomReloadDevServer', compilation => {
  HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
    'CustomReloadDevServer', // <-- Set a meaningful name here for stacktraces
    (data, cb) => {
      const newHtml = data.html
      if (lastHtml !== newHtml) {
        hotMiddleware.publish({ action: 'reload' })
      }
      lastHtml = newHtml
      if (typeof cb === 'function') cb(null, data)
    }
  )
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(publicPath, staticFolder)
app.use(staticPath, express.static('./assets'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  },
}
