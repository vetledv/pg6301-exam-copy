module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    clearMocks: true,
    collectCoverageFrom: [
        '**/*.{jsx,tsx,ts,js}',
        '!dist/**',
        '!coverage/**',
        '!**.config.js',
        '!src/mocks/**',
    ],
    testMatch: ['**/__tests__/**.test.{jsx,tsx,ts,js}'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['./jest.setup.ts'],
}
