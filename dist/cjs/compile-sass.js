"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileSass = void 0;
const sass = require("sass");
function compileSass(sassFilePath) {
    const compileResult = sass.compile(sassFilePath, {
        loadPaths: ['./node_modules'],
    });
    return compileResult.css;
}
exports.compileSass = compileSass;
