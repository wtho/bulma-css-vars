import * as sass from 'sass';
export function compileSass(sassFilePath) {
    const compileResult = sass.compile(sassFilePath, {
        loadPaths: ['./node_modules'],
    });
    return compileResult.css;
}
