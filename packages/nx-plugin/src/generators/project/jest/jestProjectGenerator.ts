import { generateFiles, Tree } from "@nrwl/devkit";
import path from "node:path";

import { addDependenciesToPackageJson, Project } from "../../../utils";
import { JestProjectGeneratorSchema } from "./jestProjectGenerator.schema";

export async function jestProjectGenerator(
  tree: Tree,
  options: JestProjectGeneratorSchema,
) {
  const { projectName, projectType, testEnvironment } = options;
  const project = new Project(tree, projectName, projectType);

  const installDependenciesTask = await addDependenciesToPackageJson(
    tree,
    {},
    { jest: "^27.5.1", "jest-junit": undefined },
    project.path("package.json"),
  );

  copyConfigTemplate(project, testEnvironment);

  return async () => {
    await installDependenciesTask();
  };
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
