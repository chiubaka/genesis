import {
  ExecutorContext,
  logger,
  parseTargetString,
  readTargetOptions,
  runExecutor,
} from "@nrwl/devkit";
import { jestExecutor } from "@nrwl/jest/src/executors/jest/jest.impl";
import { JestExecutorOptions } from "@nrwl/jest/src/executors/jest/schema";
import { ExecutorOptions as BuildExecutorOptions } from "@nrwl/js/src/utils/schema";
import { execSync } from "node:child_process";

import { NxPluginE2eExecutorOptions } from "./nxPluginE2e.executor.schema";

export async function nxPluginE2eExecutor(
  options: NxPluginE2eExecutorOptions,
  context: ExecutorContext,
) {
  const { target, ...jestOptions } = options;

  let success!: boolean;

  for await (const _ of runBuildTarget(target, context)) {
    try {
      success = await runTests(jestOptions, context);
    } catch (error) {
      logger.error((error as Error).message);
      success = false;
    }
  }

  return { success };
}

async function* runBuildTarget(buildTarget: string, context: ExecutorContext) {
  const target = parseTargetString(buildTarget);

  const buildTargetOptions: BuildExecutorOptions = readTargetOptions(
    target,
    context,
  );

  const targetSupportsWatch = Object.keys(buildTargetOptions).includes("watch");
  const outputPath = buildTargetOptions.outputPath;

  const overrides = targetSupportsWatch ? { watch: false } : {};

  const executorResults = await runExecutor(target, overrides, context);

  for await (const output of executorResults) {
    if (!output.success) {
      throw new Error("Could not compile application files.");
    }

    logger.info(`Installing dependencies for project "${target.project}"`);

    execSync("yarn install", {
      cwd: outputPath,
    });

    yield output.success;
  }
}

async function runTests(
  options: JestExecutorOptions,
  context: ExecutorContext,
) {
  const { success } = await jestExecutor({ ...options, watch: false }, context);

  return success;
}
