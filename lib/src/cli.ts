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

const configFileName = 'bulma-css-vars.config.js'

export async function runCli(cwd: string) {
  const configFileNamePath = path.join(cwd, configFileName)

  let loadedOptions = {}
  try {
    loadedOptions = require(configFileNamePath)
  } catch (err) {
    throw new Error(`Required config file '${configFileName}' was not found at ${configFileNamePath}`)
  }
  const options: BulmaCssVarsOptions = {
    ...defaultOptions,
    ...loadedOptions,
  }

  if (options.sassEntryFile === null) {
    throw new Error('[Bulma CSS Vars] cannot create definitions, entry sass file does not exist in config')
  }

  // outputFile
  const jsOutputFile = getAbsoluteFileName(options.jsOutputFile, cwd)
  const sassOutputFile = getAbsoluteFileName(options.sassOutputFile, cwd)
  // entry sass file
  const sassEntryFile = getAbsoluteFileName(options.sassEntryFile, cwd)

  if (!(await exists(sassEntryFile))) {
    throw new Error(
      `[Bulma CSS Vars] cannot create definitions, entry sass file does not exist in file system at ${sassEntryFile}`
    )
  }

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

  // run find-used-vars to get used vars
  const colorNames = Object.keys(colorDefs)
  const usedVars = getUsedVariables(sassEntryFile, colorNames)
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
  const updater = new ColorGenerator(usedVarsWithColors)
  const sassVarsContent = updater.createWritableSassFile()
  // write sass vars output file
  await writeFile(sassOutputFile, sassVarsContent)
  // write js output file
  let jsOutputContent: string
  if (jsOutputFile.endsWith('ts')) {
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
  fnArg: string
  composeArg?: ColorFnCall
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
  } else {
    // write js file
    jsOutputContent = `
module.exports = ${JSON.stringify(usedVars, null, 2)}
`
  }
  const fullJsOutputFile =
    jsOutputFile.endsWith('.ts') || jsOutputFile.endsWith('.js')
      ? jsOutputFile
      : `${jsOutputFile}.js`
  await writeFile(fullJsOutputFile, jsOutputContent)
}
