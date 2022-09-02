import { Tree } from "@nrwl/devkit";
import path from "node:path";

import { nodeProjectGenerator } from "../../../project";
import { Project } from "../../../../utils";
import { NodeLibE2eGeneratorSchema } from "./nodeLibE2eGenerator.schema";
import { libE2eGenerator } from "../../e2e";

export async function nodeLibE2eGenerator(
  tree: Tree,
  options: NodeLibE2eGeneratorSchema,
) {
  const { name, rootProjectGeneratorName } = options;
  const project = new Project(tree, name, "e2e");

  const nodeProjectTask = await nodeProjectGenerator(tree, {
    ...project.getMeta(),
    rootProjectGeneratorName,
  });

  const libE2eGeneratorTask = await libE2eGenerator(tree, {
    ...options,
    codeSamplePath: path.join(__dirname, "./files"),
  });

  return async () => {
    await nodeProjectTask();
    await libE2eGeneratorTask();
  };
}
