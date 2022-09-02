import {
  detectPackageManager,
  getPackageManagerCommand,
  getWorkspaceLayout,
  moveFilesToNewDirectory,
  Tree,
  updateJson,
} from "@nrwl/devkit";
import path from "node:path";
import { RawProjectsConfigurations } from "nx/src/config/workspace-json-project-json";

import { exec, lintFix, noOpTask, Project } from "../../../utils";
import eslintProjectGenerator from "../eslint";
import jestProjectGenerator from "../jest";
import {
  copyPackageJsonTemplate,
  standardizePackageJson,
} from "../packageJson";
import {
  standardizeProjectJson,
  updateProjectJsonReferences,
} from "../projectJson";
import readmeProjectGenerator from "../readme";
import tsconfigProjectGenerator from "../tsconfig";
import { ProjectGeneratorSchema } from "./projectGenerator.schema";

export async function projectGenerator(
  tree: Tree,
  options: ProjectGeneratorSchema,
) {
  const { jest: jestOptions, tsconfig: tsconfigOptions } = options;
  const project = Project.createFromOptions(tree, options);

  relocateProject(project);
  copyPackageJsonTemplate(project);
  standardizePackageJson(project);
  standardizeProjectJson(project);

  tsconfigProjectGenerator(tree, {
    ...options,
    ...tsconfigOptions,
  });
  const jestTask = await jestProjectGenerator(tree, {
    ...options,
    ...jestOptions,
  });
  eslintProjectGenerator(tree, options);
  readmeProjectGenerator(tree, options);

  const updateYarnWorkspaceTask = updateYarnWorkspace(project);

  return async () => {
    await jestTask();
    await updateYarnWorkspaceTask();
    await lintFix(tree.root, project.getName());
  };
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