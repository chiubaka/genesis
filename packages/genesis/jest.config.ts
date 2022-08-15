export default {
  displayName: "genesis",
  preset: "../../jest.preset.js",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  transform: {
    "^.+\\.[tj]s$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../reports/coverage/packages/nx-plugin",
  reporters: [
    "default",
    [
      "jest-junit",
      {
        addFileAttribute: "true",
        classNameTemplate: "{suitename}",
        outputDirectory: "reports/junit",
        outputName: "genesis.xml",
      },
    ],
  ],
};
