import { CompilerOptions, ProjectReference } from "typescript";

export interface TsConfig {
  extends?: string;

  compilerOptions?: CompilerOptions;

  exclude?: string[];
  include?: string[];
  references?: ProjectReference[];
}
