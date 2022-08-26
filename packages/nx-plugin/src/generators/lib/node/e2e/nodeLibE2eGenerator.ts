import { Tree } from "@nrwl/devkit";

import { nodeAppGenerator } from "../../../../app/index";
import { NodeLibE2eGeneratorSchema } from "./nodeLibE2eGenerator.schema";

export async function nodeLibE2eGenerator(
  tree: Tree,
  options: NodeLibE2eGeneratorSchema
) {
  const baseGeneratorTask = await nodeAppGenerator(tree, options);

  return async () => {
    await baseGeneratorTask();
  };
}
