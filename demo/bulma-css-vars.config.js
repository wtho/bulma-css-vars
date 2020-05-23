const { hsl } = require('bulma-css-vars')

const appColors = {
  black: hsl(0, 0, 4),
  'black-bis': hsl(0, 0, 7),
  'black-ter': hsl(0, 0, 14),

  'grey-darker': hsl(0, 0, 21),
  'grey-dark': hsl(0, 0, 29),
  grey: hsl(0, 0, 48),
  'grey-light': hsl(0, 0, 71),
  'grey-lighter': hsl(0, 0, 86),
  'grey-lightest': hsl(0, 0, 93),

  'white-ter': hsl(0, 0, 96),
  'white-bis': hsl(0, 0, 98),
  white: hsl(0, 0, 100),

  orange: hsl(14, 100, 53),
  yellow: hsl(48, 100, 67),
  green: hsl(141, 53, 53),
  turquoise: hsl(171, 100, 41),
  cyan: hsl(204, 71, 53),
  blue: hsl(217, 71, 53),
  purple: hsl(271, 100, 71),
  red: hsl(348, 86, 61),
}

appColors['scheme-main'] = appColors['white']
appColors['text'] = appColors['grey-dark']
appColors['text-strong'] = appColors['grey-darker']

module.exports = {
  sassEntryFile: './src/main.scss',
  jsOutputFile: './src/bulma-generated/bulma-colors.js',
  sassOutputFile: './src/bulma-generated/generated-vars.sass',
  cssFallbackOutputFile: './src/bulma-generated/generated-fallbacks.css',
  colorDefs: appColors,
  globalWebVar: false,
  transition: '0.5s ease',
}
