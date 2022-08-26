import { Tree } from "@nrwl/devkit";
import { applicationGenerator } from "@nrwl/node";

import { Project } from "../../../utils";
import { eslintProjectGenerator, readmeProjectGenerator } from "../../project";
import { NodeAppGeneratorSchema } from "./nodeAppGenerator.schema";

export async function nodeAppGenerator(
  tree: Tree,
  options: NodeAppGeneratorSchema,
) {
  const { name } = options;
  const project = new Project(tree, name, "application");
  const projectName = project.getName();
  const projectType = project.getType();

  const baseGeneratorTask = await applicationGenerator(tree, options);

  eslintProjectGenerator(tree, {
    projectName,
    projectType,
  });
  readmeProjectGenerator(tree, {
    projectName,
    projectType,
    rootProjectGeneratorName: "app.node",
  });

  return async () => {
    await baseGeneratorTask();
  };
}
