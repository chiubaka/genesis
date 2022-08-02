import { GeneratorCallback, Tree } from "@nrwl/devkit";
import { runTasksInSerial } from "@nrwl/workspace/src/utilities/run-tasks-in-serial";

import { eslintGenerator } from "./eslint";
import prettierGenerator from "./prettier";

export function lintingGenerator(tree: Tree) {
  const tasks: GeneratorCallback[] = [];

  const eslintTask = eslintGenerator(tree);
  tasks.push(eslintTask);

  const prettierTask = prettierGenerator(tree);
  tasks.push(prettierTask);

  return runTasksInSerial(...tasks);
}
