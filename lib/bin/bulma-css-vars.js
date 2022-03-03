#!/usr/bin/env node
import { runCli, runCliInit } from '../dist/cli.js'

const cwd = process.cwd()

const init = process.argv.indexOf('--init') !== -1

if (init) {
  runCliInit(cwd).then(() => runCli(cwd))
} else {
  runCli(cwd)
}
