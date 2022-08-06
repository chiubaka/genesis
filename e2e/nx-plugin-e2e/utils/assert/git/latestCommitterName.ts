import { GitUtils } from "../../git";

export const latestCommitterName = async (expectedName: string) => {
  const committerName = await GitUtils.getLatestCommitterName();

  expect(committerName).toBe(expectedName);
};
