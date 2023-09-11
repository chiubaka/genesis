import { Tree } from "@nx/devkit";

import { toHaveDevDependencies } from "./toHaveDevDependencies.matcher";

export const toHaveDevDependency = (
  tree: Tree,
  dependencyName: string,
  dependencyVersion?: string,
  packageJsonPath = "package.json",
) => {
  return toHaveDevDependencies(
    tree,
    { [dependencyName]: dependencyVersion },
    packageJsonPath,
  );
};
