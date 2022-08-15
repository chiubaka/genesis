import { generateFiles, Tree } from "@nrwl/devkit";
import path from "node:path";

import { generatorLogger as logger } from "../../../logger";

export function codecovGenerator(tree: Tree) {
  logger.info("Generating Codecov setup");

  copyConfigTemplate(tree);
}

function copyConfigTemplate(tree: Tree) {
  logger.info("Copying Codecov config template");

  generateFiles(tree, path.join(__dirname, "./files"), ".", {});
}
