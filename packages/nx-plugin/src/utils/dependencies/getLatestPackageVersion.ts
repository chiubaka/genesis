import { exec } from "../exec";

export const getLatestPackageVersion = async (
  packageName: string,
): Promise<string> => {
  const { stdout } = await exec(`npm view ${packageName} version`);

  return stdout.trim();
};
