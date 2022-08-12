import { ColorFnCall, ColorCallSet, NameValueColor } from './types';
export declare class ColorUpdater {
    protected colorVals: ColorCallSet;
    constructor(colorVals: ColorCallSet);
    protected getBaseVarNames(): string[];
    protected getBaseVars(): NameValueColor[];
    protected getDerivedVars(): {
        name: string;
        value: string;
    }[][];
    getUpdatedVars(colorName: string, colorVal: string): NameValueColor[];
    updateVarsInDocument(colorName: string, colorVal: string): void;
    protected callToNameVal(base: string, call: ColorFnCall): {
        name: string;
        value: string;
    };
    protected createDerivedVariable(baseColorName: string, call: ColorFnCall): string;
    protected createDerivedVarName(call: ColorFnCall): string;
}
export declare class ColorGenerator extends ColorUpdater {
    getAllVars(): NameValueColor[];
    createWritableSassFileOnlySassBaseVariables(): string;
    createWritableSassFile(): string;
}
