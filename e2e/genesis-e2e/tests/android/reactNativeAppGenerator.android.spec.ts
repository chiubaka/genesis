import { TestingWorkspace } from "@chiubaka/nx-plugin-testing";

import { copyWorkspaceTemplate } from "../../utils";

describe("reactNativeAppGenerator android", () => {
  let workspace: TestingWorkspace;

  beforeAll(async () => {
    workspace = await copyWorkspaceTemplate("app.react-native.android");

    await workspace.execNx(
      'generate @chiubaka/nx-plugin:app.react-native --name=react-native-app --appName="Genesis React Native App" --appId="com.chiubaka.genesis.example.ReactNativeApp" --appleId="daniel@chiubaka.com" --androidEmulatorAvdName="Detox"',
    );
  });

  it("generates a project with a working Android build setup", async () => {
    await expect(
      workspace.execNx("build:android react-native-app"),
    ).resolves.not.toThrow();
  });

  it("generates a project with a working native Android testing setup", async () => {
    await expect(
      workspace.execNx("test:native:android react-native-app"),
    ).resolves.not.toThrow();
  });

  describe("e2e project", () => {
    describe("generates a project with a working android Detox setup", () => {
      it.skip("development", async () => {
        await expect(
          workspace.execNx("e2e:android react-native-app-e2e"),
        ).resolves.not.toThrow();
      });

      it("production", async () => {
        await expect(
          workspace.execNx(
            "e2e:android react-native-app-e2e --configuration=production",
          ),
        ).resolves.not.toThrow();
      });
    });
  });
});
