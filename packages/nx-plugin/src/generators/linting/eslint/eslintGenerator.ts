import {
  addDependenciesToPackageJson,
  generateFiles,
  Tree,
} from "@nrwl/devkit";
import path from "node:path";

export function eslintGenerator(tree: Tree) {
  addDependenciesToPackageJson(
    tree,
    {},
    {
      "@chiubaka/eslint-config": "latest",
      "@nrwl/eslint-plugin-nx": "latest",
      eslint: "latest",
    },
  );

  generateFiles(tree, path.join(__dirname, "./files"), ".", {});
}

export default eslintGenerator;
