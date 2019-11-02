# Bulma CSS Vars

Bulma CSS Vars extends [**Bulma**](https://github.com/jgthms/bulma) to use CSS variables, that can be set to arbitrary values at runtime on the website.

[![version](https://img.shields.io/npm/v/bulma-css-vars.svg)](https://www.npmjs.org/package/bulma-css-vars)
[![]](https://github.com/wtho/bulma-css-vars/workflows/ci/badge.svg)]



<!-- [Demo](bulma-css-vars.github.io) -->

This is an extension and a kind of "sass-pre-post-processor" that tries to be as least intrusive as possible to Bulma, while making arbitrary color changes in the bulma color schemes automated, as easy as possible.

There is quite some setup and configuration to be done, but once it is setup, it works like a charm. Read the sections after **Usage**, to learn why this setup is required.

## Usage
```bash
npm i -S bulma bulma-css-vars
npm i -D sass
```

To use this package, you have to use the dart implementation of sass, the `sass` package, version `1.23` or higher. If you use webpack and the `sass-loader`, you have to configure `options: { implementation: require('sass') }` as well.

```js
// bulma-css-vars.config.js
const { hsl, rgb } = require('bulma-css-vars')

// color names have to match bulma's $variable-name, without '$'
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
  jsOutputFile: './src/generated/bulma-colors.js',
  sassOutputFile: './src/style/bulma-vars.sass',
  sassEntryFile: './src/style/main-sass-file.sass',
  colorDefs: appColors,
}
```
You need to configure `bulma-css-vars` to tell it about your sass setup, especially your sass entry file, the variables you want to modify and where the generated bulma files should be placed.

| Config key      |                                                              |
| ---------------- |:--------------------------------------------------------------------------|
| `sassEntryFile`  | Sass Entry File of you Application - relative path form config file       |
| `jsOutputFile`   | full name of generated js file, can also be `*.ts`                        |
| `sassOutputFile` | full name of generated sass file, should be included in your app styles   |
| `colorDefs`      | color definitions, names have to match bulma color names                  |

Some more files have to be setup.

```sass
// main-sass-file.sass
@import './bulma-vars.sass'
@import '../node_modules/bulma-css-vars/src/bulma-cv-lib.sass'
```
Instead of using `bulma-cv-lib.sass`, you can also just use the bulma packages you like. Look inside the `bulma-cv-lib.sass` to understand more, and especially import `functions.sass` right after the original `functions.sass` is loaded.

```json
// package.json
  scripts: {
    "update-colors": "bulma-css-vars",
  }
```
This script has to be run whenever you modify the colors in `bulma-css-vars.config.js` and it will update the two output files as well.

```js
// in-the-web-app.js
const { ColorUpdater } = require('bulma-css-vars');
const { bulmaCssVariablesDefs } = require('./generated/bulma-colors');

const updater = new ColorUpdater(bulmaCssVariablesDefs):

// do the update manually
const updated = colorUpdater.getUpdatedVars(colorName, value):
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
import { bulmaCssVariablesDefs } from './generated/bulma-colors';

// the updater do the style change
const colorUpdater = new ColorUpdater(bulmaCssVariablesDefs);
colorUpdater.updateVarsInDocument(colorName, value);
```

Annoyingly, the color updater needs knowledge of the current variables, so `bulmaCssVariablesDefs` from the generated js file has to be included in your app. `colorName` has to match the name in the `bulma-css-vars.config.js`.

### Caveats
* The complexity of the setup
* This solution does not provide a fallback, so browsers without CSS Variables support will not be able to handle the variable colors

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
