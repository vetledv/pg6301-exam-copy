module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        '**/*.{jsx,tsx,ts,js}',
        '!jest.config.js',
        '!coverage/**',
    ],
    testMatch: ['**/__tests__/**.test.{jsx,tsx,ts,js}'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['./jest.setup.ts'],
}
