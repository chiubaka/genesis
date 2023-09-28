import { TestingWorkspace } from "@chiubaka/nx-plugin-testing";

import { copyWorkspaceTemplate, projectTestCases } from "../utils";

describe("reactNativeAppGenerator", () => {
  let workspace: TestingWorkspace;

  const getWorkspace = () => {
    return workspace;
  };

  beforeAll(async () => {
    workspace = await copyWorkspaceTemplate("app.react-native");

    await workspace.execNx(
      'generate @chiubaka/nx-plugin:app.react-native --name=react-native-app --displayName="React Native App" --packageName="com.chiubaka.ReactNativeApp" --androidEmulatorAvdName="Pixel_7_API_34"',
    );
  });

  projectTestCases("react-native-app", getWorkspace, {
    skipBuild: true,
  });

  it("generates a project with a working Android build setup", async () => {
    await expect(
      workspace.execNx("build-android react-native-app"),
    ).resolves.not.toThrow();
  });

  it("generates a project with a working iOS build setup", async () => {
    await expect(
      workspace.execNx("build-ios react-native-app"),
    ).resolves.not.toThrow();
  });

  it("generates a project with a working Android bundling setup", async () => {
    await expect(
      workspace.execNx("bundle-android react-native-app"),
    ).resolves.not.toThrow();
  });

  it("generates a project with a working iOS bundling setup", async () => {
    await expect(
      workspace.execNx("bundle-ios react-native-app"),
    ).resolves.not.toThrow();
  });

  describe("fastlane", () => {
    it.todo("generates a project that can build iOS using fastlane");

    it.todo("generates a project that can run native iOS tests using fastlane");

    it.todo("generates a project that can build Android using fastlane");

    it.todo("generates a project that run native Android tests using fastlane");
  });

  describe("e2e project", () => {
    projectTestCases("react-native-app-e2e", getWorkspace, {
      skipBuild: true,
      skipTest: true,
    });

    it("generates a project with a working android Detox setup", async () => {
      await expect(
        workspace.execNx(
          "test-android react-native-app-e2e --configuration=production",
        ),
      ).resolves.not.toThrow();
    });

    it("generates a project with a working iOS Detox setup", async () => {
      await expect(
        workspace.execNx(
          "test-ios react-native-app-e2e --configuration=production",
        ),
      ).resolves.not.toThrow();
    });
  });
});
