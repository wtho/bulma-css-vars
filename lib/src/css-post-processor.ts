import { parse as parseCss, stringify, StyleRules, Rule, AtRule, Comment, Declaration, Document, Media, Host, Supports } from 'css'
import { NameValueColor } from 'types'

export function getCssFallbacks(
  css: string,
  // cssFileName: string,
  usedVars: NameValueColor[]
): string {
  const styleSheet = parseCss(css)
  if (styleSheet.type !== 'stylesheet' || styleSheet.stylesheet.parsingErrors.length) {
      console.error('Error in compiled CSS')
      if (styleSheet.stylesheet.parsingErrors.length) {
        console.error(styleSheet.stylesheet.parsingErrors.map(pErr => `${pErr.message} | ${pErr.reason} (${pErr.line}:${pErr.column})`).join('\n\n'))
      }
      return ''
  }
  const cssVarRules = findCssVarRules(styleSheet.stylesheet.rules, usedVars)
  styleSheet.stylesheet.rules = cssVarRules
  const writableCss = stringify(styleSheet)
  return writableCss
}

export function findCssVarRules(rules: StyleRules['rules'], usedVars: NameValueColor[]): StyleRules['rules'] {
  const cssVarRules = rules.map(r => traverseRule(r, usedVars)).filter(r => !!r)
  return cssVarRules
}

  export function traverseRule(el: Rule | Comment | AtRule, usedVars: NameValueColor[]): Rule {
    switch (el.type) {
      case 'rule':
        const r: Rule = el
        const decs = r.declarations.map(dec => findCssVarDeclaration(dec, usedVars)).filter(d => !!d)
        if (decs.length) {
          r.declarations = decs
          return r
        }
        break;
      default:
        if ('rules' in el) {
          // document, host, media adn supports have the rules inside
          const docHostMediaSupports: Document | Host | Media | Supports = el
          const insideRules = docHostMediaSupports.rules.map(r => traverseRule(r, usedVars)).filter(r => !!r)
          if (insideRules.length) {
            docHostMediaSupports.rules = insideRules
            return docHostMediaSupports
          }
          return null
        }
    }
    return null
  }

  export function findCssVarDeclaration(dec: Declaration, usedVars: NameValueColor[]) {
    const val = dec.value.trim()
    if (val.startsWith('var(--') && val.endsWith(')')) {
      const varName = val.substring(4, val.length - 1)
      const givenVar = usedVars.find(v => v.name === varName)
      if (givenVar) {
        dec.value = givenVar.value
        return dec
      }
    }
    return null
  }
