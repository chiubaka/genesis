import { execSync } from "node:child_process";

export const configureGitUser = (
  name = "CircleCI",
  email = "circleci@chiubaka.com",
) => {
  execSync(`git config --local user.email "${email}"`);
  execSync(`git config --local user.name "${name}"`);
};
