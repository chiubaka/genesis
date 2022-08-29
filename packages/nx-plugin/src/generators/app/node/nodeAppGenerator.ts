import { Tree } from "@nrwl/devkit";
import { applicationGenerator } from "@nrwl/node";

import { Project } from "../../../utils";
import {
  eslintProjectGenerator,
  jestProjectGenerator,
  readmeProjectGenerator,
  TsConfigGeneratorPresets,
  tsconfigProjectGenerator,
} from "../../project";
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

  tsconfigProjectGenerator(tree, {
    projectName,
    projectType,
    ...TsConfigGeneratorPresets.node18,
  });
  jestProjectGenerator(tree, {
    projectName,
    projectType,
    testEnvironment: "node",
  });
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
