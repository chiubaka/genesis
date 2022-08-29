import { generateFiles, Tree } from "@nrwl/devkit";
import path from "node:path";

import { Project } from "../../../utils";
import { TsConfigProjectGeneratorSchema } from "./tsconfigProjectGenerator.schema";

export function tsconfigProjectGenerator(
  tree: Tree,
  options: TsConfigProjectGeneratorSchema,
) {
  const { projectName, projectType } = options;
  const project = new Project(tree, projectName, projectType);
  copyConfigTemplates(project, options);
}

function copyConfigTemplates(
  project: Project,
  options: TsConfigProjectGeneratorSchema,
) {
  const tree = project.getTree();
  const templateDir = path.join(__dirname, "./files");

  const appLibTypes = options.appLibTypes
    ? JSON.stringify(options.appLibTypes)
    : undefined;
  const lib = options.lib ? JSON.stringify(options.lib) : undefined;

  generateFiles(tree, templateDir, project.path(), {
    ...options,
    appLibTypes: JSON.stringify(appLibTypes),
    lib,
    projectType: project.getType() === "application" ? "app" : "lib",
    template: "",
  });
}
