import {
  getWorkspaceLayout,
  moveFilesToNewDirectory,
  Tree,
  updateJson,
} from "@nrwl/devkit";
import { applicationGenerator } from "@nrwl/node";
import path from "node:path";
import { RawProjectsConfigurations } from "nx/src/config/workspace-json-project-json";

import { Project } from "../../../utils";
import {
  copyNodeAppSample,
  eslintProjectGenerator,
  jestProjectGenerator,
  readmeProjectGenerator,
  standardizeProjectJson,
  TsConfigGeneratorPresets,
  tsconfigProjectGenerator,
} from "../../project";
import { NodeAppGeneratorSchema } from "./nodeAppGenerator.schema";

export async function nodeAppGenerator(
  tree: Tree,
  options: NodeAppGeneratorSchema,
) {
  const { name } = options;
  const project = new Project(tree, name, "application");
  const projectName = project.getName();
  const projectType = project.getType();

  const baseGeneratorTask = await applicationGenerator(tree, options);

  const { appsDir } = getWorkspaceLayout(tree);
  const originalDir = path.join(appsDir, project.getName());

  moveFilesToNewDirectory(tree, originalDir, project.relativePath());
  updateProjectJsonReferences(project, originalDir);

  tsconfigProjectGenerator(tree, {
    projectName,
    projectType,
    ...TsConfigGeneratorPresets.node18,
  });
  jestProjectGenerator(tree, {
    projectName,
    projectType,
    testEnvironment: "node",
  });
  eslintProjectGenerator(tree, {
    projectName,
    projectType,
  });
  readmeProjectGenerator(tree, {
    projectName,
    projectType,
    rootProjectGeneratorName: "app.node",
  });

  updateJson(
    tree,
    "workspace.json",
    (workspaceJson: RawProjectsConfigurations) => {
      // eslint-disable-next-line security/detect-object-injection
      workspaceJson.projects[projectName] = project.path();
      return workspaceJson;
    },
  );
  standardizeProjectJson(project);

  copyNodeAppSample(project);

  return async () => {
    await baseGeneratorTask();
  };
}

function updateProjectJsonReferences(project: Project, originalDir: string) {
  const tree = project.getTree();
  let projectJson = tree.read(project.path("project.json"))?.toString();

  if (projectJson) {
    projectJson = projectJson?.replace(
      // eslint-disable-next-line security/detect-non-literal-regexp
      new RegExp(originalDir, "g"),
      project.relativePath(),
    );
    tree.write(project.path("project.json"), projectJson);
  }
}
