import { Tree } from "@nrwl/devkit";

import { eslintGenerator } from "./eslint";

export function lintingGenerator(tree: Tree) {
  eslintGenerator(tree);
}
