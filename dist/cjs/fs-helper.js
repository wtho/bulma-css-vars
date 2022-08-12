"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAbsoluteFileName = exports.fileStartsWith = exports.exists = exports.writeFile = void 0;
const fs_1 = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
function mkdir(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return mkdirp(dirPath);
    });
}
function writeFile(filePath, content) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.promises || !fs_1.promises.writeFile) {
            throw new Error('[Bulma CSS Vars] requires fs.promises (Node.js v12 or higher)');
        }
        const dir = path.dirname(filePath);
        if (!(yield exists(dir))) {
            yield mkdir(dir);
        }
        yield fs_1.promises.writeFile(filePath, content);
    });
}
exports.writeFile = writeFile;
function exists(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.promises || !fs_1.promises.access) {
            throw new Error('[Bulma CSS Vars] requires fs.promises (Node.js v12 or higher)');
        }
        try {
            yield fs_1.promises.access(filePath);
            return true;
        }
        catch (err) {
            return false;
        }
    });
}
exports.exists = exists;
function fileStartsWith(filePath, start) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.promises || !fs_1.promises.readFile) {
            throw new Error('[Bulma CSS Vars] requires fs.promises (Node.js v12 or higher)');
        }
        try {
            const content = (yield fs_1.promises.readFile(filePath)).toString();
            return content.startsWith(start);
        }
        catch (err) {
            return false;
        }
    });
}
exports.fileStartsWith = fileStartsWith;
function getAbsoluteFileName(fileName, cwd) {
    if (!path.isAbsolute(fileName)) {
        return path.join(cwd, fileName);
    }
    return fileName;
}
exports.getAbsoluteFileName = getAbsoluteFileName;
