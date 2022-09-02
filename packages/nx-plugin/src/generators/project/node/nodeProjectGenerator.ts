import { detectPackageManager, getPackageManagerCommand } from "@nrwl/devkit";
import { Tree, updateJson } from "@nrwl/devkit";
import { applicationGenerator, libraryGenerator } from "@nrwl/node";

import { PackageJson } from "../../../types";
import { exec, lintFix, noOpTask, Project } from "../../../utils";
import { eslintProjectGenerator } from "../eslint";
import { jestProjectGenerator } from "../jest";
import { projectGenerator } from "../projectGenerator";
import { readmeProjectGenerator } from "../readme";
import {
  TsConfigGeneratorPresets,
  tsconfigProjectGenerator,
} from "../tsconfig";
import { NodeProjectGeneratorSchema } from "./nodeProjectGenerator.schema";

export async function nodeProjectGenerator(
  tree: Tree,
  options: NodeProjectGeneratorSchema,
) {
  const { rootProjectGeneratorName } = options;
  const project = Project.createFromOptions(tree, options);

  const baseGeneratorTask = await baseGenerator(project, options);
  projectGenerator(tree, options);
  enforceNodeVersion(project);

  tsconfigProjectGenerator(tree, {
    ...project.getMeta(),
    ...TsConfigGeneratorPresets.node18,
  });
  const jestTask = await jestProjectGenerator(tree, {
    ...project.getMeta(),
    testEnvironment: "node",
  });
  eslintProjectGenerator(tree, project.getMeta());
  readmeProjectGenerator(tree, {
    ...project.getMeta(),
    rootProjectGeneratorName,
  });

  const updateYarnWorkspaceTask = updateYarnWorkspace(project);

  return async () => {
    await baseGeneratorTask();
    await jestTask();
    await updateYarnWorkspaceTask();
    await lintFix(tree.root, project.getName());
  };
}

function baseGenerator(project: Project, options: NodeProjectGeneratorSchema) {
  const { tags } = options;
  const tree = project.getTree();
  const projectScope = project.getScope();
  const projectName = project.getName();

  return getBaseGenerator(project)(tree, {
    name: project.getName(),

    buildable: true,
    compiler: "tsc",
    importPath: `@${projectScope}/${projectName}`,
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

function updateYarnWorkspace(project: Project) {
  const tree = project.getTree();
  const packageManager = detectPackageManager(tree.root);

  if (packageManager !== "yarn") {
    return noOpTask;
  }

  const pmc = getPackageManagerCommand(packageManager);

  return async () => {
    await exec(pmc.install, {
      cwd: tree.root,
    });
  };
}
