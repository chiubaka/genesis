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
  testPathIgnorePatterns: [
    "/node_modules/",
    "\\.ios\\.(test|spec)\\.[jt]sx?$",
    "\\.android\\.(test|spec)\\.[jt]sx?$",
  ],
  // watchman appears to degrade test bootstrapping performance
  // and may even cause tests to hang on macOS CI executors (unconfirmed)
  watchman: false,
};
