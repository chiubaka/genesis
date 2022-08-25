import { Tree } from "@nrwl/devkit";

import { toHaveDependencies } from "./toHaveDependencies.matcher";

export const toHavePeerDependencies = (
  tree: Tree,
  expectedPeerDependencies: Record<string, string | undefined>,
  packageJsonPath = "package.json",
) => {
  return toHaveDependencies(
    tree,
    expectedPeerDependencies,
    packageJsonPath,
    "peerDependencies",
  );
};
