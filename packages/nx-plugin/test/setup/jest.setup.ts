import { matchers } from "../matchers";
import { getLatestPackageVersion } from "../mocks";

expect.extend(matchers);

jest.mock("octokit");

jest.mock("../../src/utils/getLatestPackageVersion", () => {
  return {
    getLatestPackageVersion,
  };
});
