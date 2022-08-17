import { GeneratorCallback, Tree } from "@nrwl/devkit";
import { runTasksInSerial } from "@nrwl/workspace/src/utilities/run-tasks-in-serial";

import { generatorLogger as logger } from "../../logger";
import { eslintGenerator } from "./eslint";
import { LintingGeneratorSchema } from "./lintingGenerator.schema";
import { lintStagedGenerator } from "./lintStaged";
import { prettierGenerator } from "./prettier";

export async function lintingGenerator(
  tree: Tree,
  options: LintingGeneratorSchema,
) {
  logger.info(
    `Generating linting setup with options:\n${JSON.stringify(options)}`,
  );

  const tasks: GeneratorCallback[] = [];

  const eslintTask = await eslintGenerator(tree, options);
  tasks.push(eslintTask);

  const prettierTask = await prettierGenerator(tree);
  tasks.push(prettierTask);

  const lintStagedTask = await lintStagedGenerator(tree);
  tasks.push(lintStagedTask);

  return runTasksInSerial(...tasks);
}
