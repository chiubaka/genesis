import { runCommandAsync } from "@nrwl/nx-plugin/testing";

export const getLatestCommitterEmail = async () => {
  const { stdout } = await runCommandAsync(
    "git log --oneline -n 1 --pretty=format:'%ae'",
  );

  const committerEmail = stdout.trim();
  return committerEmail;
};
