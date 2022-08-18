export interface GitHubGeneratorSchema {
  organization: string;
  privateRepository: boolean;
  repositoryDescription: string;
  repositoryName: string;

  enableCircleCiStatusChecks?: boolean;
  enableCodecovStatusChecks?: boolean;
}
