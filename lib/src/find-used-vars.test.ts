import { getUsedVariables } from './find-used-vars'
import { Options } from 'sass'

describe('find used vars', () => {
  test('gets used variables', () => {
    const sassOptions: Options = {
      data: `
        $black: var(--black);
        $also-black: var(--black);
        $unusedVar: var(--unused);
        $notCssVar: green;
        $notAColor: var(--whatever);
        $black-inverted: var(--black--dark-color);

        html {
          color: $black;
          background-color: $notCssVar;
          border: 1px solid $black-inverted;
          background-image: $notAColor;
        }
      `,
    }
    const usedVars = getUsedVariables(sassOptions, ['black'])
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
    const sassOptions: Options = {
      data: `
        $black-illegal: var(--black--non-existent-fn);

        html {
          border: 1px solid $black-illegal;
        }
      `,
    }
    expect(() => getUsedVariables(sassOptions, ['black'])).toThrow(
      `Bulma Color Tools does not support function 'non-existent-fn'`
    )
  })

  test('does not return colors if no color names are given', () => {
    const sassOptions: Options = {
      data: `
        $black-illegal: var(--black--non-existent-fn);

        html {
          border: 1px solid $black-illegal;
        }
      `,
    }
    const usedVars = getUsedVariables(sassOptions, [])
    expect(usedVars).toMatchInlineSnapshot(`Object {}`)
  })

  test('does not return variables unused in sass', () => {
    const sassOptions: Options = {
      data: `
        $black: var(--black);

        html {
          color: $black;
        }
      `,
    }
    const usedVars = getUsedVariables(sassOptions, ['green'])
    expect(usedVars).toMatchInlineSnapshot(`Object {}`)
  })
})
