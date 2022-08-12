jest.mock("@nrwl/jest/src/executors/jest/jest.impl", () => {
  return {
    jestExecutor: jest.fn().mockResolvedValue({ success: true }),
  };
});
jest.mock("node:child_process");

import * as Devkit from "@nrwl/devkit";
import { ExecutorContext, Target } from "@nrwl/devkit";
import { jestExecutor } from "@nrwl/jest/src/executors/jest/jest.impl";
import { execSync } from "node:child_process";

import { nxPluginE2eExecutor } from "../../../src/executors";

function* mockExecutorIterable() {
  yield { success: true };
}

describe("nxPluginE2eExecutor", () => {
  let mockContext: ExecutorContext;
  let runExecutorSpy: jest.SpyInstance;

  beforeAll(() => {
    mockContext = {
      cwd: "/root",
      isVerbose: true,
      projectName: "nx-plugin",
      root: "/root",
      workspace: {
        version: 2,
        projects: {
          "nx-plugin": {
            root: "nx-plugin",
            targets: {
              build: {
                executor: "@nrwl/js:tsc",
                options: {
                  outputPath: "dist/packages/nx-plugin",
                },
              },
            },
          },
        },
      },
    };

    jest
      .spyOn(Devkit, "readTargetOptions")
      .mockImplementation((target: Target, context: ExecutorContext) => {
        const project = context.workspace.projects[target.project];
        const projectTarget = project.targets?.[target.target];

        return projectTarget?.options as unknown;
      });

    runExecutorSpy = jest
      .spyOn(Devkit, "runExecutor")
      .mockImplementation(
        (
          _target: Target,
          _overrides: Record<string, any>,
          _context: ExecutorContext,
        ) => {
          return Promise.resolve(mockExecutorIterable()) as unknown as Promise<
            AsyncIterableIterator<any>
          >;
        },
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    jest.unmock("node:child_process");
  });

  it("builds the specified target", async () => {
    await nxPluginE2eExecutor(
      {
        target: "nx-plugin:build",
        jestConfig: "./jest.config.ts",
      },
      mockContext,
    );

    const target = Devkit.parseTargetString("nx-plugin:build");

    expect(runExecutorSpy).toHaveBeenCalledTimes(1);
    expect(runExecutorSpy).toHaveBeenCalledWith(target, {}, mockContext);
  });

  it("installs dependencies for the build targets", async () => {
    await nxPluginE2eExecutor(
      {
        target: "nx-plugin:build",
        jestConfig: "./jest.config.ts",
      },
      mockContext,
    );

    expect(execSync).toHaveBeenCalledTimes(1);
    expect(execSync).toHaveBeenCalledWith("yarn install", {
      cwd: "dist/packages/nx-plugin",
    });
  });

  it("passes jest options down to the jest executor", async () => {
    const jestOptions = {
      jestConfig: "./jest.config.ts",
      ci: true,
      runInBand: true,
      testNamePattern: "foobar",
    };

    await nxPluginE2eExecutor(
      {
        target: "nx-plugin:build",
        ...jestOptions,
      },
      mockContext,
    );

    expect(jestExecutor).toHaveBeenCalledTimes(1);
    expect(jestExecutor).toHaveBeenCalledWith(
      { ...jestOptions, watch: false },
      mockContext,
    );
  });

  describe("when skipInstallDependencies option is true", () => {
    it("doesn't install dependencies for build targets", async () => {
      await nxPluginE2eExecutor(
        {
          target: "nx-plugin:build",
          jestConfig: "./jest.config.ts",
          skipInstallDependencies: true,
        },
        mockContext,
      );

      expect(execSync).not.toHaveBeenCalled();
    });
  });

  describe("when packageManager option is set", () => {
    it.todo("installs dependencies with the specified package manager");
  });
});
