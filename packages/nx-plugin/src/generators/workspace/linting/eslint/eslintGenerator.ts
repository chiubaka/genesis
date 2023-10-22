import {
  generateFiles,
  getPackageManagerCommand,
  Tree,
  updateJson,
} from "@nx/devkit";
import path from "node:path";
import { PackageJson } from "nx/src/utils/package-json";

import { generatorLogger as logger } from "../../../../logger/index";
import { addDependenciesToPackageJson, exec } from "../../../../utils/index";
import { EsLintGeneratorSchema } from "./eslintGenerator.schema";

export async function eslintGenerator(
  tree: Tree,
  options: EsLintGeneratorSchema,
) {
  logger.info(
    `Generating ESLint setup with options:\n${JSON.stringify(
      options,
      undefined,
      2,
    )}`,
  );

  copyConfigTemplate(tree);
  const installDependenciesTask = await installDependencies(tree);
  installScripts(tree, options);
  const lintFixTask = lintFix(tree);

  return async () => {
    logger.info("Running post-processing tasks for ESLint generator");

    await installDependenciesTask();
    await lintFixTask();
  };
}

function copyConfigTemplate(tree: Tree) {
  logger.info("Copying .eslintrc.json template");

  generateFiles(tree, path.join(__dirname, "./files"), ".", {});
}

async function installDependencies(tree: Tree) {
  const installTask = await addDependenciesToPackageJson(
    tree,
    [],
    ["@chiubaka/eslint-config", "@nx/eslint-plugin", "eslint"],
  );

  return async () => {
    logger.info("Installing new dependencies for ESLint generator");

    await installTask();
  };
}

function installScripts(tree: Tree, options: EsLintGeneratorSchema) {
  const packageManager = options.packageManager || "npm";

  logger.info(`Adding linting scripts to package.json for ${packageManager}`);

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
    json.scripts["lint:ci"] = `${pmcRun("lint:root")} && ./scripts/ci.sh lint`;
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
    logger.info("Running lint fix over all files");

    const pmc = getPackageManagerCommand();
    const command = pmc.run("lint:fix:root", "");

    await exec(command, {
      cwd: tree.root,
    });
  };
}

export default eslintGenerator;
