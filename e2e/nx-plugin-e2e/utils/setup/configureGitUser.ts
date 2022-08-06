import { execSync } from "node:child_process";

export const configureGitUser = (
  name = "CircleCI",
  email = "circleci@chiubaka.com",
) => {
  execSync(`git config --global user.email "${email}"`);
  execSync(`git config --global user.name "${name}"`);
};
