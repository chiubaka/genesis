import { generateFiles, Tree } from "@nrwl/devkit";
import path from "node:path";

import { addDependenciesToPackageJson, Project } from "../../../utils";
import {
  JestProjectGeneratorOwnOptions,
  JestProjectGeneratorSchema,
} from "./jestProjectGenerator.schema";

export async function jestProjectGenerator(
  tree: Tree,
  options: JestProjectGeneratorSchema,
) {
  const { projectName, projectType } = options;
  const project = new Project(tree, projectName, projectType);

  const installDependenciesTask = await addDependenciesToPackageJson(
    tree,
    [],
    ["jest", "jest-junit", "ts-jest"],
    project.path("package.json"),
  );

  copyConfigTemplate(project, options);

  return async () => {
    await installDependenciesTask();
  };
}

function copyConfigTemplate(
  project: Project,
  options: JestProjectGeneratorOwnOptions,
) {
  const tree = project.getTree();
  const projectName = project.getName();
  const projectType = project.getType();
  const templateDir = path.join(__dirname, "./files");

  generateFiles(tree, templateDir, project.path(), {
    projectName,
    projectType,
    template: "",
    ...options,
  });
}
