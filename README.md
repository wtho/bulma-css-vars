# Bulma CSS Vars

Bulma CSS Vars extends [**Bulma**](https://github.com/jgthms/bulma) to use CSS variables, that can be set to arbitrary values at runtime on the website and installs fallbacks for browsers without CSS variables capabilities.

[![version](https://img.shields.io/npm/v/bulma-css-vars.svg)](https://www.npmjs.org/package/bulma-css-vars)
[![](https://github.com/wtho/bulma-css-vars/workflows/ci/badge.svg)](https://github.com/wtho/bulma-css-vars/actions?query=workflow%3Aci)
[![](https://img.shields.io/badge/Demo-green)](https://wtho.github.io/bulma-css-vars)


This is an extension and a kind of "sass-pre-post-processor" that tries to be as least intrusive as possible to Bulma, while making arbitrary color changes in the bulma color schemes automated, as easy as possible.

There is quite some setup and configuration to be done, but once it is setup, it works like a charm. Read the section [What is the difficulty](#what-is-the-difficulty-why-this-setup), to learn why this setup is required.

## Usage
```bash
npm i -S bulma bulma-css-vars
npm i -D sass
node ./node_modules/.bin/bulma-css-vars --init
```

To use this package, you have to use the dart implementation of sass, the `sass` package, version `1.23` or higher. If you use webpack and the `sass-loader`, you have to make sure you do not have `node-sass` installed, or configure `options: { implementation: require('sass') }` for the `sass-loader`.

```js
// bulma-css-vars.config.js
const { hsl, rgb } = require('bulma-css-vars')

// color names have to match bulma's $variable-name, without '$'
// values will be used for initial colors and fallback
const appColors = {
  black: hsl(0, 0, 4),
  'scheme-main': rgb(200, 105, 84),
  red: { r: 255, b: 0, g: 0}
  primary: '#663423',
  blue: 'blue',
}
// reuse variable colors
appColors['text'] = appColors['primary']

module.exports = {
  sassEntryFile: './src/style/main-sass-file.sass',
  jsOutputFile: './src/bulma-generated/bulma-colors.js',
  sassOutputFile: './src/bulma-generated/generated-vars.sass',
  cssFallbackOutputFile: './src/bulma-generated/generated-fallbacks.css',
  colorDefs: appColors,
  globalWebVar: false,
  transition: '0.5s ease',
}
```

You need to configure `bulma-css-vars` to tell it about your sass setup, especially your sass entry file, the variables (color) you want to have available as css variables and where the generated bulma files should be placed.


| Config key              |                                                                                                    |
| ----------------------- |:---------------------------------------------------------------------------------------------------|
| `sassEntryFile`         | Sass Entry File of you Application - relative path form config file                                |
| `jsOutputFile`          | full name of generated js file, can also be `<a-typescript-file>.ts`                               |
| `sassOutputFile`        | full name of generated sass file, should be included in your app styles                            |
| `cssFallbackOutputFile` | full name of generated css file, should be included in your sass app styles (optional)             | 
| `colorDefs`             | color definitions, names have to match bulma color names (see examples above)                      |
| `globalWebVar`          | if you import js files directly in the browser, you need `true`, see [Direct Web Setup](#direct-web-setup), defaults to `false` |
| `transition`            | will create the [CSS transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition) shorthand for all colored CSS variables, should consist of `[ <duration> [ <timing-function> [ <time-delay> ] ] ]` |

```js
// This is the full set of colors variables of Bulma 0.9.2
// Using this color definitions, you are getting the default bulma theme
// with all color variables as css variables

const appColors = {
  'black':          hsl(0, 0, 4),
  'black-bis':      hsl(0, 0, 7),
  'black-ter':      hsl(0, 0, 14),

  'grey-darker':    hsl(0, 0, 21),
  'grey-dark':      hsl(0, 0, 29),
  'grey':           hsl(0, 0, 48),
  'grey-light':     hsl(0, 0, 71),
  'grey-lighter':   hsl(0, 0, 86),
  'grey-lightest':  hsl(0, 0, 93),

  'white-ter':      hsl(0, 0, 96),
  'white-bis':      hsl(0, 0, 98),
  'white':          hsl(0, 0, 100),

  'orange':         hsl(14,  100, 53),
  'yellow':         hsl(48,  100, 67),
  'green':          hsl(141, 53,  53),
  'turquoise':      hsl(171, 100, 41),
  'cyan':           hsl(204, 71,  53),
  'blue':           hsl(217, 71,  53),
  'purple':         hsl(271, 100, 71),
  'red':            hsl(348, 86, 61),
}

appColors['primary'] = appColors['turquoise']
appColors['info'] = appColors['cyan']
appColors['success'] = appColors['green']
appColors['warning'] = appColors['yellow']
appColors['danger'] = appColors['red']
appColors['light'] = appColors['white-ter']
appColors['dark'] = appColors['grey-darker']

appColors['scheme-main'] = appColors['white']
appColors['scheme-main-bis'] = appColors['white-bis']
appColors['scheme-main-ter'] = appColors['white-ter']
appColors['scheme-invert'] = appColors['black']
appColors['scheme-invert-bis'] = appColors['black-bis']
appColors['scheme-invert-ter'] = appColors['black-ter']

appColors['background'] = appColors['white-ter']

appColors['border'] = appColors['grey-lighter']
appColors['border-hover'] = appColors['grey-light']
appColors['border-light'] = appColors['grey-lightest']
appColors['border-light-hover'] = appColors['grey-light']

appColors['text'] = appColors['grey-dark']
appColors['text-light'] = appColors['grey']
appColors['text-strong'] = appColors['grey-darker']

appColors['code-background'] = appColors['background']

appColors['pre'] = appColors['text']
appColors['pre-background'] = appColors['background']

appColors['link'] = appColors['blue']
appColors['link-visited'] = appColors['purple']
appColors['link-hover'] = appColors['grey-darker']
appColors['link-hover-border'] = appColors['grey-light']
appColors['link-focus'] = appColors['grey-darker']
appColors['link-active'] = appColors['grey-darker']
appColors['link-active-border'] = appColors['grey-dark']

appColors['body-background-color'] = appColors['scheme-main']
appColors['body-color'] = appColors['text']
appColors['hr-background-color'] = appColors['background']
appColors['strong-color'] = appColors['text-strong']
```

Some more files have to be setup, which can be achieved using `node ./node_modules/bulma-css-vars --init`.

```scss
// main.scss
@import './bulma-generated/generated-fallback.css'; // import fallbacks first, so they are overridden
@import './bulma-generated/generated-vars.sass';
@import '../node_modules/bulma-css-vars/bulma-cv-lib';
```
Instead of using `bulma-cv-lib.sass`, you can also just use the bulma packages you like. Look inside the `bulma-cv-lib.sass` to understand more, and especially import `functions.sass` right after the original `functions.sass` is loaded.

```json
// package.json
  scripts: {
    "update-bulma-colors": "bulma-css-vars",
  }
```
The script `./node_modules/.bin/bulma-css-vars` has to be run whenever you modify the colors in `bulma-css-vars.config.js` and it will update the three output files as well.

```js
// in-the-web-app.js
const { ColorUpdater } = require('bulma-css-vars');
const { bulmaCssVariablesDefs } = require('./bulma-generated/bulma-colors');

const updater = new ColorUpdater(bulmaCssVariablesDefs);

// do the update manually
const updated = colorUpdater.getUpdatedVars(colorName, value);
updated.forEach(({ name, value }) =>
  document.documentElement.style.setProperty(name, value)
);
// or let it do the updater
colorUpdater.updateVarsInDocument(colorName, value);
```

You can also use TypeScript
```ts
// in-the-web-app.ts
import { ColorUpdater } from 'bulma-css-vars';
import { bulmaCssVariablesDefs } from './bulma-generated/bulma-colors';

// the updater do the style change
const colorUpdater = new ColorUpdater(bulmaCssVariablesDefs);
colorUpdater.updateVarsInDocument(colorName, value);
```

Annoyingly, the color updater needs knowledge of the current variables, so `bulmaCssVariablesDefs` from the generated js file has to be included in your app. `colorName` has to match the name in the `bulma-css-vars.config.js`.

### Caveats
* Requires Node.js and Dart Sass
* The complexity of the setup

## What is the difficulty? Why this setup?
The problem is, that Bulma relies heavily on sass preprocessing, so if you set a color variable for `$primary`, this color will be modified for hover / focus shades on buttons, inversions for texts on buttons are calculated, and so on.
If we would inject a CSS variable `var(--my-dynamic-primary-color)` here, not only will sass fail, also if you will change this color on runtime, still all the computed shades will remain calculated from the initial color.

## The solution - how it works
First off this library patches original sass functions such as `darken`, `lighten`, as well as bulma helper functions like `findColorInvert`. This is currently only possible thanks to the power of the dart `sass` package, which has more powerful possibilities than the `node-sass` package. The patched functions can handle `var(--variablename)` variables and decide if the original function will be called or if a new, derived variable of the incoming variable gets added.

For example, `darken(var(--primary), 10%)` will turn into `var(--primary--10--darken)`, and a derived variable gets added to the css stylesheets.
This library automates this process, so for each actually used and derived variable a new css variable gets created. To leverage this technique, the library then compiles the css and gets an overview of which derived variables are all in the actually used stylesheets.

The advantage of this technique is that only actually required variables will be generated and added to the stylesheets. The disadvantage is, that you need to run this command whenever you decide to add an additional variable to your app.

From the list of base variables and derived variables, this library then can create an initial sass file, that you should include in your sass compilation. It calculates the style using a js version of `darken`, `lighten`, `findColorInvert`. As an example, `--primary--10--darken: #532949;` would be generated by `bulma-css-vars` as well, next to `--primary: #694392;`.

The class doing this should also be included into your application. Whenever you want to change a bulma color variable, e. g. say `$blue`, the color updater knows which derived variables are required to be adjusted as well and will let you update all affected variables.

This way you can keep using the full bulma color richness. Try out the demo and see how the font of the buttons changes on dark / bright colors!

## Direct Web Setup
If you do not use any bundler or web framework, you can also include bulma-css-vars directly. You will still require Node.js.

```sass
// app.sass
@import './bulma-vars.sass'
@import './node_modules/bulma-css-vars/bulma-cv-lib.sass'
```

Make sure you set `globalWebVars` to true in your `bulma-css-vars.config.js`. Then run `./node_modules/.bin/bulma-css-vars` and `sass app.sass > app.css`.

In your html:
```html
<head>
  <link res="stylesheet" src="./app.css">
</head>
<body>
  <!-- [your webpage] -->
  
  <!-- loads window.BulmaColorUpdater -->
  <script src="./node_modules/bulma-css-vars/dist/bulma-css-vars.web-bundle.js"></script>

  <!-- loads window.bulmaCssVarsDef with your variable definitions -->
  <script src="./bulma-colors.js"></script>
  <script>
    const updater = new BulmaColorUpdater(bulmaCssVarsDef);
    updater.updateVarsInDocument('black', '#553292');
  </script>
</body>
```

## New Features
PRs are welcome!
If you want to build this repository and try out the demo, make sure you use `yarn` and `yarn install` to install the packages in the `demo` folder. `npm` will create symlinks instead of true file copies, which might create problems on referencing relative bulma files.

