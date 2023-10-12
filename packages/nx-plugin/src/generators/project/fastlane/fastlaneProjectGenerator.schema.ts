import { ProjectGeneratorBaseSchema } from "../projectGeneratorBase.schema";

export interface FastlaneProjectGeneratorSchema
  extends ProjectGeneratorBaseSchema,
    FastlaneProjectGeneratorOwnOptions {}

export interface FastlaneProjectGeneratorOwnOptions {
  appId: string;
  appleId: string;
  appleDeveloperTeamId?: string;
}
