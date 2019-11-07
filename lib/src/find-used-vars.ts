
import { bulmaColorTools } from './bulma-color-tools'
import { ColorFn, ColorFnCall, ColorCallSet } from './types'

export function getUsedVariables(
  renderedCss: string,
  colorNames: string[]
): ColorCallSet {

  const colorVarNames = colorNames.map(cn => `--${cn}`)
  const colorDerivedVarNamePrefix = colorNames.map(cn => `--${cn}--`)

  const usedVars = renderedCss.match(/--[a-z0-9-]*/g)
  const usedVarsNoDups = [...new Set(usedVars)].sort()
  const usedVarsOnlyColors = usedVarsNoDups.filter(
    varName =>
      colorVarNames.includes(varName) ||
      colorDerivedVarNamePrefix.some(pref => varName.startsWith(pref))
  )
  const usedVarsSplits = usedVarsOnlyColors.map(uv => uv.split('--').slice(1))
  const illegalSplit = usedVarsSplits.find(splits => splits[0].match(/[0-9]/))
  if (illegalSplit) {
    console.error(`Illegal split`, illegalSplit)
    throw new Error(`Illegal split`)
  }

  const requiredFunctions: ColorFn[] = []
  const requiredColors: ColorCallSet = {}

  usedVarsSplits.forEach(colWithArgs => {
    const colorName = colWithArgs[0]
    if (!(colorName in requiredColors)) {
      requiredColors[colorName] = { calls: [] }
    }
    const colorConf = requiredColors[colorName]
    if (colWithArgs.length === 1) {
      // just the color
      return
    }
    let args = colWithArgs.slice(1)

    function unravelColorFns(args: string[]): ColorFnCall {
      const next = args.shift()
      let fn: ColorFn
      let fnArg = null
      if (next.match(/^[a-z-]+$/)) {
        fn = next as ColorFn
      } else {
        fnArg = next
        fn = args.shift() as ColorFn
      }
      if (!requiredFunctions.includes(fn)) {
        requiredFunctions.push(fn)
      }
      let composeArg = null
      if (args.length > 0) {
        composeArg = unravelColorFns(args)
      }
      return { fn, fnArg, composeArg }
    }

    colorConf.calls.push(unravelColorFns(args))
  })

  requiredFunctions.forEach(fn => {
    if (!bulmaColorTools[fn] || typeof bulmaColorTools[fn] !== 'function') {
      throw new Error(`Bulma Color Tools does not support function '${fn}'`)
    }
  })

  return requiredColors
}
