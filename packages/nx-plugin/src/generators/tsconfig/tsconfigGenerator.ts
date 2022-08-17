import { generateFiles, Tree } from "@nrwl/devkit";
import path from "node:path";

import { generatorLogger as logger } from "../../logger";
import { addDependenciesToPackageJson } from "../../utils";

export async function tsconfigGenerator(tree: Tree) {
  logger.info("Generating base TsConfig file");

  const installDependenciesTask = await installDependencies(tree);
  generateFiles(tree, path.join(__dirname, "./files"), ".", {});

  return async () => {
    logger.info("Running post-processing tasks for TSConfig generator");

    await installDependenciesTask();
  };
}

async function installDependencies(tree: Tree) {
  const installTask = await addDependenciesToPackageJson(
    tree,
    [],
    ["@chiubaka/tsconfig", "tslib"],
  );

  return async () => {
    logger.info("Installing new dependencies for TSConfig generator");

    await installTask();
  };
}
