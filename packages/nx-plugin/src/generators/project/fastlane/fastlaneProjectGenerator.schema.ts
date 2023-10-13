import { ProjectGeneratorBaseSchema } from "../projectGeneratorBase.schema";

export interface FastlaneProjectGeneratorSchema
  extends ProjectGeneratorBaseSchema,
    FastlaneProjectGeneratorOwnOptions {}

export interface FastlaneProjectGeneratorOwnOptions {
  appId: string;
  appName: string;
  appleId: string;
  appleDeveloperTeamId?: string;
  codeSigningGitRepositoryUrl: string;
  skipCodeSigning?: boolean;
}
