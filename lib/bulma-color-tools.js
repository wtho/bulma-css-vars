"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulmaColorTools = exports.stringToHsl = exports.strValFromColorDef = exports.getNameValFromColorDef = exports.newRgb = exports.newHsl = void 0;
const Color = require("color");
function lightness(color) {
    return color.hsl().color[2] / 100;
}
function getHsl(color) {
    return color.hsl();
}
function lumForChannel(chanVal) {
    let val = chanVal / 255;
    if (val < 0.03928) {
        val = val / 12.92;
    }
    else {
        val = (val + 0.055) / 1.055;
        val = val * val;
    }
    return val;
}
function colorLuminance(color) {
    const { r, g, b } = color.rgb().object();
    return (lumForChannel(r) * 0.2126 +
        lumForChannel(g) * 0.7152 +
        lumForChannel(b) * 0.0722);
}
function newHsl(hVal, sVal, lVal, alphaVal) {
    const hsl = {
        h: hVal || 0,
        s: sVal || 0,
        l: lVal || 0,
    };
    if (alphaVal !== undefined && typeof alphaVal === 'number') {
        hsl.a = alphaVal;
    }
    return hsl;
}
exports.newHsl = newHsl;
function newRgb(rVal, gVal, bVal, alphaVal) {
    const rgb = {
        r: rVal || 0,
        g: gVal || 0,
        b: bVal || 0,
    };
    if (alphaVal !== undefined && typeof alphaVal === 'number') {
        rgb.a = alphaVal;
    }
    return rgb;
}
exports.newRgb = newRgb;
function isNumberFieldInObject(fieldName, obj) {
    return fieldName in obj && typeof obj[fieldName] === 'number';
}
function getNameValFromColorDef(colorName, colorDef) {
    const name = `--${colorName}`;
    return {
        name,
        value: strValFromColorDef(colorDef, colorName),
    };
}
exports.getNameValFromColorDef = getNameValFromColorDef;
function strValFromColorDef(colorDef, colorName) {
    if (typeof colorDef === 'string' && colorDef.startsWith('#')) {
        // hex
        return colorDef;
    }
    if (typeof colorDef === 'object') {
        if (isNumberFieldInObject('h', colorDef) &&
            isNumberFieldInObject('s', colorDef) &&
            isNumberFieldInObject('l', colorDef)) {
            // hsl - prefer rgb!
            const { h, s, l } = colorDef;
            const hslDef = { h, s, l };
            if (isNumberFieldInObject('a', colorDef)) {
                return new Color(hslDef).rgb().alpha(colorDef.a).toString();
            }
            return new Color(hslDef).rgb().toString();
            // if (isNumberFieldInObject('a', colorDef))
            //   return `hsla(${h}, ${s}%, ${l}%, ${colorDef.a})`
            // return `hsl(${h}, ${s}%, ${l}%)`
        }
        else if (isNumberFieldInObject('r', colorDef) &&
            isNumberFieldInObject('g', colorDef) &&
            isNumberFieldInObject('b', colorDef)) {
            // rgb
            const { r, g, b } = colorDef;
            if (isNumberFieldInObject('a', colorDef))
                return `rgba(${r}, ${g}, ${b}, ${colorDef.a})`;
            return `rgb(${r}, ${g}, ${b})`;
        }
    }
    throw new Error(`Color with name ${colorName} and value '${JSON.stringify(colorDef)}' is not a valid color ({r: number, g: number, b: number} | {h: number, s: number, l: number} | "#[0-9a-f]*)`);
}
exports.strValFromColorDef = strValFromColorDef;
function stringToHsl(col) {
    const [h, s, l] = getHsl(Color(col)).color;
    return { h, s, l };
}
exports.stringToHsl = stringToHsl;
exports.bulmaColorTools = {
    adjusthue(col, deg) {
        const color = Color(col);
        const degAsNumber = Number(deg.split('deg')[0]);
        return color
            .rotate(degAsNumber)
            .rgb()
            .toString();
    },
    saturate(col, perc) {
        const color = Color(col);
        const percAsNumber = Number(perc) / 100;
        const hsl = getHsl(color);
        hsl.color[1] = Math.min(100, hsl.color[1] + percAsNumber);
        return hsl.rgb().toString();
    },
    desaturate(col, perc) {
        const color = Color(col);
        // percentage was previously multiplied by 100 to avoid dots
        // but is required now as per-one value
        // 2.5% => 250 => 0.025: / 10000
        const percAsNumber = Number(perc) / 100;
        const hsl = getHsl(color);
        hsl.color[1] = Math.max(0, hsl.color[1] - percAsNumber);
        return hsl.rgb().toString();
    },
    darken(col, perc) {
        const color = Color(col);
        const percAsNumber = Number(perc) / 100;
        const hsl = getHsl(color);
        hsl.color[2] = Math.max(0, hsl.color[2] - percAsNumber);
        return hsl.rgb().toString();
    },
    lighten(col, perc) {
        const color = Color(col);
        const percAsNumber = Number(perc) / 100;
        const hsl = getHsl(color);
        hsl.color[2] = Math.min(100, hsl.color[2] + percAsNumber);
        return hsl.rgb().toString();
    },
    rgba(col, alphaVal) {
        const color = Color(col).rgb();
        const valAsNumber = Number(alphaVal) / 100;
        return color
            .alpha(valAsNumber)
            .toString();
    },
    'color-invert'(col) {
        const color = Color(col).rgb();
        if (colorLuminance(color) > 0.55)
            return Color('#000')
                .alpha(0.7)
                .toString();
        else
            return 'rgb(255, 255, 255)';
    },
    'light-color'(col) {
        const color = Color(col);
        let light = 0.96;
        if (lightness(color) > 0.96) {
            light = lightness(color);
        }
        return color
            .lightness(light * 100)
            .rgb()
            .toString();
    },
    'dark-color'(col) {
        const color = Color(col);
        const baseLum = 29;
        const luminance = colorLuminance(color);
        const luminanceDelta = 0.53 - luminance;
        const targetLum = Math.round(baseLum + luminanceDelta * 53);
        // is a value between 0 and 100, what lightness also takes as arg
        const changeLum = Math.max(baseLum, targetLum);
        return color
            .lightness(changeLum)
            .rgb()
            .toString();
    },
};
