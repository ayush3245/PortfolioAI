module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'server.js',
    '!node_modules/**',
    '!dist/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
