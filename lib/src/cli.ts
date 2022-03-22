import * as path from 'path'
import { defaultOptions } from './default-options'
import { BulmaCssVarsOptions, ColorCallSet } from './types'
import { getUsedVariables } from './find-used-vars'
import { ColorGenerator } from './color-updater'
import { strValFromColorDef, stringToHsl } from './bulma-color-tools'
import {
  getAbsoluteFileName,
  exists,
  fileStartsWith,
  writeFile,
} from './fs-helper'
import { getCssFallbacks } from './css-post-processor'
import { compileSass } from './compile-sass'

const configFileName = 'bulma-css-vars.config.js'
const mainSassFileName = 'src/main.scss'

const configFilePathAtCwd = (cwd: string) => path.join(cwd, configFileName)
const mainSassFilePathAtCwd = (cwd: string) => path.join(cwd, mainSassFileName)

async function validateOptions(cwd: string) {
  const configFilePath = configFilePathAtCwd(cwd)

  let loadedOptions = {}
  try {
    loadedOptions = require(configFilePath)
  } catch (err) {
    throw new Error(
      `Required config file '${configFileName}' was not found at ${configFilePath}`
    )
  }
  const options: BulmaCssVarsOptions = {
    ...defaultOptions,
    ...loadedOptions,
  }

  if (options.sassEntryFile === null) {
    throw new Error(
      '[Bulma CSS Vars] cannot create definitions, entry sass file does not exist in config'
    )
  }

  if (options.transition && typeof options.transition !== 'string') {
    throw new Error(
      `[Bulma CSS Vars] if 'transition' is declared, it must be a string`
    )
  }

  // js output file
  const jsOutputFile = getAbsoluteFileName(options.jsOutputFile, cwd)
  // sass output file
  const sassOutputFile = getAbsoluteFileName(options.sassOutputFile, cwd)
  // sass output file
  const fallbackOutputFile = options.cssFallbackOutputFile
    ? getAbsoluteFileName(options.cssFallbackOutputFile, cwd)
    : null
  // web with globals
  const globalWebVar = options.globalWebVar
  // entry sass file
  const sassEntryFile = getAbsoluteFileName(options.sassEntryFile, cwd)

  if (jsOutputFile.endsWith('.ts') && globalWebVar) {
    throw new Error(
      'TypeScript output with direct web usage is not possible - file has to be processed anyway!'
    )
  }
  if (!(await exists(sassEntryFile))) {
    throw new Error(
      `[Bulma CSS Vars] cannot create definitions, entry sass file does not exist in file system at ${sassEntryFile}`
    )
  }

  return {
    options,
    jsOutputFile,
    sassOutputFile,
    fallbackOutputFile,
    globalWebVar,
    sassEntryFile,
  }
}

export async function runCli(cwd: string) {
  const {
    options,
    fallbackOutputFile,
    globalWebVar,
    jsOutputFile,
    sassEntryFile,
    sassOutputFile,
  } = await validateOptions(cwd)

  // colorDefs
  const colorDefs = options.colorDefs
  const colorCallSetFromColorDef: ColorCallSet = Object.assign(
    {} as ColorCallSet,
    ...Object.entries(colorDefs).map(([colorName, _colorCallDef]) => {
      return {
        [colorName]: {
          calls: [],
        },
      }
    })
  )

  const provisionalUpdater = new ColorGenerator(colorCallSetFromColorDef)
  const sassVarsContentBase = provisionalUpdater.createWritableSassFileOnlySassBaseVariables()

  // create empty sass vars output file if it does not exist yet
  if (
    !(await exists(sassOutputFile)) ||
    !(await fileStartsWith(sassOutputFile, sassVarsContentBase))
  ) {
    await writeFile(sassOutputFile, sassVarsContentBase)
  }

  // render sass
  const renderedCss = compileSass(sassEntryFile)

  // run find-used-vars to get used vars
  const colorNames = Object.keys(colorDefs)
  const usedVars = getUsedVariables(renderedCss, colorNames)
  const usedVarsWithColors = Object.assign(
    {} as ColorCallSet,
    ...Object.entries(usedVars).map(([colorName, colorDef]) => {
      const value = stringToHsl(
        strValFromColorDef(colorDefs[colorName], colorName)
      )
      return { [colorName]: { ...colorDef, value } }
    })
  )
  // run generate-vars to have sass information
  const generator = new ColorGenerator(usedVarsWithColors)
  const sassVarsContent = generator.createWritableSassFile()

  if (fallbackOutputFile) {
    const allColorVars = generator.getAllVars()
    // fill in fallback values
    const cssFallbackContent = getCssFallbacks(renderedCss, allColorVars, options.transition)
    if (cssFallbackContent) {
      await writeFile(fallbackOutputFile, cssFallbackContent)
      console.log(`Updated ${fallbackOutputFile}`)
    }
  }

  // write sass vars output file
  await writeFile(sassOutputFile, sassVarsContent)
  console.log(`Updated ${sassOutputFile}`)
  // write js output file
  let jsOutputContent: string
  if (jsOutputFile.endsWith('.ts')) {
    // write ts file
    jsOutputContent = `
export type ColorFn =
  | 'rgba'
  | 'adjusthue'
  | 'saturate'
  | 'desaturate'
  | 'lighten'
  | 'darken'
  | 'color-invert'
  | 'dark-color'
  | 'light-color'

export interface ColorFnCall {
  fn: ColorFn
  fnArg: string | null
  composeArg: ColorFnCall | null
}

export interface ColorCallSet {
  [color: string]: {
    calls: ColorFnCall[],
  }
}
export const bulmaCssVariablesDefs: ColorCallSet = ${JSON.stringify(
      usedVars,
      null,
      2
    )}
`
  } else if (globalWebVar) {
    // write js file
    jsOutputContent = `
Object.defineProperty(window, 'bulmaCssVarsDef',
  { enumerable: true, value: ${JSON.stringify(usedVars)} }
)
`
  } else {
    // write js file
    jsOutputContent = `
module.exports = ${JSON.stringify({ bulmaCssVariablesDefs: usedVars }, null, 2)}
`
  }
  const fullJsOutputFile =
    jsOutputFile.endsWith('.ts') || jsOutputFile.endsWith('.js')
      ? jsOutputFile
      : `${jsOutputFile}.js`
  await writeFile(fullJsOutputFile, jsOutputContent)
  console.log(`Updated ${jsOutputFile}`)
}

const defaultConfigContent = `const appColors = {
  primary: '#5229fa',
}

module.exports = {
  jsOutputFile: 'src/bulma-generated/bulma-colors.js',
  sassOutputFile: 'src/bulma-generated/generated-bulma-vars.sass',
  cssFallbackOutputFile: 'src/bulma-generated/generated-fallback.css',
  colorDefs: appColors,
  sassEntryFile: 'src/main.scss',
  transition: '0.5s ease'
}

`

const defaultMainScssContent = `@import './bulma-generated/generated-fallback.css';
@import './bulma-generated/generated-bulma-vars.sass';
@import '../node_modules/bulma-css-vars/bulma-cv-lib';

`

export async function runCliInit(cwd: string) {
  const configFileNamePath = configFilePathAtCwd(cwd)
  if (await exists(configFileNamePath)) {
    console.log(
      `bulma-css-vars Config file already exists at ${configFileNamePath}, exiting.`
    )
    process.exit(1)
  }
  await writeFile(configFileNamePath, defaultConfigContent)

  const mainSassFilePath = mainSassFilePathAtCwd(cwd)

  if (!(await exists(mainSassFilePath))) {
    await writeFile(mainSassFilePath, defaultMainScssContent)
  }
}
