import { CompilerOptions, ProjectReference } from "typescript";

export interface TsConfig {
  extends?: string;
  compilerOptions?: CompilerOptions;
  references?: ProjectReference[];
}
