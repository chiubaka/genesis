import { runCommandAsync } from "@nrwl/nx-plugin/testing";

export const isWorkingDirectoryClean = async () => {
  const { stdout: gitStatus } = await runCommandAsync("git status --porcelain");

  return gitStatus === "";
};
