import { generateFiles } from "@nrwl/devkit";
import path from "node:path";

import { Project } from "../../../../../utils";

export const copyTsLibSample = (project: Project) => {
  const tree = project.getTree();

  tree.delete(project.srcPath("lib"));

  generateFiles(tree, path.join(__dirname, "./files"), project.path(), {
    template: "",
  });
};
