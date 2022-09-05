import { Tree } from "@nrwl/devkit";

import { Project, replaceInFile } from "../../../utils";
import { reactProjectGenerator } from "../../project";
import { AppGeneratorSchema } from "../appGenerator.schema";
import { reactAppE2eGenerator } from "./e2e";

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

  updateCodeSample(project);

  reactAppE2eGenerator(tree, {
    appOrLibName: name,
    name: `${name}-e2e`,
  });

  return async () => {
    await reactProjectTask();
  };
}

/* eslint-disable security/detect-non-literal-fs-filename */
function updateCodeSample(project: Project) {
  const tree = project.getTree();

  tree.rename(
    project.srcPath("app/nx-welcome.tsx"),
    project.srcPath("app/NxWelcome.tsx"),
  );

  tree.rename(
    project.srcPath("app/nx-welcome.stories.tsx"),
    project.srcPath("app/NxWelcome.stories.tsx"),
  );

  replaceInFile(
    tree,
    project.srcPath("app/NxWelcome.stories.tsx"),
    "./nx-welcome",
    "./NxWelcome",
  );
  replaceInFile(
    tree,
    project.srcPath("app/App.tsx"),
    "./nx-welcome",
    "./NxWelcome",
  );
  replaceInFile(
    tree,
    project.srcPath("app/App.tsx"),
    'import styles from "./App.module.scss";\n',
    "",
  );

  tree.rename(
    project.srcPath("app/App.spec.tsx"),
    project.testPath("unit/App.spec.tsx"),
  );
  replaceInFile(
    tree,
    project.testPath("unit/App.spec.tsx"),
    "./App",
    "../../src/app/App",
  );
}
/* eslint-enable security/detect-non-literal-fs-filename */
