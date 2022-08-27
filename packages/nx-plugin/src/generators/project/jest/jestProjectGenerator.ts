import { generateFiles, Tree } from "@nrwl/devkit";
import path from "node:path";

import { Project } from "../../..";
import { JestProjectGeneratorSchema } from "./jestProjectGenerator.schema";

export function jestProjectGenerator(
  tree: Tree,
  options: JestProjectGeneratorSchema,
) {
  const { projectName, projectType, testEnvironment } = options;
  const project = new Project(tree, projectName, projectType);

  copyConfigTemplate(project, testEnvironment);
}

function copyConfigTemplate(
  project: Project,
  testEnvironment?: "node" | "jsdom",
) {
  const tree = project.getTree();
  const projectName = project.getName();
  const projectType = project.getType();
  const templateDir = path.join(__dirname, "./files");

  generateFiles(tree, templateDir, project.path(), {
    projectName,
    projectType,
    template: "",
    testEnvironment,
  });
}
