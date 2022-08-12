const fs: any = jest.genMockFromModule('fs');

let mockFiles: {[fileName: string]: string} = {}
function __setMockFiles(newMockFiles: {[fileName: string]: string}) {
  mockFiles = newMockFiles
}

async function accessPromised(filePath: string) {
  if (!mockFiles[filePath]) {
    throw new Error('File does not exist!')
  }
}

async function readFilePromised(filePath: string) {
  if (!mockFiles[filePath]) {
    throw new Error('File does not exist!')
  }
  return Buffer.from(mockFiles[filePath])
}

async function writeFilePromised(filePath: string, content: string) {}

fs.__setMockFiles = __setMockFiles;
fs.promises = {
  access: accessPromised,
  readFile: readFilePromised,
  writeFile: writeFilePromised
}

module.exports = fs;
