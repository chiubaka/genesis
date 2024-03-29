import { generateFiles } from "@nx/devkit";
import path from "node:path";

import { Project } from "../../../../../utils";

export function copyNodeLibSample(project: Project) {
  const tree = project.getTree();

  tree.delete(project.path(".babelrc"));

  generateFiles(tree, path.join(__dirname, "./files"), project.path(), {
    template: "",
    projectName: project.getName(),
  });
}
