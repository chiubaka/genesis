import { Tree } from "@nrwl/devkit";

import { generatorLogger as logger } from "../../logger";
import { circleciGenerator } from "./circleci";

export function ciGenerator(tree: Tree) {
  logger.info("Generating CI setup");

  return circleciGenerator(tree);
}
