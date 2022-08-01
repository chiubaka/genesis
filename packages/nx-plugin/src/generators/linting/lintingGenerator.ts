import { Tree } from "@nrwl/devkit";

import { eslintGenerator } from "./eslint";
import prettierGenerator from "./prettier";

export function lintingGenerator(tree: Tree) {
  eslintGenerator(tree);
  prettierGenerator(tree);
}
