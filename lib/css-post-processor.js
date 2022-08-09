"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCssVarDeclaration = exports.traverseRule = exports.findCssVarRules = exports.getCssFallbacks = void 0;
const css_1 = require("css");
function getCssFallbacks(css, 
// cssFileName: string,
usedVars, transitionDurationTimingFunctionDelay) {
    const styleSheet = (0, css_1.parse)(css);
    if (styleSheet.type !== 'stylesheet' ||
        styleSheet.stylesheet.parsingErrors.length) {
        console.error('Error in compiled CSS');
        if (styleSheet.stylesheet.parsingErrors.length) {
            console.error(styleSheet.stylesheet.parsingErrors
                .map((pErr) => `${pErr.message} | ${pErr.reason} (${pErr.line}:${pErr.column})`)
                .join('\n\n'));
        }
        return '';
    }
    const cssVarRules = findCssVarRules(styleSheet.stylesheet.rules, usedVars, transitionDurationTimingFunctionDelay);
    styleSheet.stylesheet.rules = cssVarRules;
    const writableCss = (0, css_1.stringify)(styleSheet);
    return writableCss;
}
exports.getCssFallbacks = getCssFallbacks;
function findCssVarRules(rules, usedVars, transitionDurationTimingFunctionDelay) {
    const cssVarRules = rules
        .map((r) => traverseRule(r, usedVars, transitionDurationTimingFunctionDelay))
        .filter((r) => !!r);
    return cssVarRules;
}
exports.findCssVarRules = findCssVarRules;
const transtitionProperties = ['color', 'background-color', 'border-color'];
function transitions(transitionDurationTimingFunctionDelay) {
    return {
        type: 'declaration',
        property: 'transition',
        value: transtitionProperties
            .map((prop) => `${prop} ${transitionDurationTimingFunctionDelay}`)
            .join(', '),
    };
}
function traverseRule(el, usedVars, transitionDurationTimingFunctionDelay) {
    switch (el.type) {
        case 'rule':
            const r = el;
            const decs = r.declarations
                .map((dec) => findCssVarDeclaration(dec, usedVars))
                .filter((d) => !!d);
            if (decs.length) {
                if (transitionDurationTimingFunctionDelay &&
                    transtitionProperties.some((prop) => decs.map(({ property }) => property && property === prop))) {
                    r.declarations = [
                        ...decs,
                        transitions(transitionDurationTimingFunctionDelay),
                    ];
                }
                else {
                    r.declarations = decs;
                }
                return r;
            }
            break;
        default:
            if ('rules' in el) {
                // document, host, media adn supports have the rules inside
                const docHostMediaSupports = el;
                const insideRules = docHostMediaSupports.rules
                    .map((r) => traverseRule(r, usedVars, transitionDurationTimingFunctionDelay))
                    .filter((r) => !!r);
                if (insideRules.length) {
                    docHostMediaSupports.rules = insideRules;
                    return docHostMediaSupports;
                }
                return null;
            }
    }
    return null;
}
exports.traverseRule = traverseRule;
function findCssVarDeclaration(dec, usedVars) {
    if (dec.type === 'comment')
        return null;
    const val = dec.value.trim();
    if (val.startsWith('var(--') && val.endsWith(')')) {
        const varName = val.substring(4, val.length - 1);
        const givenVar = usedVars.find((v) => v.name === varName);
        if (givenVar) {
            dec.value = givenVar.value;
            return dec;
        }
    }
    return null;
}
exports.findCssVarDeclaration = findCssVarDeclaration;
