import {
  bulmaColorTools,
  getNameValFromColorDef,
  strValFromColorDef,
} from './bulma-color-tools'
import { renderSync } from 'sass'

function hexToRgb(hex: string) {
  if (hex === 'black') return 'rgb(0, 0, 0)'
  if (hex === 'white') return 'rgb(255, 255, 255)'
  if (hex.startsWith('rgba(')) return hex
  if (hex.match(/^#[0-9a-f]{8}$/i)) {
    const [
      _str,
      r,
      g,
      b,
      a,
    ] = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex)
    return `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(
      b,
      16
    )}, ${parseInt(a, 16) / 255})`
  }
  if (hex.match(/^#[0-9a-f]{3}$/i)) {
    const [_str, r, g, b] = /^#([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1})$/i.exec(
      hex
    )
    return `rgb(${parseInt(`${r}${r}`, 16)}, ${parseInt(
      `${g}${g}`,
      16
    )}, ${parseInt(`${b}${b}`, 16)})`
  }
  const [_str, r, g, b] = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(
    hex
  )
  return `rgb(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)})`
}

const renderSassColor = (colorCode: string, setupFn: string = '') => {
  const renderedCss = renderSync({
    data: `
@use 'sass:color'

${setupFn}

html
  color: ${colorCode}
`,
    indentedSyntax: true,
  }).css.toString()
  const colorPartHex = renderedCss
    .split(
      `html {
  color: `
    )[1]
    .split(';')[0]
  return hexToRgb(colorPartHex)
}

describe('bulma color tools', () => {
  const turquoise = 'rgb(64, 224, 208)'
  describe('adjusts hue', () => {
    test('black stays black', () => {
      const adjusted = bulmaColorTools.adjusthue('black', '30deg')
      expect(adjusted).toEqual('rgb(0, 0, 0)')
    })

    test('white stays white', () => {
      const adjusted = bulmaColorTools.adjusthue('white', '-30deg')
      expect(adjusted).toEqual('rgb(255, 255, 255)')
    })

    test('turquoise turns lightblue', () => {
      const rotation = '25deg'
      const adjusted = bulmaColorTools.adjusthue(turquoise, rotation)
      expect(adjusted).toEqual('rgb(64, 173, 224)')
    })

    test('adjusts colors like sass does', () => {
      const colors = [
        'rgb(19, 14, 83)',
        'rgb(247, 255, 184)',
        'rgb(0, 63, 201)',
        'rgb(100, 24, 168)',
      ]
      const rotation = '-126deg'
      const sassAdjusted = colors.map(col =>
        renderSassColor(`color.adjust(${col}, $hue: ${rotation})`)
      )
      const libAdjusted = colors.map(col =>
        bulmaColorTools.adjusthue(col, rotation)
      )
      expect(libAdjusted).toEqual(sassAdjusted)
    })
  })

  describe('saturates', () => {
    test('black stays black', () => {
      const adjusted = bulmaColorTools.saturate('black', '3000')
      expect(adjusted).toEqual('rgb(0, 0, 0)')
    })

    test('white stays white', () => {
      const adjusted = bulmaColorTools.saturate('white', '4000')
      expect(adjusted).toEqual('rgb(255, 255, 255)')
    })

    test('turquoise gets saturated to green', () => {
      const percentage = '8000'
      const adjusted = bulmaColorTools.saturate(turquoise, percentage)
      expect(adjusted).toEqual('rgb(33, 255, 233)')
    })

    test('saturates colors like sass does', () => {
      const colors = [
        'rgb(19, 14, 83)',
        'rgb(70, 88, 128)',
        'rgb(132, 67, 148)',
        'rgb(100, 24, 168)',
      ]
      const saturation = '3500' // 35%
      const sassAdjusted = colors.map(col =>
        renderSassColor(
          `color.adjust(${col}, $saturation: ${Number(saturation) / 100}%)`
        )
      )
      const libAdjusted = colors.map(col =>
        bulmaColorTools.saturate(col, saturation)
      )
      expect(libAdjusted).toEqual(sassAdjusted)
    })
  })

  describe('desaturates', () => {
    test('black stays black', () => {
      const adjusted = bulmaColorTools.desaturate('black', '3000')
      expect(adjusted).toEqual('rgb(0, 0, 0)')
    })

    test('white stays white', () => {
      const adjusted = bulmaColorTools.desaturate('white', '4000')
      expect(adjusted).toEqual('rgb(255, 255, 255)')
    })

    test('turquoise gets desaturated to turquoise-grey', () => {
      const percentage = '8000'
      const adjusted = bulmaColorTools.desaturate(turquoise, percentage)
      expect(adjusted).toEqual('rgb(144, 144, 144)')
    })

    test('desaturates colors like sass does', () => {
      const colors = [
        'rgb(19, 14, 83)',
        'rgb(70, 88, 128)',
        'rgb(132, 67, 148)',
        'rgb(100, 24, 168)',
      ]
      const desaturation = '3500' // 35%
      const sassAdjusted = colors.map(col =>
        renderSassColor(
          `color.adjust(${col}, $saturation: -${Number(desaturation) / 100}%)`
        )
      )
      const libAdjusted = colors.map(col =>
        bulmaColorTools.desaturate(col, desaturation)
      )
      expect(libAdjusted).toEqual(sassAdjusted)
    })
  })

  describe('darkens', () => {
    test('black stays black', () => {
      const adjusted = bulmaColorTools.darken('black', '3000')
      expect(adjusted).toEqual('rgb(0, 0, 0)')
    })

    test('white becomes grey', () => {
      const adjusted = bulmaColorTools.darken('white', '4000')
      expect(adjusted).toEqual('rgb(153, 153, 153)')
    })

    test('turquoise becomes dark-turquoise', () => {
      const percentage = '2000'
      const adjusted = bulmaColorTools.darken(turquoise, percentage)
      expect(adjusted).toEqual('rgb(26, 160, 147)')
    })

    test('darkens colors like sass does', () => {
      const colors = [
        'rgb(19, 14, 83)',
        'rgb(70, 88, 128)',
        'rgb(132, 67, 148)',
        'rgb(100, 24, 168)',
      ]
      const darkening = '3500' // 35%
      const sassAdjusted = colors.map(col =>
        renderSassColor(
          `color.adjust(${col}, $lightness: -${Number(darkening) / 100}%)`
        )
      )
      const libAdjusted = colors.map(col =>
        bulmaColorTools.darken(col, darkening)
      )
      expect(libAdjusted).toEqual(sassAdjusted)
    })
  })

  describe('lightens', () => {
    test('black becomes grey', () => {
      const adjusted = bulmaColorTools.lighten('black', '3000')
      expect(adjusted).toEqual('rgb(77, 77, 77)')
    })

    test('white stays white', () => {
      const adjusted = bulmaColorTools.lighten('white', '4000')
      expect(adjusted).toEqual('rgb(255, 255, 255)')
    })

    test('turquoise becomes light-turquoise', () => {
      const percentage = '2000'
      const adjusted = bulmaColorTools.lighten(turquoise, percentage)
      expect(adjusted).toEqual('rgb(152, 238, 230)')
    })

    test('lightens colors like sass does', () => {
      const colors = [
        'rgb(19, 14, 83)',
        'rgb(70, 88, 128)',
        'rgb(132, 67, 148)',
        'rgb(100, 24, 168)',
      ]
      const lightening = '3500' // 35%
      const sassAdjusted = colors.map(col =>
        renderSassColor(
          `color.adjust(${col}, $lightness: ${Number(lightening) / 100}%)`
        )
      )
      const libAdjusted = colors.map(col =>
        bulmaColorTools.lighten(col, lightening)
      )
      expect(libAdjusted).toEqual(sassAdjusted)
    })
  })

  describe('alpha-channels (rgba)', () => {
    test('black becomes fading', () => {
      const adjusted = bulmaColorTools.rgba('black', '30')
      expect(adjusted).toEqual('rgba(0, 0, 0, 0.3)')
    })

    test('white becomes fading', () => {
      const adjusted = bulmaColorTools.rgba('white', '40')
      expect(adjusted).toEqual('rgba(255, 255, 255, 0.4)')
    })

    test('turquoise becomes fading', () => {
      const percentage = '20'
      const adjusted = bulmaColorTools.rgba(turquoise, percentage)
      expect(adjusted).toEqual('rgba(64, 224, 208, 0.2)')
    })

    test('alpha-channels colors like sass does', () => {
      const colors = [
        'rgb(19, 14, 83)',
        'rgb(70, 88, 128)',
        'rgb(132, 67, 148)',
        'rgb(100, 24, 168)',
      ]
      const alpha = '35' // 0.35
      const sassAdjusted = colors.map(col =>
        renderSassColor(`color.change(${col}, $alpha: ${Number(alpha) / 100})`)
      )
      const libAdjusted = colors.map(col => bulmaColorTools.rgba(col, alpha))
      expect(libAdjusted).toEqual(sassAdjusted)
    })
  })

  describe('color-inverts', () => {
    test('black becomes white', () => {
      const adjusted = bulmaColorTools['color-invert']('black')
      expect(adjusted).toEqual('rgb(255, 255, 255)')
    })

    test('white becomes black', () => {
      const adjusted = bulmaColorTools['color-invert']('white')
      expect(adjusted).toEqual('rgba(0, 0, 0, 0.7)')
    })

    test('turquoise becomes black-fade', () => {
      const adjusted = bulmaColorTools['color-invert'](turquoise)
      expect(adjusted).toEqual('rgba(0, 0, 0, 0.7)')
    })

    test('inverts colors like sass does', () => {
      const colors = [
        'rgb(19, 14, 83)',
        'rgb(70, 88, 128)',
        'rgb(132, 67, 148)',
        'rgb(100, 24, 168)',
      ]
      const sassAdjusted = colors.map(col =>
        renderSassColor(
          `findColorInvert(${col})`,
          `
@function colorLuminance($color)
  $color-rgb: ('red': red($color),'green': green($color),'blue': blue($color))
  @each $name, $value in $color-rgb
    $adjusted: 0
    $value: calc($value / 255)
    @if $value < 0.03928
      $value: calc($value / 12.92)
    @else
      $value: calc(($value + .055) / 1.055)
      $value: $value * $value
    $color-rgb: map-merge($color-rgb, ($name: $value))
  @return (map-get($color-rgb, 'red') * .2126) + (map-get($color-rgb, 'green') * .7152) + (map-get($color-rgb, 'blue') * .0722)

@function findColorInvert($color)
  @if (colorLuminance($color) > 0.55)
    @return rgba(#000, 0.7)
  @else
    @return #fff
`
        )
      )
      const libAdjusted = colors.map(col =>
        bulmaColorTools['color-invert'](col)
      )
      expect(libAdjusted).toEqual(sassAdjusted)
    })
  })

  describe('light-color', () => {
    test(`black's light color is almost-white`, () => {
      const adjusted = bulmaColorTools['light-color']('black')
      expect(adjusted).toEqual('rgb(245, 245, 245)')
    })

    test(`white's light color is white`, () => {
      const adjusted = bulmaColorTools['light-color']('white')
      expect(adjusted).toEqual('rgb(255, 255, 255)')
    })

    test(`turquoise's light color`, () => {
      const adjusted = bulmaColorTools['light-color'](turquoise)
      expect(adjusted).toEqual('rgb(237, 252, 251)')
    })

    test('light-colors like sass does', () => {
      const colors = [
        'rgb(19, 14, 83)',
        'rgb(70, 88, 128)',
        'rgb(132, 67, 148)',
        'rgb(100, 24, 168)',
      ]
      const sassAdjusted = colors.map(col =>
        renderSassColor(
          `findLightColor(${col})`,
          `
@function findLightColor($color)
  @if type-of($color) == 'color'
    $l: 96%
    @if lightness($color) > 96%
      $l: lightness($color)
    @return change-color($color, $lightness: $l)
  @return $background
`
        )
      )
      const libAdjusted = colors.map(col => bulmaColorTools['light-color'](col))
      expect(libAdjusted).toEqual(sassAdjusted)
    })
  })

  describe('dark-color', () => {
    test(`black's dark color is dark-grey`, () => {
      const adjusted = bulmaColorTools['dark-color']('black')
      expect(adjusted).toEqual('rgb(145, 145, 145)')
    })

    test(`white's dark color is light-grey`, () => {
      const adjusted = bulmaColorTools['dark-color']('white')
      expect(adjusted).toEqual('rgb(74, 74, 74)')
    })

    test(`turquoise's dark color`, () => {
      const adjusted = bulmaColorTools['dark-color'](turquoise)
      expect(adjusted).toEqual('rgb(21, 127, 117)')
    })

    test('dark-colors like sass does', () => {
      const colors = [
        'rgb(19, 14, 83)',
        'rgb(70, 88, 128)',
        'rgb(132, 67, 148)',
        'rgb(100, 24, 168)',
      ]
      const sassAdjusted = colors.map(col =>
        renderSassColor(
          `findDarkColor(${col})`,
          `
@function powerNumber($number, $exp)
  $value: 1
  @if $exp > 0
    @for $i from 1 through $exp
      $value: $value * $number
  @else if $exp < 0
    @for $i from 1 through -$exp
      $value: calc($value / $number)
  @return $value

@function colorLuminance($color)
  $color-rgb: ('red': red($color),'green': green($color),'blue': blue($color))
  @each $name, $value in $color-rgb
    $adjusted: 0
    $value: calc($value / 255)
    @if $value < 0.03928
      $value: calc($value / 12.92)
    @else
      $value: ($value + .055) / 1.055
      $value: powerNumber($value, 2)
    $color-rgb: map-merge($color-rgb, ($name: $value))
  @return (map-get($color-rgb, 'red') * .2126) + (map-get($color-rgb, 'green') * .7152) + (map-get($color-rgb, 'blue') * .0722)

@function findDarkColor($color)
  @if type-of($color) == 'color'
    $base-l: 29%
    $luminance: colorLuminance($color)
    $luminance-delta: (0.53 - $luminance)
    $target-l: round($base-l + ($luminance-delta * 53))
    @return change-color($color, $lightness: max($base-l, $target-l))
  @return $text-strong
`
        )
      )
      const libAdjusted = colors.map(col => bulmaColorTools['dark-color'](col))
      expect(libAdjusted).toEqual(sassAdjusted)
    })
  })

  test('returns name and val from color def', () => {
    const { name, value } = getNameValFromColorDef('text', {
      r: 170,
      g: 130,
      b: 200,
    })
    expect(name).toEqual('--text')
    expect(value).toEqual('rgb(170, 130, 200)')
  })

  test('receives error when passing an invalid object', () => {
    expect(() =>
      strValFromColorDef({ r: 170, g: 130, x: 500 } as any, 'text')
    ).toThrow()
  })

  test('returns val from color def', () => {
    const testVals = [
      {
        r: 170,
        g: 130,
        b: 200,
      },
      {
        r: 170,
        g: 130,
        b: 200,
        a: 0.2,
      },
      {
        h: 170,
        s: 60,
        l: 70,
      },
      {
        h: 170,
        s: 60,
        l: 70,
        a: 0.7,
      },
      '#c8e298',
    ]
    const strVals = testVals.map(v => strValFromColorDef(v, 'some-name'))
    expect(strVals).toEqual([
      'rgb(170, 130, 200)',
      'rgba(170, 130, 200, 0.2)',
      'rgb(133, 224, 209)',
      'rgba(133, 224, 209, 0.7)',
      '#c8e298',
    ])
  })
})
