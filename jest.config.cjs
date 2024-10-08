module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/*.test.ts'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^../../prismaClient.js$': '<rootDir>/src/__mocks__/prismaClient.js',
    '^../../Util/common.js$': '<rootDir>/src/Util/common.ts',
    '^../../Util/validationSchemas.js$':
      '<rootDir>/src/Util/validationSchemas.ts',
    '^../Service/eventService.js$':
      '<rootDir>/src/provider/Service/eventService.ts',
  },
};
