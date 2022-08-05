import { runCommandAsync } from "@nrwl/nx-plugin/testing";

export const getLatestCommitMessage = async () => {
  const { stdout } = await runCommandAsync("git log --oneline -n 1");

  // Remove the first token of the output, which is the short commit hash
  const tokens = stdout.trim().split(" ");
  tokens.shift();
  const commitMessage = tokens.join(" ");

  return commitMessage;
};
