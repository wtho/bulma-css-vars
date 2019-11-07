import {
  bulmaColorTools,
  getNameValFromColorDef,
  stringToHsl,
  strValFromColorDef,
} from './bulma-color-tools'
import { ColorFn, ColorFnCall, ColorCallSet, NameValueColor } from './types'

export class ColorUpdater {
  constructor(protected colorVals: ColorCallSet) {}

  protected getBaseVarNames() {
    return Object.keys(this.colorVals)
  }
  protected getBaseVars() {
    return Object.entries(this.colorVals).map(([name, { value: hsl }]) =>
      getNameValFromColorDef(name, hsl)
    )
  }
  protected getDerivedVars() {
    return Object.entries(this.colorVals)
      .filter(([_base, { calls }]) => calls.length)
      .map(([base, { calls }]) => {
        return calls.map(call => this.callToNameVal(base, call))
      })
  }
  getUpdatedVars(colorName: string, colorVal: string) {
    if (!(colorName in this.colorVals)) {
      console.warn(`Color '${colorName}' was not configured in bulma-css-vars!`)
      return []
    }
    const value = stringToHsl(colorVal)
    this.colorVals[colorName].value = value
    const calls =
      (this.colorVals[colorName] && this.colorVals[colorName].calls) || []
    return [
      getNameValFromColorDef(colorName, value),
      ...calls.map(call => this.callToNameVal(colorName, call)),
    ]
  }

  updateVarsInDocument(colorName: string, colorVal: string) {
    const updateds = this.getUpdatedVars(colorName, colorVal)
    updateds.forEach(({ name, value }) =>
      document.documentElement.style.setProperty(name, value)
    )
  }

  protected callToNameVal(base: string, call: ColorFnCall) {
    const name = `--${base}${this.createDerivedVarName(call)}`
    const value = this.createDerivedVariable(base, call)
    return { name, value }
  }

  protected createDerivedVariable(baseColorName: string, call: ColorFnCall) {
    if (!(baseColorName in this.colorVals)) {
      throw Error(
        `Color '${baseColorName}' is not defined! Cannot derive required colors!`
      )
    }
    function getEvaluatedColorFromFnCall(
      fnName: ColorFn,
      fnArg: string,
      colorArg: string,
      compose?: ColorFnCall
    ): string {
      const evaluated = bulmaColorTools[fnName](colorArg, fnArg)
      if (!compose) {
        return evaluated
      }
      return getEvaluatedColorFromFnCall(
        compose.fn,
        compose.fnArg,
        evaluated,
        compose.composeArg
      )
    }

    const colorVal = this.colorVals[baseColorName].value
    const baseColor = strValFromColorDef(colorVal, baseColorName)
    return getEvaluatedColorFromFnCall(
      call.fn,
      call.fnArg,
      baseColor,
      call.composeArg
    )
  }

  protected createDerivedVarName(call: ColorFnCall) {
    function evaluateCallName(
      fnName: ColorFn,
      fnArg: string,
      compose?: ColorFnCall
    ): string {
      const partCompose = compose
        ? evaluateCallName(compose.fn, compose.fnArg, compose.composeArg)
        : ''
      const partFnArg = fnArg ? `--${fnArg}` : ''
      return `${partFnArg}--${fnName}${partCompose}`
    }
    return evaluateCallName(call.fn, call.fnArg, call.composeArg)
  }

}

export class ColorGenerator extends ColorUpdater {
  getAllVars() {
    return [
      ...this.getBaseVars(),
      ...([] as NameValueColor[]).concat(...this.getDerivedVars())
    ]
  }

  createWritableSassFileOnlySassBaseVariables(): string {
    return `${this.getBaseVarNames()
      .map(name => `$${name}: var(--${name})`)
      .join('\n')}
`
  }

  createWritableSassFile(): string {
    const baseSassVariableStyles = this.createWritableSassFileOnlySassBaseVariables()

    const baseCssVariableStyles = `#{":root"}
${this.getBaseVars()
  .map(({ name, value }) => `  ${name}: ${value}`)
  .join('\n')}
`

    const derivedCssVarStyles = `#{":root"}
${this.getDerivedVars()
  .map(vars => vars.map(({ name, value }) => `  ${name}: ${value}`).join('\n'))
  .join('\n\n')}
`

    const fullFile = `
// sass variables
${baseSassVariableStyles}

// declared base css variables
${baseCssVariableStyles}

// derived, generated css variables
${derivedCssVarStyles}
`

    return fullFile
  }
}
