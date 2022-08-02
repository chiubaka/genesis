import { Tree } from "@nrwl/devkit";

import { toHaveDependencies } from "./toHaveDependencies.matcher";

export const toHaveDependency = (
  tree: Tree,
  dependencyName: string,
  dependencyVersion?: string,
  packageJsonPath = "package.json",
): jest.CustomMatcherResult => {
  return toHaveDependencies(
    tree,
    { [dependencyName]: dependencyVersion },
    packageJsonPath,
  );
};
