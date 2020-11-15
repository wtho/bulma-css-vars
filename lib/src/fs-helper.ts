import { promises as fsp } from 'fs'
import * as mkdirp from 'mkdirp'
import * as path from 'path'


async function mkdir(dirPath: string): Promise<string> {
  return mkdirp(dirPath)
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  if (!fsp || !fsp.writeFile) {
    throw new Error('[Bulma CSS Vars] requires fs.promises (Node.js v12 or higher)')
  }
  const dir = path.dirname(filePath)
  if (!(await exists(dir))) {
    await mkdir(dir)
  }
  await fsp.writeFile(filePath, content)
}

export async function exists(filePath: string): Promise<boolean> {
  if (!fsp || !fsp.access) {
    throw new Error('[Bulma CSS Vars] requires fs.promises (Node.js v12 or higher)')
  }
  try {
    await fsp.access(filePath)
    return true
  } catch (err) {
    return false
  }
}

export async function fileStartsWith(filePath: string, start: string): Promise<boolean> {
  if (!fsp || !fsp.readFile) {
    throw new Error('[Bulma CSS Vars] requires fs.promises (Node.js v12 or higher)')
  }
  try {
    const content = (await fsp.readFile(filePath)).toString()
    return content.startsWith(start)
  } catch (err) {
    return false
  }
}

export function getAbsoluteFileName(fileName: string, cwd: string): string {
  if (!path.isAbsolute(fileName)) {
    return path.join(cwd, fileName)
  }
  return fileName
}


