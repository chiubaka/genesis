import { Tree } from "@nrwl/devkit";
import yaml from "js-yaml";

export function readYaml<T = any>(tree: Tree, filePath: string): T {
  const content = tree.read(filePath)?.toString();
  if (!content) {
    throw new Error(`File ${filePath} does not exist`);
  }

  return yaml.load(content) as T;
}
