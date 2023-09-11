import { libraryGenerator } from "@nrwl/node";
import { getWorkspaceLayout } from "@nx/devkit";

import { createTreeWithEmptyWorkspace } from "./createTreeWithEmptyWorkspace";

export const createTreeWithLibWorkspace = async (
  projectName: string,
  compiler: "swc" | "tsc" = "tsc",
) => {
  const tree = createTreeWithEmptyWorkspace();

  const { npmScope } = getWorkspaceLayout(tree);

  await libraryGenerator(tree, {
    name: projectName,
    buildable: true,
    compiler,
    importPath: `@${npmScope}/${projectName}`,
    publishable: true,
    standaloneConfig: true,
    strict: true,
  });

  return tree;
};
