import { Tree } from "@nrwl/devkit";
import { Linter } from "@nrwl/linter";
import {
  applicationGenerator,
  libraryGenerator,
  storybookConfigurationGenerator,
} from "@nrwl/react";

import { Project } from "../../../utils";
import { TsConfigGeneratorPresets } from "..";
import { projectGenerator, ProjectGeneratorSchema } from "../project";

export async function reactProjectGenerator(
  tree: Tree,
  options: ProjectGeneratorSchema,
) {
  const project = Project.createFromOptions(tree, options);

  const baseGeneratorTask = await baseGenerator(project, options);
  const projectGeneratorTask = await projectGenerator(tree, {
    ...options,
    jest: {
      testEnvironment: "jsdom",
    },
    tsconfig: TsConfigGeneratorPresets.REACT,
  });
  const storybookGeneratorTask = await storybookConfigurationGenerator(tree, {
    name: project.getName(),
    configureCypress: true,
    standaloneConfig: true,
    tsConfiguration: true,
  });

  return async () => {
    await baseGeneratorTask();
    await projectGeneratorTask();
    await storybookGeneratorTask();
  };
}

function baseGenerator(project: Project, options: ProjectGeneratorSchema) {
  const { tags } = options;
  const tree = project.getTree();

  return getBaseGenerator(project)(tree, {
    name: project.getName(),

    buildable: true,
    e2eTestRunner: "cypress",
    linter: Linter.EsLint,
    importPath: project.getImportPath(),
    publishable: true,
    routing: true,
    skipFormat: true,
    skipTsConfig: false,
    standaloneConfig: true,
    strict: true,
    style: "scss",
    tags,
    unitTestRunner: "jest",
  });
}

function getBaseGenerator(project: Project) {
  const projectType = project.getType();

  if (projectType === "library") {
    return libraryGenerator;
  }

  return applicationGenerator;
}
