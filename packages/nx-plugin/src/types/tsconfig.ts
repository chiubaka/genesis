import { CompilerOptions as TsCompilerOptions } from "typescript";

export interface TsConfig {
  extends?: string;

  compilerOptions?: CompilerOptions;

  exclude?: string[];
  include?: string[];

  files?: string[];
  references?: ConfigReference[];
}

export type CompilerOptions = Omit<TsCompilerOptions, "module" | "target"> & {
  module?: string;
  target?: string;
};

interface ConfigReference {
  path: string;
}
