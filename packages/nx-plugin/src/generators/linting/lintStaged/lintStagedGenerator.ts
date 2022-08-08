import {
  addDependenciesToPackageJson,
  generateFiles,
  Tree,
  updateJson,
} from "@nrwl/devkit";
import path from "node:path";
import { PackageJson } from "nx/src/utils/package-json";

export function lintStagedGenerator(tree: Tree) {
  const templatesPath = path.join(__dirname, "./files");

  generateFiles(tree, templatesPath, ".", {});

  const installDependenciesTask = installDependencies(tree);
  installScripts(tree);

  return installDependenciesTask;
}

function installDependencies(tree: Tree) {
  return addDependenciesToPackageJson(tree, {}, { "lint-staged": "latest" });
}

function installScripts(tree: Tree) {
  updateJson<PackageJson>(tree, "package.json", (json) => {
    if (!json.scripts) {
      json.scripts = {};
    }

    json.scripts["lint:staged"] = "lint-staged";

    return json;
  });
}
