import { GitHubApiAdapter } from "./GitHubApiAdapter";

export {
  BranchProtection as GitHubBranchProtection,
  Label as GitHubLabel,
  Repo as GitHubRepo,
} from "./GitHubApiAdapter";

export const github = new GitHubApiAdapter();
