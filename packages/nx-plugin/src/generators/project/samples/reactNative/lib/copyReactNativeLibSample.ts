import { generateFiles } from "@nx/devkit";
import path from "node:path";

import { Project } from "../../../../../utils";

export function copyReactNativeLibSample(project: Project) {
  const tree = project.getTree();

  generateFiles(tree, path.join(__dirname, "./files"), project.path(), {
    template: "",
    projectName: project.getName(),
  });
}
