import { TestingWorkspace } from "@chiubaka/nx-plugin-testing";

import { createReactNativeAppTemplate, projectTestCases } from "../utils";

describe("reactNativeAppGenerator", () => {
  let workspace: TestingWorkspace;

  const getWorkspace = () => {
    return workspace;
  };

  beforeAll(async () => {
    workspace = await createReactNativeAppTemplate("app.react-native");
  });

  projectTestCases("react-native-app", getWorkspace, {
    skipBuild: true,
  });

  it("generates a project with a working iOS bundling setup", async () => {
    await expect(
      workspace.execNx("bundle:ios react-native-app"),
    ).resolves.not.toThrow();
  });

  it("generates a project with a working Android bundling setup", async () => {
    await expect(
      workspace.execNx("bundle:android react-native-app"),
    ).resolves.not.toThrow();
  });

  describe("e2e project", () => {
    projectTestCases("react-native-app-e2e", getWorkspace, {
      skipBuild: true,
      skipTest: true,
    });
  });
});
