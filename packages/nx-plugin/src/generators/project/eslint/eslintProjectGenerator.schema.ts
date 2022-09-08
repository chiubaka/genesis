import { ProjectGeneratorBaseSchema } from "../projectGeneratorBase.schema";

export interface EsLintProjectGeneratorSchema
  extends EsLintProjectGeneratorOwnOptions,
    ProjectGeneratorBaseSchema {
  enableReact?: boolean;
}

export interface EsLintProjectGeneratorOwnOptions {
  enableReact?: boolean;
}
