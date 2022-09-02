import {
  detectPackageManager,
  getPackageManagerCommand,
  updateJson,
} from "@nrwl/devkit";

import { PackageJson } from "../../../types";
import { Project } from "../../../utils";

export function addNpmPublishDeployScriptsToPackageJson(project: Project) {
  const tree = project.getTree();

  const packageManager = detectPackageManager(tree.root);
  const pmc = getPackageManagerCommand(packageManager);

  updateJson(tree, project.path("package.json"), (packageJson: PackageJson) => {
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    packageJson.scripts.deploy = "npm publish --access public";
    packageJson.scripts["deploy:ci"] = pmc.run("deploy", "").trim();

    return packageJson;
  });
}
