import { StyleRules, Rule, AtRule, Comment, Declaration } from 'css';
import { NameValueColor } from 'types';
export declare function getCssFallbacks(css: string, usedVars: NameValueColor[]): string;
export declare function findCssVarRules(rules: StyleRules['rules'], usedVars: NameValueColor[]): StyleRules['rules'];
export declare function traverseRule(el: Rule | Comment | AtRule, usedVars: NameValueColor[]): Rule;
export declare function findCssVarDeclaration(dec: Declaration, usedVars: NameValueColor[]): Declaration;
