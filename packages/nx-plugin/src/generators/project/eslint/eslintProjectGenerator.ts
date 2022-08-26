import { generateFiles, Tree } from "@nrwl/devkit";
import path from "node:path";

import { Project } from "../../../utils";
import { ProjectGeneratorSchema } from "../projectGenerator.schema";

export function eslintProjectGenerator(
  tree: Tree,
  options: ProjectGeneratorSchema,
) {
  const { projectName, projectType } = options;
  const project = new Project(tree, projectName, projectType);
  copyConfigTemplate(project);
}

function copyConfigTemplate(project: Project) {
  const tree = project.getTree();

  const templateDirectory = path.join(__dirname, "./files");
  generateFiles(tree, templateDirectory, project.path(), { template: "" });
}
