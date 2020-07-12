module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup/index.ts'],
  modulePathIgnorePatterns: ['./out/', './node_modules/'],
};
