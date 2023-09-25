import {
  detectPackageManager,
  getPackageManagerCommand,
  getWorkspaceLayout,
  moveFilesToNewDirectory,
  Tree,
} from "@nx/devkit";
import path from "node:path";

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
  const {
    jest: jestOptions,
    pruneSrcSubdirectories,
    tsconfig: tsconfigOptions,
    skipEslint,
  } = options;
  const project = Project.createFromOptions(tree, options);

  relocateProject(project);
  copyPackageJsonTemplate(project);
  standardizePackageJson(project);
  standardizeProjectJson(project);

  if (pruneSrcSubdirectories) {
    pruneSrcDirectories(project);
  }

  tsconfigProjectGenerator(tree, {
    ...options,
    ...tsconfigOptions,
  });
  const jestTask = await jestProjectGenerator(tree, {
    ...options,
    ...jestOptions,
  });
  if (!skipEslint) {
    eslintProjectGenerator(tree, options);
  }
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

  if (
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    // !tree.exists(originalProjectDir) ||
    originalProjectDir === newProjectDir
  ) {
    return;
  }

  moveFilesToNewDirectory(tree, originalProjectDir, newProjectDir);
  updateProjectJsonReferences(project, originalProjectDir);
}

function pruneSrcDirectories(project: Project) {
  const tree = project.getTree();
  const projectType = project.getType();

  if (projectType === "library") {
    tree.delete(project.srcPath("lib"));
  } else {
    tree.delete(project.srcPath("app"));
  }
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
