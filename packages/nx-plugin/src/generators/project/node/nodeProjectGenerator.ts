import {
  generateFiles,
  getWorkspaceLayout,
  moveFilesToNewDirectory,
  Tree,
  updateJson,
} from "@nrwl/devkit";
import { applicationGenerator, libraryGenerator } from "@nrwl/node";
import path from "node:path";
import { RawProjectsConfigurations } from "nx/src/config/workspace-json-project-json";

import { PackageJson } from "../../../types";
import { lintFix, Project } from "../../../utils";
import { eslintProjectGenerator } from "../eslint";
import { jestProjectGenerator } from "../jest";
import {
  standardizeProjectJson,
  updateProjectJsonReferences,
} from "../projectJson";
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

  relocateProject(project);
  copyPackageJsonTemplate(project);
  standardizeProjectJson(project);
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

  return async () => {
    await baseGeneratorTask();
    await jestTask();
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

function relocateProject(project: Project) {
  const tree = project.getTree();
  const { projectName, projectType } = project.getMeta();

  const { appsDir, libsDir } = getWorkspaceLayout(tree);
  const originalBaseDir = projectType === "library" ? libsDir : appsDir;
  const originalProjectDir = path.join(originalBaseDir, projectName);

  const newProjectDir = project.relativePath();

  if (originalProjectDir === newProjectDir) {
    return;
  }

  moveFilesToNewDirectory(tree, originalProjectDir, newProjectDir);

  updateJson(
    tree,
    "workspace.json",
    (workspaceJson: RawProjectsConfigurations) => {
      // eslint-disable-next-line security/detect-object-injection
      workspaceJson.projects[projectName] = project.path();
      return workspaceJson;
    },
  );
  updateProjectJsonReferences(project, originalProjectDir);
}

function copyPackageJsonTemplate(project: Project) {
  const tree = project.getTree();
  const projectScope = project.getScope();
  const projectName = project.getName();

  generateFiles(tree, path.join(__dirname, "./files"), project.path(), {
    projectScope,
    projectName,
    template: "",
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
