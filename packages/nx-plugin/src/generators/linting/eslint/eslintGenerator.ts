import {
  addDependenciesToPackageJson,
  generateFiles,
  getPackageManagerCommand,
  Tree,
  updateJson,
} from "@nrwl/devkit";
import path from "node:path";
import { PackageJson } from "nx/src/utils/package-json";

import { exec } from "../../../utils";
import { EsLintGeneratorSchema } from "./eslintGenerator.schema";

export function eslintGenerator(tree: Tree, options: EsLintGeneratorSchema) {
  const installDependenciesTask = installDependencies(tree);
  installScripts(tree, options);
  const lintFixTask = lintFix(tree);

  generateFiles(tree, path.join(__dirname, "./files"), ".", {});

  return async () => {
    await installDependenciesTask();
    await lintFixTask();
  };
}

function installDependencies(tree: Tree) {
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      "@chiubaka/eslint-config": "latest",
      "@nrwl/eslint-plugin-nx": "latest",
      eslint: "latest",
    },
  );
}

function installScripts(tree: Tree, options: EsLintGeneratorSchema) {
  const packageManager = options.packageManager || "npm";
  const pmc = getPackageManagerCommand(packageManager);
  const pmcRun = (script: string, args = "") => {
    return pmc.run(script, args).trim();
  };

  updateJson<PackageJson>(tree, "package.json", (json) => {
    if (!json.scripts) {
      json.scripts = {};
    }

    json.scripts.lint = "nx lint";
    json.scripts["lint:affected"] = "nx affected --target=lint";
    json.scripts["lint:all"] = `${pmcRun("lint:root")} && ${pmcRun(
      "lint:packages",
    )}`;
    json.scripts["lint:ci"] = `${pmcRun("lint:root")} && ${pmcRun(
      "lint:affected",
      "--base=$NX_BASE --head=$NX_HEAD",
    )}`;
    json.scripts["lint:fix:all"] = `${pmcRun("lint:fix:root")}; ${pmcRun(
      "lint:fix:packages",
    )}`;
    json.scripts["lint:fix:packages"] = pmcRun("lint:packages", "--fix");
    json.scripts["lint:fix:root"] = pmcRun("lint:root", "--fix");
    json.scripts["lint:packages"] = "nx run-many --target=lint --all";
    json.scripts["lint:root"] = `${pmc.exec} eslint .`;

    return json;
  });
}

function lintFix(tree: Tree) {
  return async () => {
    const pmc = getPackageManagerCommand();
    const command = pmc.run("lint:fix:all", "");

    await exec(command, {
      cwd: tree.root,
    });
  };
}

export default eslintGenerator;
