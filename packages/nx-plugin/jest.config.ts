export default {
  displayName: "nx-plugin",
  preset: "../../jest.preset.js",
  globals: {},
  setupFilesAfterEnv: ["<rootDir>/test/setup/jest.setup.ts"],
  testTimeout: 10_000,
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
      },
    ],
  },
  maxWorkers: 1,
  moduleFileExtensions: ["ts", "js", "html", "json"],
  coverageDirectory: "../../reports/coverage/packages/nx-plugin",
  reporters: [
    "default",
    [
      "jest-junit",
      {
        addFileAttribute: "true",
        classNameTemplate: "{suitename}",
        outputDirectory: "reports/junit",
        outputName: "nx-plugin.xml",
      },
    ],
  ],
};
