import { TsConfigProjectGeneratorOwnOptions } from "..";
import { JestProjectGeneratorOwnOptions } from "../jest/index";
import { ProjectGeneratorBaseSchema } from "../projectGeneratorBase.schema";

export interface ProjectGeneratorSchema extends ProjectGeneratorBaseSchema {
  jest?: JestProjectGeneratorOwnOptions;
  tsconfig?: TsConfigProjectGeneratorOwnOptions;
}
