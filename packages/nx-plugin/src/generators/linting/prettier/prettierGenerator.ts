import { addDependenciesToPackageJson, Tree, updateJson } from "@nrwl/devkit";

import { generatorLogger as logger } from "../../../logger";

export interface PrettierConfig {
  singleQuote?: boolean;
  trailingComma?: "es5" | "none" | "all";
}

export function prettierGenerator(tree: Tree) {
  logger.info("Generating Prettier setup");

  updatePrettierConfig(tree);

  const installDependenciesTask = installDependencies(tree);

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

function installDependencies(tree: Tree) {
  const installTask = addDependenciesToPackageJson(
    tree,
    {},
    { prettier: "latest" },
  );

  return async () => {
    logger.info("Installing new dependencies for Prettier generator");

    await installTask();
  };
}
