import { matchers } from "../matchers";

expect.extend(matchers);

jest.mock("../../src/utils/getLatestPackageVersion", () => {
  return {
    getLatestPackageVersion: () => {
      return Promise.resolve("0.0.1");
    },
  };
});
