import { Tree } from "@nx/devkit";
import { Linter } from "@nx/linter";
import {
  reactNativeApplicationGenerator,
  reactNativeLibraryGenerator,
} from "@nx/react-native";

import { lintFix, Project } from "../../../utils";
import { projectGenerator } from "../project";
import { TsConfigGeneratorPresets } from "../tsconfig";
import { ReactNativeProjectGeneratorSchema } from "./reactNativeProjectGeneratorSchema";

export async function reactNativeProjectGenerator(
  tree: Tree,
  options: ReactNativeProjectGeneratorSchema,
) {
  const project = Project.createFromOptions(tree, options);

  const baseGeneratorTask = await baseGenerator(project, options);

  const projectGeneratorTask = await projectGenerator(tree, {
    ...options,
    enableReact: true,
    tsconfig: TsConfigGeneratorPresets.REACT,
  });

  return async () => {
    await baseGeneratorTask();
    await projectGeneratorTask();
    await lintFix(tree.root);
  };
}

function baseGenerator(
  project: Project,
  options: ReactNativeProjectGeneratorSchema,
) {
  const { displayName, tags } = options;
  const tree = project.getTree();

  return getBaseGenerator(project)(tree, {
    name: project.getName(),
    displayName: displayName,

    e2eTestRunner: "detox",
    install: true,
    linter: Linter.EsLint,
    pascalCaseFiles: true,
    publishable: true,
    skipFormat: true,
    skipTsConfig: false,
    strict: true,
    style: "scss",
    tags,
    unitTestRunner: "jest",
  });
}

function getBaseGenerator(project: Project) {
  const projectType = project.getType();

  if (projectType === "library") {
    return reactNativeLibraryGenerator;
  }

  return reactNativeApplicationGenerator;
}
