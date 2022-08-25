export interface GenesisExecutorSchema {
  workspaceScope: string;
  workspaceName: string;
  description: string;
  skipGitHub: boolean;
  registry?: string;
  destination?: string;
}
