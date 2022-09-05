import { Tree, updateJson } from "@nrwl/devkit";
import { applicationGenerator, libraryGenerator } from "@nrwl/node";

import { PackageJson } from "../../../types";
import { Project } from "../../../utils";
import { projectGenerator, ProjectGeneratorSchema } from "../project";
import { TsConfigGeneratorPresets } from "../tsconfig";

export async function nodeProjectGenerator(
  tree: Tree,
  options: ProjectGeneratorSchema,
) {
  const project = Project.createFromOptions(tree, options);

  const baseGeneratorTask = await baseGenerator(project, options);
  const projectGeneratorTask = await projectGenerator(tree, {
    ...options,
    jest: {
      testEnvironment: "node",
    },
    tsconfig: TsConfigGeneratorPresets.NODE18,
  });
  enforceNodeVersion(project);

  return async () => {
    await baseGeneratorTask();
    await projectGeneratorTask();
  };
}

function baseGenerator(project: Project, options: ProjectGeneratorSchema) {
  const { tags } = options;
  const tree = project.getTree();

  return getBaseGenerator(project)(tree, {
    name: project.getName(),

    buildable: true,
    compiler: "tsc",
    importPath: project.getImportPath(),
    publishable: true,
    skipPackageJson: false,
    standaloneConfig: true,
    strict: true,
    tags,
  });
}

function getBaseGenerator(project: Project) {
  const projectType = project.getType();

  if (projectType === "application" || projectType === "e2e") {
    return applicationGenerator;
  }

  return libraryGenerator;
}

function enforceNodeVersion(project: Project) {
  const tree = project.getTree();

  tree.write(".nvmrc", "lts/gallium");

  updateJson(tree, project.path("package.json"), (packageJson: PackageJson) => {
    if (!packageJson.engines) {
      packageJson.engines = {};
    }

    packageJson.engines.node = ">=16.0.0 <17.0.0";
    packageJson.engines.npm = ">=8.1.0 <9.0.0";

    return packageJson;
  });
}
