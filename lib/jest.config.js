module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.test.json'
    }
  },
  transform: {'^.+\\.(ts|js)$': 'ts-jest'},
  testEnvironment: 'node'
}
