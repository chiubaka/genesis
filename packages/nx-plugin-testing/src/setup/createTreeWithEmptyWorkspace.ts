import { readNxJson, updateNxJson } from "@nx/devkit";
import { createTreeWithEmptyWorkspace as createTreeWithEmptyNxWorkspace } from "@nx/devkit/testing";

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

  tree.write(".gitignore", "");

  return tree;
};
