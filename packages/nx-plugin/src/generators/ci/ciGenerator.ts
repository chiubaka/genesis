import { Tree } from "@nrwl/devkit";

import { circleciGenerator } from "./circleci";

export function ciGenerator(tree: Tree) {
  return circleciGenerator(tree);
}
