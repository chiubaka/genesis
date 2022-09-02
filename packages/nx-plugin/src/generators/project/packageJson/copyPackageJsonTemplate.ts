import { generateFiles } from "@nrwl/devkit";
import path from "node:path";

import { Project } from "../../../utils/Project";

export function copyPackageJsonTemplate(project: Project) {
  const tree = project.getTree();
  const projectScope = project.getScope();
  const projectName = project.getName();

  generateFiles(tree, path.join(__dirname, "./files"), project.path(), {
    projectScope,
    projectName,
    template: "",
  });
}
