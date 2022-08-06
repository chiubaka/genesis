import { configureGitUser } from "./configureGitUser";

if (process.env.NODE_ENV === "test") {
  configureGitUser();
}
