"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCliInit = exports.runCli = void 0;
const path = require("path");
const default_options_1 = require("./default-options");
const find_used_vars_1 = require("./find-used-vars");
const color_updater_1 = require("./color-updater");
const bulma_color_tools_1 = require("./bulma-color-tools");
const fs_helper_1 = require("./fs-helper");
const compile_sass_1 = require("./compile-sass");
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
        const options = Object.assign(Object.assign({}, default_options_1.defaultOptions), loadedOptions);
        if (options.sassEntryFile === null) {
            throw new Error('[Bulma CSS Vars] cannot create definitions, entry sass file does not exist in config');
        }
        // sass output file
        const sassOutputFile = (0, fs_helper_1.getAbsoluteFileName)(options.sassOutputFile, cwd);
        // entry sass file
        const sassEntryFile = (0, fs_helper_1.getAbsoluteFileName)(options.sassEntryFile, cwd);
        if (!(yield (0, fs_helper_1.exists)(sassEntryFile))) {
            throw new Error(`[Bulma CSS Vars] cannot create definitions, entry sass file does not exist in file system at ${sassEntryFile}`);
        }
        return {
            options,
            sassOutputFile,
            sassEntryFile,
        };
    });
}
function runCli(cwd) {
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
        const provisionalUpdater = new color_updater_1.ColorGenerator(colorCallSetFromColorDef);
        const sassVarsContentBase = provisionalUpdater.createWritableSassFileOnlySassBaseVariables();
        // create empty sass vars output file if it does not exist yet
        if (!(yield (0, fs_helper_1.exists)(sassOutputFile)) ||
            !(yield (0, fs_helper_1.fileStartsWith)(sassOutputFile, sassVarsContentBase))) {
            yield (0, fs_helper_1.writeFile)(sassOutputFile, sassVarsContentBase);
        }
        // render sass
        const renderedCss = (0, compile_sass_1.compileSass)(sassEntryFile);
        // run find-used-vars to get used vars
        const colorNames = Object.keys(colorDefs);
        const usedVars = (0, find_used_vars_1.getUsedVariables)(renderedCss, colorNames);
        const usedVarsWithColors = Object.assign({}, ...Object.entries(usedVars).map(([colorName, colorDef]) => {
            const value = (0, bulma_color_tools_1.stringToHsl)((0, bulma_color_tools_1.strValFromColorDef)(colorDefs[colorName], colorName));
            return { [colorName]: Object.assign(Object.assign({}, colorDef), { value }) };
        }));
        // run generate-vars to have sass information
        const generator = new color_updater_1.ColorGenerator(usedVarsWithColors);
        const sassVarsContent = generator.createWritableSassFile();
        // write sass vars output file
        yield (0, fs_helper_1.writeFile)(sassOutputFile, sassVarsContent);
        console.log(`Updated ${sassOutputFile}`);
    });
}
exports.runCli = runCli;
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
function runCliInit(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        const configFileNamePath = configFilePathAtCwd(cwd);
        if (yield (0, fs_helper_1.exists)(configFileNamePath)) {
            console.log(`bulma-css-vars Config file already exists at ${configFileNamePath}, exiting.`);
            process.exit(1);
        }
        yield (0, fs_helper_1.writeFile)(configFileNamePath, defaultConfigContent);
        const mainSassFilePath = mainSassFilePathAtCwd(cwd);
        if (!(yield (0, fs_helper_1.exists)(mainSassFilePath))) {
            yield (0, fs_helper_1.writeFile)(mainSassFilePath, defaultMainScssContent);
        }
    });
}
exports.runCliInit = runCliInit;
