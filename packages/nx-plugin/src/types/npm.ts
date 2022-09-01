import { PackageJson as NxPackageJson } from "nx/src/utils/package-json";

export interface PackageJson extends NxPackageJson {
  private?: boolean;
  engines?: Record<string, string>;
  os?: string[];
  cpu?: string[];
}
