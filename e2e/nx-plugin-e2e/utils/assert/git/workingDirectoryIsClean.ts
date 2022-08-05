import { GitUtils } from "../../git";

export const workingDirectoryIsClean = async () => {
  const clean = await GitUtils.isWorkingDirectoryClean();

  expect(clean).toBe(true);
};
