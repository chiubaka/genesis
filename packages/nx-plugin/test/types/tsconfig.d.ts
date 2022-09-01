import {
  CompilerOptions as TsCompilerOptions,
  MapLike,
  ProjectReference,
} from "typescript";

export type CompilerOptions = Omit<
  TsCompilerOptions,
  "module" | "paths" | "target"
> & {
  module?: string;
  paths?: MapLike<string[]>;
  target?: string;
};

export interface TsConfig {
  extends?: string;

  compilerOptions?: CompilerOptions;

  exclude?: string[];
  include?: string[];
  references?: ProjectReference[];
}
