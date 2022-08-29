import { libraryGenerator } from "@nrwl/node";

import { createTreeWithEmptyWorkspace } from "./createTreeWithEmptyWorkspace";

export const createTreeWithLibWorkspace = async (
  projectName: string,
  compiler: "swc" | "tsc" = "tsc",
) => {
  const tree = createTreeWithEmptyWorkspace();
  await libraryGenerator(tree, {
    name: projectName,
    compiler,
  });

  return tree;
};
