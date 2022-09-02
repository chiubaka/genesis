import { CompilerOptions } from "typescript";

import { ProjectGeneratorBaseSchema } from "../projectGeneratorBase.schema";

export interface TsConfigProjectGeneratorSchema
  extends ProjectGeneratorBaseSchema,
    TsConfigProjectGeneratorOwnOptions {}

export interface TsConfigProjectGeneratorOwnOptions {
  appLibTypes?: CompilerOptions["types"];
  lib?: CompilerOptions["lib"];
  module?: string;
  target?: string;
}
