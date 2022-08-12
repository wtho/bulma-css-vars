import * as sass from 'sass'

export function compileSass(sassFilePath: string) {
  const compileResult = sass.compile(sassFilePath, {
    loadPath: ['./node_modules'],
  })
  return compileResult.css
}
