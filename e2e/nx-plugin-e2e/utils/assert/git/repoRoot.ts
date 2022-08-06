import { GitUtils } from "../../git";

export const repoRoot = async (expectedRepoRoot: string) => {
  const repoRoot = await GitUtils.getRepoRoot();

  expect(repoRoot).toBe(expectedRepoRoot);
};
