import { Tree } from "@nrwl/devkit";

import { Project } from "../../../utils";
import { copyNodeAppSample, nodeProjectGenerator } from "../../project";
import { AppGeneratorSchema } from "../appGenerator.schema";

export async function nodeAppGenerator(
  tree: Tree,
  options: AppGeneratorSchema,
) {
  const { name } = options;
  const project = new Project(tree, name, "application");

  const nodeProjectTask = await nodeProjectGenerator(tree, {
    ...project.getMeta(),
    rootProjectGeneratorName: "app.node",
  });

  copyNodeAppSample(project);

  return async () => {
    await nodeProjectTask();
  };
}
