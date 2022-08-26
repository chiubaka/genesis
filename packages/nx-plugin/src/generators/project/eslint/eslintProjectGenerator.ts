import { generateFiles, Tree } from "@nrwl/devkit";
import path from "node:path";

import { getProjectDir } from "../../../utils";
import { EsLintProjectGeneratorSchema } from "./eslintProjectGenerator.schema";

export function eslintProjectGenerator(
  tree: Tree,
  options: EsLintProjectGeneratorSchema,
) {
  copyConfigTemplate(tree, options);
}

function copyConfigTemplate(tree: Tree, options: EsLintProjectGeneratorSchema) {
  const { projectName, projectType } = options;

  const templateDirectory = path.join(__dirname, "./files");
  const projectDir = getProjectDir(tree, projectName, projectType);
  generateFiles(tree, templateDirectory, projectDir, { template: "" });
}
