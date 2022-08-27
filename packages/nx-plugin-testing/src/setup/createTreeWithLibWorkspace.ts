import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";
import { libraryGenerator } from "@nrwl/node";

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
