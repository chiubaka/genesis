import { updateJson } from "@nrwl/devkit";

import { PackageJson } from "../../../types";
import { Project } from "../../../utils";

export const standardizePackageJson = (project: Project) => {
  const tree = project.getTree();

  updateJson(tree, project.path("package.json"), (packageJson: PackageJson) => {
    packageJson.license = "UNLICENSED";

    return packageJson;
  });
};
