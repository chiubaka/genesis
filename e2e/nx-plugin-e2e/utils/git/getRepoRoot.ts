import { runCommandAsync } from "@nrwl/nx-plugin/testing";

export const getRepoRoot = async () => {
  const { stdout } = await runCommandAsync("git rev-parse --show-toplevel");

  const gitRoot = stdout.trim();
  return gitRoot;
};
