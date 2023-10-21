const path = require("node:path");
const dotenv = require("dotenv");
const { readFileSync } = require("node:fs");

const fastlaneEnvPath = path.join(
  __dirname,
  "../../<%= projectPath %>/fastlane/Fastlane.env",
);

fastlaneEnv = dotenv.parse(readFileSync(fastlaneEnvPath));

module.exports = {
  testRunner: {
    args: {
      $0: "jest",
      config: "./jest.config.json",
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    "ios.debug": {
      type: "ios.app",
      build:
        "cd ../.. && yarn nx build:ios <%= projectName %> --configuration=debug-simulator",
      binaryPath:
        "../../<%= projectPath %>/ios/build/Build/Products/Debug-iphonesimulator/<%= iosProjectName %>.app",
    },
    "ios.release": {
      type: "ios.app",
      build:
        "cd ../.. && yarn nx build:ios <%= projectName %> --configuration=release-simulator",
      binaryPath:
        "../../<%= projectPath %>/ios/build/Build/Products/Release-iphonesimulator/<%= iosProjectName %>.app",
    },
    "android.debug": {
      type: "android.apk",
      build:
        "cd ../.. && yarn nx build:android <%= projectName %> --configuration=test-debug",
      binaryPath:
        "../../<%= projectPath %>/android/app/build/outputs/apk/debug/app-debug.apk",
    },
    "android.release": {
      type: "android.apk",
      build:
        "cd ../.. && yarn nx build:android <%= projectName %> --configuration=test-release",
      binaryPath:
        "../../<%= projectPath %>/android/app/build/outputs/apk/release/app-release.apk",
    },
  },
  devices: {
    simulator: {
      type: "ios.simulator",
      device: {
        type: fastlaneEnv.IOS_SIMULATOR_DEFAULT_DEVICE,
        os: `iOS ${fastlaneEnv.IOS_SIMULATOR_DEFAULT_OS}`,
      },
    },
    emulator: {
      type: "android.emulator",
      device: {
        avdName: "Detox",
      },
    },
  },
  configurations: {
    "ios.sim.release": {
      device: "simulator",
      app: "ios.release",
    },
    "ios.sim.debug": {
      device: "simulator",
      app: "ios.debug",
    },
    "android.emu.release": {
      device: "emulator",
      app: "android.release",
    },
    "android.emu.debug": {
      device: "emulator",
      app: "android.debug",
    },
  },
};
