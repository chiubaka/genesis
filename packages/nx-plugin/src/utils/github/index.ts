import { GitHubApiAdapter } from "./GitHubApiAdapter";

export {
  BranchProtection as GitHubBranchProtection,
  Repo as GitHubRepo,
} from "./GitHubApiAdapter";

export const github = new GitHubApiAdapter();
