export interface BulmaCssVarsOptions {
  jsOutputFile: string
  sassOutputFile: string
  cssFallbackOutputFile?: string
  sassEntryFile: string
  colorDefs: { [colorName: string]: ColorDef }
  globalWebVar?: boolean
  transition?: string
}

export interface Hsl {
  h: number
  s: number
  l: number
  a?: number
}
export interface Rgb {
  r: number
  g: number
  b: number
  a?: number
}
export type Hex = string

export type ColorDef = Hsl | Rgb | Hex

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
  fnArg: string
  composeArg?: ColorFnCall
}

export interface ColorCallSet {
  [color: string]: {
    calls: ColorFnCall[]
    value?: Hsl
  }
}

export interface NameValueColor {
  name: string
  value: string
}
