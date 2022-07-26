export interface PresetGeneratorSchema {
  workspaceName: string;
  workspaceScope: string;

  description: string;

  skipGitHub?: boolean;
  skipInstall?: boolean;

  disableImmutableInstalls: boolean;
  registry?: string;
}
