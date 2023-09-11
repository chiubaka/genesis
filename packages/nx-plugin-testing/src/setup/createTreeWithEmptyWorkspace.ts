import { readNxJson, updateNxJson } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace as createTreeWithEmptyNxWorkspace } from "@nrwl/devkit/testing";

export const createTreeWithEmptyWorkspace = () => {
  const tree = createTreeWithEmptyNxWorkspace();
  const workspaceConfig = readNxJson(tree);

  updateNxJson(tree, {
    ...workspaceConfig,
    workspaceLayout: {
      appsDir: "e2e",
      libsDir: "packages",
    },
  });

  tree.rename("apps", "e2e");
  tree.rename("libs", "packages");

  return tree;
};
