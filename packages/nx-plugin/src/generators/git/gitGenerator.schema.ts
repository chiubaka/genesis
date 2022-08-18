import { GitHooksGeneratorSchema } from "./gitHooks";
import { GitHubGeneratorSchema } from "./github";

export interface GitGeneratorSchema
  extends GitHooksGeneratorSchema,
    Partial<GitHubGeneratorSchema> {
  commitMessage: string;
  committerEmail?: string;
  committerName?: string;

  skipGitHooks?: boolean;
  skipGitHub?: boolean;
}
