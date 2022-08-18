import { GitHubApiAdapter } from "./GitHubApiAdapter";

export { Repo as GitHubRepo } from "./GitHubApiAdapter";

export const github = new GitHubApiAdapter();
