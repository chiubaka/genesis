import { execSync } from "node:child_process";

export const configureGitUser = (
  name = "CircleCI",
  email = "circleci@chiubaka.com",
) => {
  const existingEmail = execSync(`git config --get user.email`).toString();
  if (!existingEmail) {
    execSync(`git config --global user.email "${email}"`);
  }

  const existingName = execSync(`git config --get user.name`).toString();
  if (!existingName) {
    execSync(`git config --global user.name "${name}"`);
  }
};
