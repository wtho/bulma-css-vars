#!/usr/bin/env node
const { runCli, runCliInit } = require('../dist/cli.js')

const cwd = process.cwd()

const init = process.argv.indexOf('--init') !== -1

if (init) {
  runCliInit(cwd).then(() => runCli(cwd))
} else {
  runCli(cwd)
}
