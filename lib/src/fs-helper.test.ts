jest.mock('fs')

describe('fs helper', () => {

  const mockFiles = {
    '/path/to/mock-file-1.sass': '@import "node_modules/bulma/bulma.sass"',
    '/path/to': 'this is a fake dir'
  }

  beforeEach(() => {
    require('fs').__setMockFiles(mockFiles)
  })

  test('checks if file exists', async () => {
    const { exists } = require('./fs-helper')
    const fileExists = await exists('/path/to/mock-file-1.sass')
    const fileDoesNotExist = await exists('/path/to/mock-file-2.sass')
    expect(fileExists).toBe(true)
    expect(fileDoesNotExist).toBe(false)
  })

  test('checks if file starts with string', async () => {
    const { fileStartsWith } = require('./fs-helper')
    const existingFileDoesStartWith = await fileStartsWith('/path/to/mock-file-1.sass', '@import "node_modules/')
    const nonExistingFileDoesNotStart = await fileStartsWith('/path/to/mock-file-2.sass', '@import"node_modules/')
    const existingFileDoesNotStartWith = await fileStartsWith('/path/to/mock-file-1.sass', 'html {')
    expect(existingFileDoesStartWith).toBe(true)
    expect(nonExistingFileDoesNotStart).toBe(false)
    expect(existingFileDoesNotStartWith).toBe(false)
  })

  test('makes path absolute', async () => {
    const { getAbsoluteFileName } = require('./fs-helper')
    const abs = getAbsoluteFileName('./relative.file', '/home/dir')
    expect(abs).toEqual('/home/dir/relative.file')
  })

  test('returns already absolute path', async () => {
    const { getAbsoluteFileName } = require('./fs-helper')
    const abs = getAbsoluteFileName('/home/dir/abs.file', '/some-other/dir')
    expect(abs).toEqual('/home/dir/abs.file')
  })

  test('writes file', async () => {
    const { writeFile } = require('./fs-helper')
    expect(writeFile('/path/to/file', 'content')).resolves
  })
})
