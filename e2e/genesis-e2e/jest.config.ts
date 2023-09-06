export default {
  displayName: "genesis-e2e",
  preset: "../../jest.preset.js",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  testTimeout: 640_000,
  transform: {
    "^.+\\.[tj]s$": "ts-jest",
  },
  maxWorkers: 1,
  moduleFileExtensions: ["ts", "js", "html", "json"],
  coverageDirectory: "../../reports/coverage/e2e/genesis-e2e",
};
