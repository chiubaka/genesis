import { Tree } from "@nrwl/devkit";

import { Project } from "../../..";
import { reactProjectGenerator } from "../../project";
import { AppGeneratorSchema } from "../appGenerator.schema";

export async function reactAppGenerator(
  tree: Tree,
  options: AppGeneratorSchema,
) {
  const { name } = options;
  const project = new Project(tree, name, "application");

  const reactProjectTask = await reactProjectGenerator(tree, {
    ...project.getMeta(),
    rootProjectGeneratorName: "app.react",
  });

  return async () => {
    await reactProjectTask();
  };
}
