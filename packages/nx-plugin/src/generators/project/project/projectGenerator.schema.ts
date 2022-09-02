import { TsConfigProjectGeneratorOwnOptions } from "..";
import { JestProjectGeneratorOwnOptions } from "../jest";
import { ProjectGeneratorBaseSchema } from "../projectGeneratorBase.schema";
import { ReadmeProjectGeneratorSchema } from "../readme";

export interface ProjectGeneratorSchema
  extends ProjectGeneratorBaseSchema,
    ReadmeProjectGeneratorSchema {
  jest?: JestProjectGeneratorOwnOptions;
  tsconfig?: TsConfigProjectGeneratorOwnOptions;
}
