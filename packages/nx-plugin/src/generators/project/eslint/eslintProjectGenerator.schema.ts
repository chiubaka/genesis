import { ProjectGeneratorBaseSchema } from "../projectGeneratorBase.schema";

export interface EsLintProjectGeneratorSchema
  extends EsLintProjectGeneratorOwnOptions,
    ProjectGeneratorBaseSchema {
  enableReact?: boolean;
  // Useful for certain edge case project types like React Native E2E
  // where only a tsconfig.spec.json file is created.
  noPrimaryTsConfig?: boolean;
}

export interface EsLintProjectGeneratorOwnOptions {
  enableReact?: boolean;
}
