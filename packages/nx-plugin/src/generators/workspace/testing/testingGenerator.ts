import { Tree } from "@nrwl/devkit";

import { generatorLogger as logger } from "../../../logger";
import codecovGenerator from "./codecov";
import { jestGenerator } from "./jest";

export async function testingGenerator(tree: Tree) {
  logger.info("Generating test setup");

  const jestTask = await jestGenerator(tree);
  codecovGenerator(tree);

  return async () => {
    logger.info("Runing post-processing tasks for testing generator");

    await jestTask();
  };
}
