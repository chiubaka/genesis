import config from "./jest.config";

export default {
  ...config,
  displayName: "genesis-e2e-android",
  coverageDirectory: "../../reports/coverage/e2e/genesis-e2e-android",
  testMatch: ["**/*.android.(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: [],
};
