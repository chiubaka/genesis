import { Tree } from "@nrwl/devkit";

import codecovGenerator from "./codecov";

export function testingGenerator(tree: Tree) {
  codecovGenerator(tree);
}
