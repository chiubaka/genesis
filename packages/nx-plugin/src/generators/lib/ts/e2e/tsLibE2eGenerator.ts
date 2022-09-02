import { Tree } from "@nrwl/devkit";
import path from "path";
import { nodeProjectGenerator } from "../../..";
import { Project } from "../../../..";
import { libE2eGenerator } from "../../e2e";

import { TsLibE2eGeneratorSchema } from "./tsLibE2eGenerator.schema";

export async function tsLibE2eGenerator(
  tree: Tree,
  options: TsLibE2eGeneratorSchema,
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
