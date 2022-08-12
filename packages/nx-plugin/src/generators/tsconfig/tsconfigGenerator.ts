import {
  addDependenciesToPackageJson,
  generateFiles,
  Tree,
} from "@nrwl/devkit";
import path from "node:path";

import { generatorLogger as logger } from "../../logger";

export function tsconfigGenerator(tree: Tree) {
  logger.info("Generating base TsConfig file");

  const installDependenciesTask = installDependencies(tree);
  generateFiles(tree, path.join(__dirname, "./files"), ".", {});

  return async () => {
    logger.info("Running post-processing tasks for TSConfig generator");

    await installDependenciesTask();
  };
}

function installDependencies(tree: Tree) {
  const installTask = addDependenciesToPackageJson(
    tree,
    {},
    {
      "@chiubaka/tsconfig": "latest",
      tslib: "latest",
    },
  );

  return async () => {
    logger.info("Installing new dependencies for TSConfig generator");

    await installTask();
  };
}
