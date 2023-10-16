import { TestingWorkspace } from "@chiubaka/nx-plugin-testing";
import { copySync } from "fs-extra";
import path from "node:path";

import { createReactNativeAppTemplate } from "../../utils";

describe("reactNativeAppGenerator android", () => {
  let workspace: TestingWorkspace;

  beforeAll(async () => {
    workspace = await createReactNativeAppTemplate("app.react-native.android");

    const secretsDir = path.join(__dirname, "../../secrets/android");

    copySync(
      secretsDir,
      workspace.path("packages/react-native-app/android/secrets"),
    );
  });

  describe("generates a project with a working Android build setup", () => {
    it("debug", async () => {
      await expect(
        workspace.execNx(
          "build:android react-native-app --configuration=debug",
        ),
      ).resolves.not.toThrow();
    });

    it("release", async () => {
      await expect(
        workspace.execNx("build:android react-native-app"),
      ).resolves.not.toThrow();
    });

    it("bundle-release", async () => {
      await expect(
        workspace.execNx(
          "build:android react-native-app --configuration=bundle-release",
        ),
      ).resolves.not.toThrow();
    });

    it("test-debug", async () => {
      await expect(
        workspace.execNx(
          "build:android react-native-app --configuration=test-debug",
        ),
      ).resolves.not.toThrow();
    });

    it("test-release", async () => {
      await expect(
        workspace.execNx(
          "build:android react-native-app --configuration=test-release",
        ),
      ).resolves.not.toThrow();
    });
  });

  it("generates a project with a working native Android testing setup", async () => {
    await expect(
      workspace.execNx("test:native:android react-native-app"),
    ).resolves.not.toThrow();
  });

  it("generates a project with a working Google Play Store deployment pipeline", async () => {
    await expect(
      workspace.execNx("deploy:android react-native-app"),
    ).resolves.not.toThrow();
  });

  describe("e2e project", () => {
    describe("generates a project with a working android Detox setup", () => {
      // Development Android E2E builds currently require that Metro be left running in the
      // background, and the tests don't currently have the ability to do this automatically
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
