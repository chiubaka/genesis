export default {
  displayName: "genesis-e2e",
  preset: "../../jest.preset.js",
  globals: {},
  testTimeout: 640_000,
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
  coverageDirectory: "../../reports/coverage/e2e/genesis-e2e",
};
