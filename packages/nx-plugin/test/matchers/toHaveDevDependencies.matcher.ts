import { Tree } from "@nrwl/devkit";

import { toHaveDependencies } from "./toHaveDependencies.matcher";

export const toHaveDevDependencies = (
  tree: Tree,
  expectedDevDependencies: Record<string, string | undefined>,
  packageJsonPath = "package.json",
) => {
  return toHaveDependencies(
    tree,
    expectedDevDependencies,
    packageJsonPath,
    "devDependencies",
  );
};
