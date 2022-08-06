import { configureGitUser } from "./configureGitUser";

if (process.env.CI) {
  configureGitUser();
}
