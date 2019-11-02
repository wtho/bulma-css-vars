#!/usr/bin/env node
const { runCli } = require('../dist/cli.js')

const cwd = process.cwd()

runCli(cwd)
