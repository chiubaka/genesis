import { generateFiles, Tree } from "@nx/devkit";
import path from "node:path";

import { generatorLogger as logger } from "../../../logger";
import { ReadmeGeneratorSchema } from "./readmeGenerator.schema";

export function readmeGenerator(tree: Tree, options: ReadmeGeneratorSchema) {
  logger.info(
    `Generating README.md with options:\n${JSON.stringify(
      options,
      undefined,
      2,
    )}`,
  );

  copyReadmeTemplate(tree, options);
}

function copyReadmeTemplate(tree: Tree, options: ReadmeGeneratorSchema) {
  logger.info("Copying README.md template");

  generateFiles(tree, path.join(__dirname, "./files"), ".", options);
}
