/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '.+\\.(css|scss)$': 'jest-css-modules-transform',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}
