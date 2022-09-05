import { TsConfig } from "../../../types";
import { ProjectGeneratorBaseSchema } from "../projectGeneratorBase.schema";

export interface TsConfigProjectGeneratorSchema
  extends ProjectGeneratorBaseSchema,
    TsConfigProjectGeneratorOwnOptions {}

export interface TsConfigProjectGeneratorOwnOptions {
  baseConfig?: TsConfig;
  primaryConfig?: TsConfig;
  testConfig?: TsConfig;
}
