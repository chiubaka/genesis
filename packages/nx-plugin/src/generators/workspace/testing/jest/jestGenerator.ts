import { generateFiles, Tree } from "@nrwl/devkit";
import path from "node:path";

import { generatorLogger as logger } from "../../../../logger";
import { addDependenciesToPackageJson } from "../../../../utils";

export async function jestGenerator(tree: Tree) {
  logger.info("Generating Jest setup");

  const installTask = await installDependencies(tree);
  copyConfigTemplates(tree);
  updateGitignore(tree);

  return async () => {
    logger.info("Running post-processing tasks for Jest generator");

    await installTask();
  };
}

async function installDependencies(tree: Tree) {
  const installTask = await addDependenciesToPackageJson(
    tree,
    [],
    ["@nrwl/jest", "jest"],
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

function updateGitignore(tree: Tree) {
  logger.info("Updating .gitignore");

  if (!tree.exists(".gitignore")) {
    logger.warn("No .gitignore file found");
    return;
  }

  const gitignore = tree.read(".gitignore")?.toString();

  if (!gitignore) {
    logger.warn("Received empty buffer for .gitignore");
    return;
  }

  tree.write(".gitignore", `${gitignore}\n\n# Test reports\n/reports\n`);
}
