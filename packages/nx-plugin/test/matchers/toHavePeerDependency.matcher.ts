import { Tree } from "@nx/devkit";

import { toHavePeerDependencies } from "./toHavePeerDependencies.matcher";

export const toHavePeerDependency = (
  tree: Tree,
  dependencyName: string,
  dependencyVersion?: string,
  packageJsonPath = "package.json",
) => {
  return toHavePeerDependencies(
    tree,
    { [dependencyName]: dependencyVersion },
    packageJsonPath,
  );
};
