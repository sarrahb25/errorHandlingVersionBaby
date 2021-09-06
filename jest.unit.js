module.exports = {
  preset: "ts-jest",
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  // coveragePathIgnorePatterns: ["__tests__", "__mocks__"],
  coverageReporters: ["text", "json"],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: ".",
        outputName: "test-report.unit.xml",
      },
    ],
  ],
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts"],
  testPathIgnorePatterns: ["integration_tests/", "integration.spec.ts$"],
};
