"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsedVariables = void 0;
const bulma_color_tools_1 = require("./bulma-color-tools");
function getUsedVariables(renderedCss, colorNames) {
    const colorVarNames = colorNames.map(cn => `--${cn}`);
    const colorDerivedVarNamePrefix = colorNames.map(cn => `--${cn}--`);
    const usedVars = renderedCss.match(/--[a-z0-9-]*/g);
    const usedVarsNoDups = [...new Set(usedVars)].sort();
    const usedVarsOnlyColors = usedVarsNoDups.filter(varName => colorVarNames.includes(varName) ||
        colorDerivedVarNamePrefix.some(pref => varName.startsWith(pref)));
    const usedVarsSplits = usedVarsOnlyColors.map(uv => uv.split('--').slice(1));
    const illegalSplit = usedVarsSplits.find(splits => splits[0].match(/[0-9]/));
    if (illegalSplit) {
        console.error(`Illegal split`, illegalSplit);
        throw new Error(`Illegal split`);
    }
    const requiredFunctions = [];
    const requiredColors = {};
    usedVarsSplits.forEach(colWithArgs => {
        const colorName = colWithArgs[0];
        if (!(colorName in requiredColors)) {
            requiredColors[colorName] = { calls: [] };
        }
        const colorConf = requiredColors[colorName];
        if (colWithArgs.length === 1) {
            // just the color
            return;
        }
        let args = colWithArgs.slice(1);
        function unravelColorFns(args) {
            const next = args.shift();
            let fn;
            let fnArg = null;
            if (next.match(/^[a-z-]+$/)) {
                fn = next;
            }
            else {
                fnArg = next;
                fn = args.shift();
            }
            if (!requiredFunctions.includes(fn)) {
                requiredFunctions.push(fn);
            }
            let composeArg = null;
            if (args.length > 0) {
                composeArg = unravelColorFns(args);
            }
            return { fn, fnArg, composeArg };
        }
        colorConf.calls.push(unravelColorFns(args));
    });
    requiredFunctions.forEach(fn => {
        if (!bulma_color_tools_1.bulmaColorTools[fn] || typeof bulma_color_tools_1.bulmaColorTools[fn] !== 'function') {
            throw new Error(`Bulma Color Tools does not support function '${fn}'`);
        }
    });
    return requiredColors;
}
exports.getUsedVariables = getUsedVariables;
