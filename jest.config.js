module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json'
    }
  },
  transform: {'^.+\\.(ts|js)$': 'ts-jest'},
  testEnvironment: 'node'
}
