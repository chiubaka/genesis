import { CompilerOptions } from "typescript";

import { ProjectGeneratorSchema } from "../project/projectGenerator.schema";

export interface TsConfigProjectGeneratorSchema
  extends ProjectGeneratorSchema,
    TsConfigProjectGeneratorOwnOptions {}

export interface TsConfigProjectGeneratorOwnOptions {
  appLibTypes?: CompilerOptions["types"];
  lib?: CompilerOptions["lib"];
  module?: string;
  target?: string;
}
