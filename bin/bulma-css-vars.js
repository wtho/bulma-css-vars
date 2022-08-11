#!/usr/bin/env node
const { runCli, runCliInit } = require('../lib/cli.js')

const cwd = process.cwd()

const init = process.argv.indexOf('--init') !== -1
const darkMode = process.argv.indexOf('--darkmode') !== -1

if (init) {
  runCliInit(cwd).then(() => runCli(cwd, darkMode))
} else {
  runCli(cwd, darkMode)
}
