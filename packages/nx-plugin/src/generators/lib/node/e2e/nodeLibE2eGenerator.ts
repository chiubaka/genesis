import { generateFiles, Tree } from "@nrwl/devkit";
import { nodeProjectGenerator } from "../../../project";

import { NodeLibE2eGeneratorSchema } from "./nodeLibE2eGenerator.schema";
import { Project } from "../../../..";
import path from "node:path";

export async function nodeLibE2eGenerator(
  tree: Tree,
  options: NodeLibE2eGeneratorSchema,
) {
  const { libName, name, rootProjectGeneratorName } = options;
  const project = new Project(tree, name, "e2e");

  const nodeProjectTask = await nodeProjectGenerator(tree, {
    ...project.getMeta(),
    rootProjectGeneratorName,
  });

  // TODO: Finish building out E2E sample code
  // TODO: Point to dist for lib project in package.json
  // TODO: Update project.json
  // - Test task should become E2E task
  // - E2E task should build lib project as a dependent task

  tree.delete(project.srcPath("app"));

  generateFiles(tree, path.join(__dirname, "./files"), project.path(), {
    libScope: project.getScope(),
    libName,
    template: "",
  });

  return async () => {
    await nodeProjectTask();
  };
}
