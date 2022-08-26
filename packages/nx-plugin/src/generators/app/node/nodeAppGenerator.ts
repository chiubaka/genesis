import { Tree } from "@nrwl/devkit";
import { applicationGenerator } from "@nrwl/node";

import { projectNameCasings } from "../../../utils";
import { eslintProjectGenerator, readmeProjectGenerator } from "../../project";
import { NodeAppGeneratorSchema } from "./nodeAppGenerator.schema";

export async function nodeAppGenerator(
  tree: Tree,
  options: NodeAppGeneratorSchema,
) {
  const { name } = options;
  const projectName = projectNameCasings(name);
  const projectType = "application";

  const baseGeneratorTask = await applicationGenerator(tree, options);

  eslintProjectGenerator(tree, {
    projectName: projectName.kebabCase,
    projectType,
  });
  readmeProjectGenerator(tree, {
    projectName: projectName.kebabCase,
    projectType,
    rootProjectGeneratorName: "app.node",
  });

  return async () => {
    await baseGeneratorTask();
  };
}
