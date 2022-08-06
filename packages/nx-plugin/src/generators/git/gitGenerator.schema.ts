import { GitHooksGeneratorSchema } from "../gitHooks";

export interface GitGeneratorSchema extends GitHooksGeneratorSchema {
  commitMessage: string;
  committerEmail?: string;
  committerName?: string;

  skipGitHooks?: boolean;
}
