import { JestProjectGeneratorOwnOptions } from "../jest";
import { ProjectGeneratorBaseSchema } from "../projectGeneratorBase.schema";
import { ReadmeProjectGeneratorSchema } from "../readme";
import { TsConfigProjectGeneratorOwnOptions } from "../tsconfig";

export interface ProjectGeneratorSchema
  extends ProjectGeneratorBaseSchema,
    ReadmeProjectGeneratorSchema {
  enableReact?: boolean;
  reactNative?: boolean;
  jest?: JestProjectGeneratorOwnOptions;
  tags?: string;
  tsconfig?: TsConfigProjectGeneratorOwnOptions;
  pruneSrcSubdirectories?: boolean;

  skipRelocation?: boolean;
  skipEslint?: boolean;
}
