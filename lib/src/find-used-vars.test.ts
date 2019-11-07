import { getUsedVariables } from './find-used-vars'

describe('find used vars', () => {
  test('gets used variables', () => {
    const css = `
      html {
        color: var(--black);
        background-color: #ff2253;
        border: 1px solid var(--black--dark-color);
        background-image: var(--whatever);
      }
    `
    const usedVars = getUsedVariables(css, ['black'])
    expect(usedVars).toMatchInlineSnapshot(`
      Object {
        "black": Object {
          "calls": Array [
            Object {
              "composeArg": null,
              "fn": "dark-color",
              "fnArg": null,
            },
          ],
        },
      }
    `)
  })

  test('throws when using illegal variable names', () => {
    const css = `
      html {
        border: 1px solid var(--black--non-existent-fn);
      }
      `
    expect(() => getUsedVariables(css, ['black'])).toThrow(
      `Bulma Color Tools does not support function 'non-existent-fn'`
    )
  })

  test('does not return colors if no color names are given', () => {
    const css = `
      $black-illegal: var(--black--non-existent-fn);

      html {
        border: 1px solid $black-illegal;
      }
    `
    const usedVars = getUsedVariables(css, [])
    expect(usedVars).toMatchInlineSnapshot(`Object {}`)
  })

  test('does not return variables unused in sass', () => {
    const css = `
      html {
        color: var(--black);
      }
    `
    const usedVars = getUsedVariables(css, ['green'])
    expect(usedVars).toMatchInlineSnapshot(`Object {}`)
  })
})
