import { Tree } from "@nx/devkit";

import { Project } from "../../../utils";
import { reactNativeProjectGenerator } from "../../project";
import { ReactNativeAppGeneratorSchema } from "./reactNativeAppGenerator.schema";

export async function reactNativeAppGenerator(
  tree: Tree,
  options: ReactNativeAppGeneratorSchema,
) {
  const { name, displayName } = options;
  const project = new Project(tree, name, "application");

  const reactNativeProjectTask = await reactNativeProjectGenerator(tree, {
    ...project.getMeta(),
    displayName,
    rootProjectGeneratorName: "app.react-native",
  });

  return async () => {
    await reactNativeProjectTask();
  };
}
