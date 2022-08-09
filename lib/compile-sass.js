"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileSass = void 0;
const sass = require("sass");
function compileSass(sassFilePath) {
    const compileResult = sass.compile(sassFilePath);
    return compileResult.css;
}
exports.compileSass = compileSass;
