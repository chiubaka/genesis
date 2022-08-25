import { generateFiles, Tree } from "@nrwl/devkit";
import path from "node:path";

import { generatorLogger as logger } from "../../../../logger";
import { addDependenciesToPackageJson } from "../../../../utils";

export async function jestGenerator(tree: Tree) {
  logger.info("Generating Jest setup");

  const installTask = await installDependencies(tree);
  copyConfigTemplates(tree);

  return async () => {
    logger.info("Running post-processing tasks for Jest generator");

    await installTask();
  };
}

async function installDependencies(tree: Tree) {
  const installTask = await addDependenciesToPackageJson(
    tree,
    {},
    { "@nrwl/jest": undefined, jest: "^27.5.1" },
  );

  return async () => {
    logger.info("Installing new dependencies for Jest generator");

    await installTask();
  };
}

function copyConfigTemplates(tree: Tree) {
  logger.info("Copying Jest configuration templates");

  generateFiles(tree, path.join(__dirname, "./files"), ".", { template: "" });
}
