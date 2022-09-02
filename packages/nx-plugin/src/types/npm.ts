import { PackageJson as NxPackageJson } from "nx/src/utils/package-json";

export interface PackageJson extends NxPackageJson {
  private?: boolean;
  license?: string;
  repository?: {
    type: "git";
    url: string;
    directory?: string;
  };
  bugs?: {
    url: string;
  };
  homepage?: string;
  engines?: Record<string, string>;
  os?: string[];
  cpu?: string[];
}
