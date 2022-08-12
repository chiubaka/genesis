import { JestExecutorOptions } from "@nrwl/jest/src/executors/jest/schema";
import { NxPluginE2EExecutorOptions as BaseExecutorOptions } from "@nrwl/nx-plugin/src/executors/e2e/schema";

export interface NxPluginE2eExecutorOptions
  extends BaseExecutorOptions,
    Pick<JestExecutorOptions, "ci" | "runInBand" | "testNamePattern"> {
  skipInstallDependencies?: boolean;
}
