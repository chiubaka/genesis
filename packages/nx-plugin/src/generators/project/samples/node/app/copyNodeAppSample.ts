import { generateFiles } from "@nrwl/devkit";
import path from "node:path";

import { Project } from "../../../../../utils";
import { copyNodeLibSample } from "../lib";

export function copyNodeAppSample(project: Project) {
  const tree = project.getTree();

  copyNodeLibSample(project);

  tree.delete(project.srcPath("index.ts"));

  generateFiles(tree, path.join(__dirname, "./files"), project.path(), {
    template: "",
  });
}
