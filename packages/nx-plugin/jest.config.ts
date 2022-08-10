export default {
  displayName: "nx-plugin",
  preset: "../../jest.preset.js",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  setupFilesAfterEnv: ["<rootDir>/test/setup/jest.setup.ts"],
  transform: {
    "^.+\\.[tj]s$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../reports/coverage/packages/nx-plugin",
  coverageReporters: ["clover", "json", "lcov", "text"],
};
