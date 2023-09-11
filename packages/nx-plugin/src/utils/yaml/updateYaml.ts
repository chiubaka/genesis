import { Tree } from "@nx/devkit";

import { readYaml } from "./readYaml";
import { writeYaml } from "./writeYaml";

export function updateYaml<T>(
  tree: Tree,
  filePath: string,
  updater: (object: T) => T,
) {
  const object = readYaml<T>(tree, filePath);
  writeYaml(tree, filePath, updater(object));
}
