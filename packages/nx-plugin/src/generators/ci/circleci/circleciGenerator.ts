import { generateFiles, Tree } from "@nrwl/devkit";
import path from "node:path";

export function circleciGenerator(tree: Tree) {
  generateFiles(tree, path.join(__dirname, "./files"), ".circleci", {});
}
