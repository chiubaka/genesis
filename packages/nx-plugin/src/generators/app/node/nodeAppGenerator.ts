import { Tree } from "@nrwl/devkit";
import { applicationGenerator } from "@nrwl/node";

import { projectNameCasings } from "../../../utils";
import { eslintProjectGenerator } from "../../project";
import { NodeAppGeneratorSchema } from "./nodeAppGenerator.schema";

export async function nodeAppGenerator(
  tree: Tree,
  options: NodeAppGeneratorSchema,
) {
  const { name } = options;
  const projectName = projectNameCasings(name);

  const baseGeneratorTask = await applicationGenerator(tree, options);

  eslintProjectGenerator(tree, {
    projectName: projectName.kebabCase,
    projectType: "application",
  });

  return async () => {
    await baseGeneratorTask();
  };
}
