import { generateFiles, Tree } from "@nx/devkit";
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
  const { projectName, projectType, testEnvironment } = options;
  const project = new Project(tree, projectName, projectType);

  const devDependencies = ["jest", "jest-junit", "ts-jest"];
  if (testEnvironment === "jsdom") {
    devDependencies.push("jest-environment-jsdom");
  }

  const installDependenciesTask = await addDependenciesToPackageJson(
    tree,
    [],
    devDependencies,
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
