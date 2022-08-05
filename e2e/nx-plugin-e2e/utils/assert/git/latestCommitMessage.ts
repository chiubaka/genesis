import { GitUtils } from "../../git";

export const latestCommitMessage = async (expectedMessage: string) => {
  const commitMessage = await GitUtils.getLatestCommitMessage();

  expect(commitMessage).toBe(expectedMessage);
};
