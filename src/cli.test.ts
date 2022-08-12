import { runCli } from './cli'

describe('cli', () => {
  test('does throw if config file does not exist', async () => {
    expect.assertions(1)
    try {
      await runCli(process.cwd())
    } catch (err) {
      expect(err.message).toContain(
        `Required config file 'bulma-css-vars.config.js' was not found at `
      )
    }
  })
})
