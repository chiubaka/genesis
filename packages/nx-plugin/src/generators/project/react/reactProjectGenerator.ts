import { Tree } from "@nrwl/devkit";
import { Linter } from "@nrwl/linter";
import {
  applicationGenerator,
  libraryGenerator,
  storybookConfigurationGenerator,
} from "@nrwl/react";

import { lintFix, Project } from "../../../utils";
import { eslintProjectGenerator } from "../eslint";
import { projectGenerator, ProjectGeneratorSchema } from "../project";
import { TsConfigGeneratorPresets } from "../tsconfig";

export async function reactProjectGenerator(
  tree: Tree,
  options: ProjectGeneratorSchema,
) {
  const project = Project.createFromOptions(tree, options);

  const baseGeneratorTask = await baseGenerator(project, options);

  const projectGeneratorTask = await projectGenerator(tree, {
    ...options,
    skipEslint: true,
    enableReact: true,
    jest: {
      testEnvironment: "jsdom",
    },
    tsconfig: TsConfigGeneratorPresets.REACT,
  });

  const storybookGeneratorTask = (await storybookConfigurationGenerator(tree, {
    name: project.getName(),
    configureCypress: true,
    generateCypressSpecs: true,
    generateStories: true,
    standaloneConfig: true,
    tsConfiguration: true,
  })) as () => Promise<void>;

  // Storybook modifies the .eslintrc.json file in a bad way, so we have to
  // run this generator after storybook generation.
  eslintProjectGenerator(tree, {
    ...options,
    enableReact: true,
  });

  return async () => {
    await baseGeneratorTask();
    await projectGeneratorTask();
    await storybookGeneratorTask();
    await lintFix(tree.root);
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
    pascalCaseFiles: true,
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
