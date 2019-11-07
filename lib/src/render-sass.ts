import * as sass from 'sass'

export function renderSass(
  sassFilePathOrOptions: string | sass.Options,
) {
  const sassOptions = typeof sassFilePathOrOptions === 'string' ? { file: sassFilePathOrOptions } : sassFilePathOrOptions
  const rendered = sass.renderSync(sassOptions)

  const renderedCss: string = rendered.css.toString()
  return renderedCss
}