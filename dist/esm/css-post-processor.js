import { parse as parseCss, stringify, } from 'css';
export function getCssFallbacks(css, usedVars) {
    const styleSheet = parseCss(css);
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
    const cssVarRules = findCssVarRules(styleSheet.stylesheet.rules, usedVars);
    styleSheet.stylesheet.rules = cssVarRules;
    const writableCss = stringify(styleSheet);
    return writableCss;
}
export function findCssVarRules(rules, usedVars) {
    const cssVarRules = rules
        .map((r) => traverseRule(r, usedVars))
        .filter((r) => !!r);
    return cssVarRules;
}
export function traverseRule(el, usedVars) {
    switch (el.type) {
        case 'rule':
            const r = el;
            const decs = r.declarations
                .map((dec) => findCssVarDeclaration(dec, usedVars))
                .filter((d) => !!d);
            if (decs.length) {
                r.declarations = decs;
                return r;
            }
            break;
        default:
            if ('rules' in el) {
                // document, host, media adn supports have the rules inside
                const docHostMediaSupports = el;
                const insideRules = docHostMediaSupports.rules
                    .map((r) => traverseRule(r, usedVars))
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
export function findCssVarDeclaration(dec, usedVars) {
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
