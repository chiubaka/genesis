import { GitUtils } from "../../git";

export const latestCommitterEmail = async (expectedEmail: string) => {
  const committerEmail = await GitUtils.getLatestCommitterEmail();

  expect(committerEmail).toBe(expectedEmail);
};
