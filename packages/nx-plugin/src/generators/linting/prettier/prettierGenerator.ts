import { Tree, updateJson } from "@nrwl/devkit";

import { generatorLogger as logger } from "../../../logger";
import { addDependenciesToPackageJson } from "../../../utils";

export interface PrettierConfig {
  singleQuote?: boolean;
  trailingComma?: "es5" | "none" | "all";
}

export async function prettierGenerator(tree: Tree) {
  logger.info("Generating Prettier setup");

  updatePrettierConfig(tree);

  const installDependenciesTask = await installDependencies(tree);

  return async () => {
    logger.info("Running post-processing tasks for Prettier generator");

    await installDependenciesTask();
  };
}

function updatePrettierConfig(tree: Tree) {
  logger.info("Updating .prettierrc");

  updateJson<PrettierConfig>(tree, ".prettierrc", (json) => {
    json.singleQuote = false;
    json.trailingComma = "all";
    return json;
  });
}

async function installDependencies(tree: Tree) {
  const installTask = await addDependenciesToPackageJson(
    tree,
    [],
    ["prettier"],
  );

  return async () => {
    logger.info("Installing new dependencies for Prettier generator");

    await installTask();
  };
}
