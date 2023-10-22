export default {
  displayName: "nx-plugin-e2e",
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
  moduleFileExtensions: ["ts", "js", "html", "json"],
  coverageDirectory: "../../reports/coverage/e2e/nx-plugin-e2e",
};
