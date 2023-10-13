import { TestingWorkspace } from "@chiubaka/nx-plugin-testing";

import { copyWorkspaceTemplate } from "../../utils";

describe("reactNativeAppGenerator", () => {
  let workspace: TestingWorkspace;

  beforeAll(async () => {
    workspace = await copyWorkspaceTemplate("app.react-native.ios");

    await workspace.execNx(
      'generate @chiubaka/nx-plugin:app.react-native --name=react-native-app --appName="Genesis React Native App" --appId="com.chiubaka.genesis.example.ReactNativeApp" --appleId="daniel@chiubaka.com" --androidEmulatorAvdName="Detox"',
    );
  });

  describe("generates a project with a working iOS build setup", () => {
    it("debug-simulator", async () => {
      await expect(
        workspace.execNx(
          "build:ios react-native-app --configuration=debug-simulator",
        ),
      ).resolves.not.toThrow();
    });

    it("release-simulator", async () => {
      await expect(
        workspace.execNx(
          "build:ios react-native-app --configuration=release-simulator",
        ),
      ).resolves.not.toThrow();
    });

    it.skip("release-device", async () => {
      await expect(
        workspace.execNx("build:ios react-native-app"),
      ).resolves.not.toThrow();
    });
  });

  it.skip("generates a project with a working native iOS testing setup", async () => {
    await expect(
      workspace.execNx("test:native:ios react-native-app"),
    ).resolves.not.toThrow();
  });

  describe("e2e project", () => {
    describe("generates a project with a working iOS Detox setup", () => {
      it("development", async () => {
        await expect(
          workspace.execNx("e2e:ios react-native-app-e2e"),
        ).resolves.not.toThrow();
      });

      it("production", async () => {
        await expect(
          workspace.execNx(
            "e2e:ios react-native-app-e2e --configuration=production",
          ),
        ).resolves.not.toThrow();
      });
    });
  });
});
