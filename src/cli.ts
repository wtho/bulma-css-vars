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

  // sass output file
  const sassOutputFile = getAbsoluteFileName(options.sassOutputFile, cwd)

  // entry sass file
  const sassEntryFile = getAbsoluteFileName(options.sassEntryFile, cwd)

  if (!(await exists(sassEntryFile))) {
    throw new Error(
      `[Bulma CSS Vars] cannot create definitions, entry sass file does not exist in file system at ${sassEntryFile}`
    )
  }

  return {
    options,
    sassOutputFile,
    sassEntryFile,
  }
}

export async function runCli(cwd: string) {
  const { options, sassEntryFile, sassOutputFile } = await validateOptions(cwd)

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
  const sassVarsContentBase =
    provisionalUpdater.createWritableSassFileOnlySassBaseVariables()

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

  // write sass vars output file
  await writeFile(sassOutputFile, sassVarsContent)
  console.log(`Updated ${sassOutputFile}`)
}

const defaultConfigContent = `const appColors = {
  primary: '#5229fa',
}

module.exports = {
  sassOutputFile: 'src/bulma-generated/generated-bulma-vars.sass',
  colorDefs: appColors,
  sassEntryFile: 'src/main.scss',
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
