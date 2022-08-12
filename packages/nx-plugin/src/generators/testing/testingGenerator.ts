import { Tree } from "@nrwl/devkit";

import { generatorLogger as logger } from "../../logger";
import codecovGenerator from "./codecov";

export function testingGenerator(tree: Tree) {
  logger.info("Generating test setup");

  codecovGenerator(tree);
}
