import { TsConfigProjectGeneratorOwnOptions } from "..";
import { JestProjectGeneratorOwnOptions } from "../jest";
import { ProjectGeneratorBaseSchema } from "../projectGeneratorBase.schema";

export interface ProjectGeneratorSchema extends ProjectGeneratorBaseSchema {
  jest?: JestProjectGeneratorOwnOptions;
  tsconfig?: TsConfigProjectGeneratorOwnOptions;
}
