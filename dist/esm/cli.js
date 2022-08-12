var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as path from 'path';
import { defaultOptions } from './default-options';
import { getUsedVariables } from './find-used-vars';
import { ColorGenerator } from './color-updater';
import { strValFromColorDef, stringToHsl } from './bulma-color-tools';
import { getAbsoluteFileName, exists, fileStartsWith, writeFile, } from './fs-helper';
import { compileSass } from './compile-sass';
const configFileName = 'bulma-css-vars.config.js';
const mainSassFileName = 'src/scss/app.scss';
const configFilePathAtCwd = (cwd) => path.join(cwd, configFileName);
const mainSassFilePathAtCwd = (cwd) => path.join(cwd, mainSassFileName);
function validateOptions(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        const configFilePath = configFilePathAtCwd(cwd);
        let loadedOptions = {};
        try {
            loadedOptions = require(configFilePath);
        }
        catch (err) {
            throw new Error(`Required config file '${configFileName}' was not found at ${configFilePath}`);
        }
        const options = Object.assign(Object.assign({}, defaultOptions), loadedOptions);
        if (options.sassEntryFile === null) {
            throw new Error('[Bulma CSS Vars] cannot create definitions, entry sass file does not exist in config');
        }
        // sass output file
        const sassOutputFile = getAbsoluteFileName(options.sassOutputFile, cwd);
        // entry sass file
        const sassEntryFile = getAbsoluteFileName(options.sassEntryFile, cwd);
        if (!(yield exists(sassEntryFile))) {
            throw new Error(`[Bulma CSS Vars] cannot create definitions, entry sass file does not exist in file system at ${sassEntryFile}`);
        }
        return {
            options,
            sassOutputFile,
            sassEntryFile,
        };
    });
}
export function runCli(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        const { options, sassEntryFile, sassOutputFile } = yield validateOptions(cwd);
        // colorDefs
        const colorDefs = options.colorDefs;
        const colorCallSetFromColorDef = Object.assign({}, ...Object.entries(colorDefs).map(([colorName, _colorCallDef]) => {
            return {
                [colorName]: {
                    calls: [],
                },
            };
        }));
        const provisionalUpdater = new ColorGenerator(colorCallSetFromColorDef);
        const sassVarsContentBase = provisionalUpdater.createWritableSassFileOnlySassBaseVariables();
        // create empty sass vars output file if it does not exist yet
        if (!(yield exists(sassOutputFile)) ||
            !(yield fileStartsWith(sassOutputFile, sassVarsContentBase))) {
            yield writeFile(sassOutputFile, sassVarsContentBase);
        }
        // render sass
        const renderedCss = compileSass(sassEntryFile);
        // run find-used-vars to get used vars
        const colorNames = Object.keys(colorDefs);
        const usedVars = getUsedVariables(renderedCss, colorNames);
        const usedVarsWithColors = Object.assign({}, ...Object.entries(usedVars).map(([colorName, colorDef]) => {
            const value = stringToHsl(strValFromColorDef(colorDefs[colorName], colorName));
            return { [colorName]: Object.assign(Object.assign({}, colorDef), { value }) };
        }));
        // run generate-vars to have sass information
        const generator = new ColorGenerator(usedVarsWithColors);
        const sassVarsContent = generator.createWritableSassFile();
        // write sass vars output file
        yield writeFile(sassOutputFile, sassVarsContent);
        console.log(`Updated ${sassOutputFile}`);
    });
}
const defaultConfigContent = `const appColors = {
  primary: '#5229fa',
}

module.exports = {
  sassEntryFile: 'src/scss/app.scss',
  sassOutputFile: 'src/scss/theme.sass',
  colorDefs: appColors,
}

`;
const defaultMainScssContent = `@import './scss/theme.sass';
@import 'bulma-css-vars/bulma-cv-lib';

`;
export function runCliInit(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        const configFileNamePath = configFilePathAtCwd(cwd);
        if (yield exists(configFileNamePath)) {
            console.log(`bulma-css-vars Config file already exists at ${configFileNamePath}, exiting.`);
            process.exit(1);
        }
        yield writeFile(configFileNamePath, defaultConfigContent);
        const mainSassFilePath = mainSassFilePathAtCwd(cwd);
        if (!(yield exists(mainSassFilePath))) {
            yield writeFile(mainSassFilePath, defaultMainScssContent);
        }
    });
}
