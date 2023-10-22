import config from "./jest.config";

export default {
  ...config,
  displayName: "genesis-e2e-ios",
  coverageDirectory: "../../reports/coverage/e2e/genesis-e2e-ios",
  testMatch: ["**/*.ios.(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: [],
};
