'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.runCliInit = exports.runCli = void 0
const path = require('path')
const default_options_1 = require('./default-options')
const find_used_vars_1 = require('./find-used-vars')
const color_updater_1 = require('./color-updater')
const bulma_color_tools_1 = require('./bulma-color-tools')
const fs_helper_1 = require('./fs-helper')
const css_post_processor_1 = require('./css-post-processor')
const compile_sass_1 = require('./compile-sass')
const configFileName = 'bulma-css-vars.config.js'
const mainSassFileName = 'src/main.scss'
const configFilePathAtCwd = (cwd) => path.join(cwd, configFileName)
const mainSassFilePathAtCwd = (cwd) => path.join(cwd, mainSassFileName)

function validateOptions(cwd) {
  return __awaiter(this, void 0, void 0, function* () {
    const configFilePath = configFilePathAtCwd(cwd)
    let loadedOptions = {}

    try {
      loadedOptions = require(configFilePath)
    } catch (err) {
      throw new Error(
        `Required config file '${configFileName}' was not found at ${configFilePath}`
      )
    }

    const options = Object.assign(
      Object.assign({}, default_options_1.defaultOptions),
      loadedOptions
    )
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
    var jsOutputFile = false
    if (loadedOptions.jsOutputFile) {
      jsOutputFile = (0, fs_helper_1.getAbsoluteFileName)(
        options.jsOutputFile,
        cwd
      )
    }

    // js output file
    var darkModeJsOutputFile = false
    if (loadedOptions.darkModeJsOutputFile) {
      darkModeJsOutputFile = (0, fs_helper_1.getAbsoluteFileName)(
        options.darkModeJsOutputFile,
        cwd
      )
    }

    // sass output file
    const sassOutputFile = (0, fs_helper_1.getAbsoluteFileName)(
      options.sassOutputFile,
      cwd
    )

    // sass output file
    const darkModeSassOutputFile = (0, fs_helper_1.getAbsoluteFileName)(
      options.darkModeSassOutputFile,
      cwd
    )

    // sass output file
    const fallbackOutputFile = options.cssFallbackOutputFile
      ? (0, fs_helper_1.getAbsoluteFileName)(options.cssFallbackOutputFile, cwd)
      : null

    // web with globals
    const globalWebVar = options.globalWebVar

    // entry sass file
    const sassEntryFile = (0, fs_helper_1.getAbsoluteFileName)(
      options.sassEntryFile,
      cwd
    )

    if (jsOutputFile) {
      if (jsOutputFile.endsWith('.ts') && globalWebVar) {
        throw new Error(
          'TypeScript output with direct web usage is not possible - file has to be processed anyway!'
        )
      }
    }

    if (!(yield (0, fs_helper_1.exists)(sassEntryFile))) {
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
      darkModeSassOutputFile,
      darkModeJsOutputFile,
    }
  })
}

function runCli(cwd, darkMode) {
  return __awaiter(this, void 0, void 0, function* () {
    const {
      options,
      fallbackOutputFile,
      globalWebVar,
      jsOutputFile,
      sassEntryFile,
      sassOutputFile,
      darkModeJsOutputFile,
      darkModeSassOutputFile,
    } = yield validateOptions(cwd)

    //colorDefs
    const colorDefs = options.colorDefs
    const colorCallSetFromColorDef = Object.assign(
      {},
      ...Object.entries(colorDefs).map(([colorName, _colorCallDef]) => {
        return {
          [colorName]: {
            calls: [],
          },
        }
      })
    )
    const provisionalUpdater = new color_updater_1.ColorGenerator(
      colorCallSetFromColorDef
    )
    const sassVarsContentBase =
      provisionalUpdater.createWritableSassFileOnlySassBaseVariables()

    //create empty sass vars output file if it does not exist yet
    if (
      !(yield (0, fs_helper_1.exists)(sassOutputFile)) ||
      !(yield (0, fs_helper_1.fileStartsWith)(
        sassOutputFile,
        sassVarsContentBase
      ))
    ) {
      yield (0, fs_helper_1.writeFile)(sassOutputFile, sassVarsContentBase)
    }

    if (darkMode) {
      // create empty sass vars output file if it does not exist yet
      if (!(yield (0, fs_helper_1.exists)(darkModeSassOutputFile))) {
        yield (0, fs_helper_1.writeFile)(darkModeSassOutputFile, '')
      }
    }

    //render sass
    const renderedCss = (0, compile_sass_1.compileSass)(sassEntryFile)

    //run find-used-vars to get used vars
    const colorNames = Object.keys(colorDefs)
    const usedVars = (0, find_used_vars_1.getUsedVariables)(
      renderedCss,
      colorNames
    )
    const usedVarsWithColors = Object.assign(
      {},
      ...Object.entries(usedVars).map(([colorName, colorDef]) => {
        const value = (0, bulma_color_tools_1.stringToHsl)(
          (0, bulma_color_tools_1.strValFromColorDef)(
            colorDefs[colorName],
            colorName
          )
        )
        return {
          [colorName]: Object.assign(Object.assign({}, colorDef), { value }),
        }
      })
    )

    //run generate-vars to have sass information
    const generator = new color_updater_1.ColorGenerator(usedVarsWithColors)
    const sassVarsContent = generator.createWritableSassFile()

    //write sass vars output file
    yield (0, fs_helper_1.writeFile)(sassOutputFile, sassVarsContent)
    console.log(`Updated ${sassOutputFile}`)

    /**
     *
     * DARK MODE IMPLEMENTATION START
     *
     */

    if (darkMode) {
      const darkModecolorDefs = options.darkModeColorDefs

      //run find-used-vars to get used vars
      const darkModeColorNames = Object.keys(darkModecolorDefs)
      const darkModeUsedVars = (0, find_used_vars_1.getUsedVariables)(
        renderedCss,
        darkModeColorNames
      )
      const darkModeUsedVarsWithColors = Object.assign(
        {},
        ...Object.entries(darkModeUsedVars).map(([colorName, colorDef]) => {
          const value = (0, bulma_color_tools_1.stringToHsl)(
            (0, bulma_color_tools_1.strValFromColorDef)(
              darkModecolorDefs[colorName],
              colorName
            )
          )
          return {
            [colorName]: Object.assign(Object.assign({}, colorDef), { value }),
          }
        })
      )

      //run generate-vars to have sass information
      const darkModeGenerator = new color_updater_1.ColorGenerator(
        darkModeUsedVarsWithColors
      )
      const darkModeSassVarsContent =
        darkModeGenerator.createWritableDarkModeSassFile()

      //write sass vars output file
      yield (0, fs_helper_1.writeFile)(
        darkModeSassOutputFile,
        darkModeSassVarsContent
      )
      console.log(`Updated ${darkModeSassOutputFile}`)

      //write js output file
      if (darkModeJsOutputFile) {
        let darkModeJsOutputContent = `
    module.exports = ${JSON.stringify(
      { bulmaCssVariablesDefs: darkModeUsedVars },
      null,
      2
    )}
    `
        const darkModeFullJsOutputFile = darkModeJsOutputFile.endsWith('.js')
          ? darkModeJsOutputFile
          : `${darkModeJsOutputFile}.js`
        yield (0, fs_helper_1.writeFile)(
          darkModeFullJsOutputFile,
          darkModeJsOutputContent
        )
        console.log(`Updated ${darkModeJsOutputFile}`)
      }
    }

    /**
     *
     * DARK MODE IMPLEMENTATION END
     *
     */

    if (fallbackOutputFile) {
      const allColorVars = generator.getAllVars()

      // fill in fallback values
      const cssFallbackContent = (0, css_post_processor_1.getCssFallbacks)(
        renderedCss,
        allColorVars,
        options.transition
      )
      if (cssFallbackContent) {
        yield (0, fs_helper_1.writeFile)(fallbackOutputFile, cssFallbackContent)
        console.log(`Updated ${fallbackOutputFile}`)
      }
    }

    // write js output file
    if (jsOutputFile) {
      let jsOutputContent
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
      yield (0, fs_helper_1.writeFile)(fullJsOutputFile, jsOutputContent)
      console.log(`Updated ${jsOutputFile}`)
    }
  })
}
exports.runCli = runCli

const defaultConfigContent = `const appColors = {
  primary: '#5229fa',
}

const darkmodeAppColors = {
    primary: '#5259fa',
}

module.exports = {
  jsOutputFile: 'src/bulma-generated/bulma-colors.js',
  sassOutputFile: 'src/bulma-generated/generated-bulma-vars.sass',
  cssFallbackOutputFile: 'src/bulma-generated/generated-fallback.css',
  colorDefs: appColors,
  sassEntryFile: 'src/main.scss',
  transition: '0.5s ease'

  //dark mode
  darkModeSassOutputFile: 'src/bulma-generated/generated-bulma-vars-dark-mode.sass',
  darkModeJsOutputFile: 'src/bulma-generated/bulma-colors-dark-mode.js',
  darkModeColorDefs: darkmodeAppColors,

}

`
const defaultMainScssContent = `@import './bulma-generated/generated-fallback.css';
@import './bulma-generated/generated-bulma-vars.sass';
@import './bulma-generated/generated-bulma-vars-dark-mode.sass';
@import '../node_modules/bulma-css-vars/bulma-cv-lib';

`
function runCliInit(cwd) {
  return __awaiter(this, void 0, void 0, function* () {
    const configFileNamePath = configFilePathAtCwd(cwd)
    if (yield (0, fs_helper_1.exists)(configFileNamePath)) {
      console.log(
        `bulma-css-vars Config file already exists at ${configFileNamePath}, exiting.`
      )
      process.exit(1)
    }
    yield (0, fs_helper_1.writeFile)(configFileNamePath, defaultConfigContent)
    const mainSassFilePath = mainSassFilePathAtCwd(cwd)
    if (!(yield (0, fs_helper_1.exists)(mainSassFilePath))) {
      yield (0, fs_helper_1.writeFile)(mainSassFilePath, defaultMainScssContent)
    }
  })
}
exports.runCliInit = runCliInit
