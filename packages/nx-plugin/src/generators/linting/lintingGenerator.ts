import { GeneratorCallback, Tree } from "@nrwl/devkit";
import { runTasksInSerial } from "@nrwl/workspace/src/utilities/run-tasks-in-serial";

import { generatorLogger as logger } from "../../logger";
import { eslintGenerator } from "./eslint";
import { LintingGeneratorSchema } from "./lintingGenerator.schema";
import { lintStagedGenerator } from "./lintStaged";
import { prettierGenerator } from "./prettier";

export function lintingGenerator(tree: Tree, options: LintingGeneratorSchema) {
  logger.info(
    `Generating linting setup with options:\n${JSON.stringify(options)}`,
  );

  const tasks: GeneratorCallback[] = [];

  const eslintTask = eslintGenerator(tree, options);
  tasks.push(eslintTask);

  const prettierTask = prettierGenerator(tree);
  tasks.push(prettierTask);

  const lintStagedTask = lintStagedGenerator(tree);
  tasks.push(lintStagedTask);

  return runTasksInSerial(...tasks);
}
