import { e2eTmpPath, TestingWorkspace } from "@chiubaka/nx-plugin-testing";
import fs from "fs-extra";

import { copyWorkspaceTemplate } from "../../utils";

describe("reactNativeAppGenerator", () => {
  let workspace: TestingWorkspace;

  beforeAll(async () => {
    const workspaceDestination = e2eTmpPath("app.react-native");

    const canSkipSetup =
      process.env.CI === "true" || process.env.SKIP_E2E_SETUP === "true";
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const workspaceAlreadyGenerated = fs.existsSync(workspaceDestination);

    if (canSkipSetup && workspaceAlreadyGenerated) {
      workspace = new TestingWorkspace(workspaceDestination);

      // eslint-disable-next-line no-console
      console.info("Skipping workspace setup for reactNativeAppGenerator ios");
      return;
    }

    workspace = await copyWorkspaceTemplate("app.react-native");

    await workspace.execNx(
      'generate @chiubaka/nx-plugin:app.react-native --name=react-native-app --displayName="React Native App" --appId="com.chiubaka.ReactNativeApp" --androidEmulatorAvdName="Detox"',
    );
  });

  it("generates a project with a working iOS build setup", async () => {
    await expect(
      workspace.execNx("build-ios react-native-app"),
    ).resolves.not.toThrow();
  });

  describe("fastlane", () => {
    it.todo("generates a project that can build iOS using fastlane");

    it.todo("generates a project that can run native iOS tests using fastlane");
  });

  describe("e2e project", () => {
    it("generates a project with a working iOS Detox setup", async () => {
      await expect(
        workspace.execNx(
          "test-ios react-native-app-e2e --configuration=production",
        ),
      ).resolves.not.toThrow();
    });
  });
});
