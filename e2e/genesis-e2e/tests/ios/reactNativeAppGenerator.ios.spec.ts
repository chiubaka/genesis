import { TestingWorkspace } from "@chiubaka/nx-plugin-testing";
import { copySync } from "fs-extra";
import path from "node:path";

import { createReactNativeAppTemplate } from "../../utils";

describe("reactNativeAppGenerator", () => {
  let workspace: TestingWorkspace;

  beforeAll(async () => {
    workspace = await createReactNativeAppTemplate("app.react-native.ios");

    const secretsDir = path.join(__dirname, "../../secrets/ios");

    copySync(
      secretsDir,
      workspace.path("packages/react-native-app/ios/secrets"),
    );
  });

  describe("generates a project with a working iOS build setup", () => {
    // This configuration isn't likely to be common... if we're generating a build for device,
    // most of the time we'll want a release build? Cutting this to save on testing and CI time.
    it.skip("debug", async () => {
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

    // This build command will get exercised by the E2E testing configurations, so no need
    // to run it again here.
    it.skip("release-simulator", async () => {
      await expect(
        workspace.execNx(
          "build:ios react-native-app --configuration=release-simulator",
        ),
      ).resolves.not.toThrow();
    });
  });

  // This works fine locally but fails on CI. Tests seem to time out on CI...
  // I haven't yet been able to determine why. Best theory before was that a second
  // simulator was being spun up for these tests...
  // https://linear.app/chiubaka/issue/CT-742/figure-out-why-ios-native-tests-for-react-native-app-generator-fail-on
  it.skip("generates a project with a working native iOS testing setup", async () => {
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
      // 2023-10-21: There's a bug in Metro documented here: https://github.com/facebook/metro/issues/1015
      // This is fixed in Metro 0.79.1, but unfortunately this isn't available with current
      // versions of @react-native-community/cli. This bug is, interestingly, causing metro to
      // crash before the simulator can load the bundle for development tests. These E2E tests do
      // run fine if Metro is started separately before running these tests.
      it.skip("development", async () => {
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
