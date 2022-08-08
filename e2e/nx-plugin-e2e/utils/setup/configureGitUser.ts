import { execSync } from "node:child_process";

export const configureGitUser = (
  name = "CircleCI",
  email = "circleci@chiubaka.com",
) => {
  const gitConfigs = execSync("git config --list").toString();

  if (!gitConfigs.includes("user.email") && !gitConfigs.includes("user.name")) {
    execSync(`git config --global user.email "${email}"`);
    execSync(`git config --global user.name "${name}"`);
  }
};
