export interface PresetGeneratorSchema {
  workspaceName: string;
  workspaceScope: string;

  description: string;

  skipInstall?: boolean;
}
