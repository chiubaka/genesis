import {
  getWorkspaceLayout,
  moveFilesToNewDirectory,
  Tree,
  updateJson,
} from "@nrwl/devkit";
import path from "node:path";
import { RawProjectsConfigurations } from "nx/src/config/workspace-json-project-json";

import { Project } from "../../utils";
import { copyPackageJsonTemplate, standardizePackageJson } from "./packageJson";
import { ProjectGeneratorSchema } from "./projectGenerator.schema";
import {
  standardizeProjectJson,
  updateProjectJsonReferences,
} from "./projectJson";

export function projectGenerator(tree: Tree, options: ProjectGeneratorSchema) {
  const project = Project.createFromOptions(tree, options);

  relocateProject(project);
  copyPackageJsonTemplate(project);
  standardizePackageJson(project);
  standardizeProjectJson(project);
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
