import {
  formatFiles,
  getWorkspaceLayout,
  moveFilesToNewDirectory,
  Tree,
  updateJson,
} from "@nrwl/devkit";
import { applicationGenerator, libraryGenerator } from "@nrwl/node";
import path from "node:path";
import { RawProjectsConfigurations } from "nx/src/config/workspace-json-project-json";

import { Project } from "../../../utils";
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

  standardizeProjectJson(project);

  tsconfigProjectGenerator(tree, {
    ...project.getMeta(),
    ...TsConfigGeneratorPresets.node18,
  });
  jestProjectGenerator(tree, {
    ...project.getMeta(),
    testEnvironment: "node",
  });
  eslintProjectGenerator(tree, project.getMeta());
  readmeProjectGenerator(tree, {
    ...project.getMeta(),
    rootProjectGeneratorName,
  });

  await formatFiles(tree);

  return async () => {
    await baseGeneratorTask();
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

function getBaseGenerator(project: Project) {
  const projectType = project.getType();

  if (projectType === "application" || projectType === "e2e") {
    return applicationGenerator;
  }

  return libraryGenerator;
}