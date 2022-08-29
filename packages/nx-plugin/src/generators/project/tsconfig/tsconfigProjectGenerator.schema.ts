import { CompilerOptions } from "typescript";

import { ProjectGeneratorSchema } from "../projectGenerator.schema";

export interface TsConfigProjectGeneratorSchema extends ProjectGeneratorSchema {
  appLibTypes?: CompilerOptions["types"];
  lib?: CompilerOptions["lib"];
  module?: string;
  target?: string;
}
