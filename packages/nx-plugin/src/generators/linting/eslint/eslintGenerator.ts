import {
  addDependenciesToPackageJson,
  generateFiles,
  getPackageManagerCommand,
  Tree,
} from "@nrwl/devkit";
import path from "node:path";

import { exec } from "../../../utils";

export function eslintGenerator(tree: Tree) {
  const installTask = addDependenciesToPackageJson(
    tree,
    {},
    {
      "@chiubaka/eslint-config": "latest",
      "@nrwl/eslint-plugin-nx": "latest",
      eslint: "latest",
    },
  );

  const lintFixTask = lintFix(tree);

  generateFiles(tree, path.join(__dirname, "./files"), ".", {});

  return async () => {
    await installTask();
    await lintFixTask();
  };
}

function lintFix(tree: Tree) {
  return async () => {
    const pmc = getPackageManagerCommand();
    const command = pmc.run("eslint", "--fix .");

    await exec(command, {
      cwd: tree.root,
    });
  };
}

export default eslintGenerator;
