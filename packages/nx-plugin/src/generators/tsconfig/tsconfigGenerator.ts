import {
  addDependenciesToPackageJson,
  generateFiles,
  Tree,
} from "@nrwl/devkit";
import path from "node:path";

export function tsconfigGenerator(tree: Tree) {
  const installDependenciesTask = installDependencies(tree);
  generateFiles(tree, path.join(__dirname, "./files"), ".", {});

  return installDependenciesTask;
}

function installDependencies(tree: Tree) {
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      "@chiubaka/tsconfig": "latest",
      tslib: "latest",
    },
  );
}
