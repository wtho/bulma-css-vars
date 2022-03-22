import * as sass from 'sass'

export function compileSass(
  sassFilePath: string,
) {
  const compileResult = sass.compile(sassFilePath)
  return compileResult.css
}