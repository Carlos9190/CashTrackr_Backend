/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  openHandlesTimeout: 10 * 1000,
  testTimeout: 10 * 1000,
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
};