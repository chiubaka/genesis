import { generateFiles, Tree } from "@nrwl/devkit";
import path from "node:path";

import { generatorLogger as logger } from "../../../../logger";

export function circleciGenerator(tree: Tree) {
  logger.info("Generating CircleCI setup");

  copyConfigTemplates(tree);
}

function copyConfigTemplates(tree: Tree) {
  logger.info("Copying .circleci config templates");
  generateFiles(tree, path.join(__dirname, "./files"), ".circleci", {});
}
