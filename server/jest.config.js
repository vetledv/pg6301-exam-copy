module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    collectCoverageFrom: [
        '**/*.{jsx,tsx,ts,js}',
        '!jest.config.js',
        '!coverage/**',
    ],
    testMatch: ['**/__tests__/**.test.{jsx,tsx,ts,js}'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['./jest.setup.ts'],
}
