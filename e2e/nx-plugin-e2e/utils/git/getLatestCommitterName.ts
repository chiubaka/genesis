import { runCommandAsync } from "@nrwl/nx-plugin/testing";

export const getLatestCommitterName = async () => {
  const { stdout } = await runCommandAsync(
    "git log --oneline -n 1 --pretty=format:'%an'",
  );

  const committerName = stdout.trim();
  return committerName;
};
