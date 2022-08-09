"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorGenerator = exports.ColorUpdater = void 0;
const bulma_color_tools_1 = require("./bulma-color-tools");
class ColorUpdater {
    constructor(colorVals) {
        this.colorVals = colorVals;
    }
    getBaseVarNames() {
        return Object.keys(this.colorVals);
    }
    getBaseVars() {
        return Object.entries(this.colorVals).map(([name, { value: hsl }]) => (0, bulma_color_tools_1.getNameValFromColorDef)(name, hsl));
    }
    getDerivedVars() {
        return Object.entries(this.colorVals)
            .filter(([_base, { calls }]) => calls.length)
            .map(([base, { calls }]) => {
            return calls.map(call => this.callToNameVal(base, call));
        });
    }
    getUpdatedVars(colorName, colorVal) {
        if (!(colorName in this.colorVals)) {
            console.warn(`Color '${colorName}' was not configured in bulma-css-vars!`);
            return [];
        }
        const value = (0, bulma_color_tools_1.stringToHsl)(colorVal);
        this.colorVals[colorName].value = value;
        const calls = (this.colorVals[colorName] && this.colorVals[colorName].calls) || [];
        return [
            (0, bulma_color_tools_1.getNameValFromColorDef)(colorName, value),
            ...calls.map(call => this.callToNameVal(colorName, call)),
        ];
    }
    updateVarsInDocument(colorName, colorVal) {
        const updateds = this.getUpdatedVars(colorName, colorVal);
        updateds.forEach(({ name, value }) => document.documentElement.style.setProperty(name, value));
    }
    callToNameVal(base, call) {
        const name = `--${base}${this.createDerivedVarName(call)}`;
        const value = this.createDerivedVariable(base, call);
        return { name, value };
    }
    createDerivedVariable(baseColorName, call) {
        if (!(baseColorName in this.colorVals)) {
            throw Error(`Color '${baseColorName}' is not defined! Cannot derive required colors!`);
        }
        function getEvaluatedColorFromFnCall(fnName, fnArg, colorArg, compose) {
            const evaluated = bulma_color_tools_1.bulmaColorTools[fnName](colorArg, fnArg);
            if (!compose) {
                return evaluated;
            }
            return getEvaluatedColorFromFnCall(compose.fn, compose.fnArg, evaluated, compose.composeArg);
        }
        const colorVal = this.colorVals[baseColorName].value;
        const baseColor = (0, bulma_color_tools_1.strValFromColorDef)(colorVal, baseColorName);
        return getEvaluatedColorFromFnCall(call.fn, call.fnArg, baseColor, call.composeArg);
    }
    createDerivedVarName(call) {
        function evaluateCallName(fnName, fnArg, compose) {
            const partCompose = compose
                ? evaluateCallName(compose.fn, compose.fnArg, compose.composeArg)
                : '';
            const partFnArg = fnArg ? `--${fnArg}` : '';
            return `${partFnArg}--${fnName}${partCompose}`;
        }
        return evaluateCallName(call.fn, call.fnArg, call.composeArg);
    }
}
exports.ColorUpdater = ColorUpdater;
class ColorGenerator extends ColorUpdater {
    getAllVars() {
        return [
            ...this.getBaseVars(),
            ...[].concat(...this.getDerivedVars())
        ];
    }
    createWritableSassFileOnlySassBaseVariables() {
        return `${this.getBaseVarNames()
            .map(name => `$${name}: var(--${name})`)
            .join('\n')}
`;
    }
    createWritableSassFile() {
        const baseSassVariableStyles = this.createWritableSassFileOnlySassBaseVariables();
        const baseCssVariableStyles = `#{":root"}
${this.getBaseVars()
            .map(({ name, value }) => `  ${name}: ${value}`)
            .join('\n')}
`;
        const derivedCssVarStyles = `#{":root"}
${this.getDerivedVars()
            .map(vars => vars.map(({ name, value }) => `  ${name}: ${value}`).join('\n'))
            .join('\n\n')}
`;
        const fullFile = `
// sass variables
${baseSassVariableStyles}

// declared base css variables
${baseCssVariableStyles}

// derived, generated css variables
${derivedCssVarStyles}
`;
        return fullFile;
    }
}
exports.ColorGenerator = ColorGenerator;
