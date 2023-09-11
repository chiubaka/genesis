import { generateFiles } from "@nx/devkit";
import path from "node:path";

import { Project } from "../../../../../utils";
import { copyNodeLibSample } from "../../node";

export const copyTsLibSample = (project: Project) => {
  const tree = project.getTree();

  copyNodeLibSample(project);

  generateFiles(tree, path.join(__dirname, "./files"), project.path(), {
    template: "",
  });
};
