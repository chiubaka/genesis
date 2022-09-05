import { generateFiles, Tree } from "@nrwl/devkit";
import path from "path";
import { Project } from "../../../..";
import { E2eGeneratorBaseSchema } from "../../../e2eGeneratorBase.schema";

export function reactAppE2eGenerator(
  tree: Tree,
  options: E2eGeneratorBaseSchema,
) {
  const { appOrLibName, name } = options;
  const project = new Project(tree, name, "e2e");
  const appProject = new Project(tree, appOrLibName, "application");

  generateFiles(tree, path.join(__dirname, "files"), project.path(), {
    template: "",
  });
}
