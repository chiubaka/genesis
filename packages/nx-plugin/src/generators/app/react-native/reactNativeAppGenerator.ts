import { Tree } from "@nx/devkit";

import { Project, replaceInFile } from "../../../utils";
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

  updateCodeSample(project);

  return async () => {
    await reactNativeProjectTask();
  };
}

/* eslint-disable security/detect-non-literal-fs-filename */
function updateCodeSample(project: Project) {
  const tree = project.getTree();

  tree.rename(
    project.srcPath("app/App.spec.tsx"),
    project.testPath("unit/App.spec.tsx"),
  );

  replaceInFile(
    tree,
    project.testPath("unit/App.spec.tsx"),
    "import App from './App';",
    "import App from '../src/app/App';",
  );
}
/* eslint-enable security/detect-non-literal-fs-filename */
