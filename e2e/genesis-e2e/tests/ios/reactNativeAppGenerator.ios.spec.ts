import { TestingWorkspace } from "@chiubaka/nx-plugin-testing";

import { createReactNativeAppTemplate } from "../../utils";

describe("reactNativeAppGenerator", () => {
  let workspace: TestingWorkspace;

  beforeAll(async () => {
    workspace = await createReactNativeAppTemplate("app.react-native.ios");
  });

  describe("generates a project with a working iOS build setup", () => {
    it("debug", async () => {
      await expect(
        workspace.execNx("build:ios react-native-app --configuration=debug"),
      ).resolves.not.toThrow();
    });

    it("release", async () => {
      await expect(
        workspace.execNx("build:ios react-native-app"),
      ).resolves.not.toThrow();
    });

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
  });

  it("generates a project with a working native iOS testing setup", async () => {
    await expect(
      workspace.execNx("test:ios react-native-app"),
    ).resolves.not.toThrow();
  });

  it("generates a project with a working TestFlight deployment pipeline", async () => {
    await expect(
      workspace.execNx("deploy:ios react-native-app"),
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
