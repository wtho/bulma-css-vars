import { BulmaCssVarsOptions } from './types'


export const defaultOptions: BulmaCssVarsOptions = {
  jsOutputFile: './generated-bulma-css-vars.js',
  sassOutputFile: './generated-bulma-css-vars.sass',
  cssFallbackOutputFile: './generated-bulma-fallback.css',
  sassEntryFile: null,
  colorDefs: {},
  globalWebVar: false,
  transition: null,
}
