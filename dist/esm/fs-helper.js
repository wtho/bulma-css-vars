var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { promises as fsp } from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
function mkdir(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return mkdirp(dirPath);
    });
}
export function writeFile(filePath, content) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fsp || !fsp.writeFile) {
            throw new Error('[Bulma CSS Vars] requires fs.promises (Node.js v12 or higher)');
        }
        const dir = path.dirname(filePath);
        if (!(yield exists(dir))) {
            yield mkdir(dir);
        }
        yield fsp.writeFile(filePath, content);
    });
}
export function exists(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fsp || !fsp.access) {
            throw new Error('[Bulma CSS Vars] requires fs.promises (Node.js v12 or higher)');
        }
        try {
            yield fsp.access(filePath);
            return true;
        }
        catch (err) {
            return false;
        }
    });
}
export function fileStartsWith(filePath, start) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fsp || !fsp.readFile) {
            throw new Error('[Bulma CSS Vars] requires fs.promises (Node.js v12 or higher)');
        }
        try {
            const content = (yield fsp.readFile(filePath)).toString();
            return content.startsWith(start);
        }
        catch (err) {
            return false;
        }
    });
}
export function getAbsoluteFileName(fileName, cwd) {
    if (!path.isAbsolute(fileName)) {
        return path.join(cwd, fileName);
    }
    return fileName;
}
