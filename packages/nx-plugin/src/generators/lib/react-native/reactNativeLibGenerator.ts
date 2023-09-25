import { Tree } from "@nx/devkit";

import { Project } from "../../../utils";
import { reactNativeProjectGenerator } from "../../project";
import { libGenerator } from "../libGenerator";
import { LibGeneratorSchema } from "../libGenerator.schema";

export async function reactNativeLibGenerator(
  tree: Tree,
  options: LibGeneratorSchema,
) {
  const { name } = options;
  const project = new Project(tree, name, "library");

  const reactNativeProjectTask = await reactNativeProjectGenerator(tree, {
    ...project.getMeta(),
    rootProjectGeneratorName: "lib.react-native",
  });

  libGenerator(tree, options);

  return async () => {
    await reactNativeProjectTask();
  };
}
