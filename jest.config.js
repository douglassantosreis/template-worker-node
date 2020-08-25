module.exports = {
    roots: [
        '<rootDir>/src',
        '<rootDir>/test'

    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    clearMocks: true,
    setupFiles: [
        'dotenv/config'
    ],
    testEnvironment: 'node',
    verbose: true,
    moduleFileExtensions: [
        "js",
        "ts"
    ]
}
