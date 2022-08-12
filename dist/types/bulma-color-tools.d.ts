import { Hsl, Rgb, Hex, ColorDef, NameValueColor } from './types';
export declare function newHsl(hVal: number, sVal: number, lVal: number, alphaVal?: number): Hsl;
export declare function newRgb(rVal: number, gVal: number, bVal: number, alphaVal?: number): Rgb;
export declare function getNameValFromColorDef(colorName: string, colorDef: ColorDef): NameValueColor;
export declare function strValFromColorDef(colorDef: Hsl | Rgb | Hex, colorName: string): string;
export declare function stringToHsl(col: string): Hsl;
export declare const bulmaColorTools: {
    adjusthue(col: string, deg: string): string;
    saturate(col: string, perc: string): string;
    desaturate(col: string, perc: string): string;
    darken(col: string, perc: string): string;
    lighten(col: string, perc: string): string;
    rgba(col: string, alphaVal: string): string;
    'color-invert'(col: string): string;
    'light-color'(col: string): string;
    'dark-color'(col: string): string;
    transparentize(col: string, perc: string): string;
};
