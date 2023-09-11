import { generateFiles, Tree, updateJson } from "@nx/devkit";
import path from "node:path";
import { PackageJson } from "nx/src/utils/package-json";

import { generatorLogger as logger } from "../../../../logger/index";
import { addDependenciesToPackageJson } from "../../../../utils/index";

export async function lintStagedGenerator(tree: Tree) {
  logger.info("Generating lint-staged setup");

  copyConfigTemplate(tree);
  const installDependenciesTask = await installDependencies(tree);
  installScripts(tree);

  return async () => {
    logger.info("Running post-processing tasks for lint-staged generator");

    await installDependenciesTask();
  };
}

function copyConfigTemplate(tree: Tree) {
  logger.info("Copying .lintstagedrc.yml template");

  const templatesPath = path.join(__dirname, "./files");
  generateFiles(tree, templatesPath, ".", {});
}

async function installDependencies(tree: Tree) {
  const installTask = await addDependenciesToPackageJson(
    tree,
    [],
    ["lint-staged"],
  );

  return async () => {
    logger.info("Installing new dependencies for lint-staged generator");

    await installTask();
  };
}

function installScripts(tree: Tree) {
  logger.info("Adding lint-staged scripts to package.json");

  updateJson<PackageJson>(tree, "package.json", (json) => {
    if (!json.scripts) {
      json.scripts = {};
    }

    json.scripts["lint:staged"] = "lint-staged";

    return json;
  });
}
