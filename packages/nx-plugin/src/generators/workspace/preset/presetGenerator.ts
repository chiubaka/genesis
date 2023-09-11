import {
  formatFiles,
  generateFiles,
  getPackageManagerCommand,
  readWorkspaceConfiguration,
  Tree,
  updateJson,
  updateWorkspaceConfiguration,
} from "@nrwl/devkit";
import { rm } from "fs-extra";
import path from "node:path";
import { PackageJson as PackageJsonType } from "nx/src/utils/package-json";

import PackageJson from "../../../../package.json";
import { generatorLogger as logger } from "../../../logger";
import { exec } from "../../../utils";
import { noOpTask } from "../../../utils/tasks/index";
import { ciGenerator } from "../ci";
import { gitGenerator } from "../git";
import { lintingGenerator } from "../linting";
import { readmeGenerator } from "../readme";
import { testingGenerator } from "../testing";
import { tsconfigGenerator } from "../tsconfig";
import { PresetGeneratorSchema } from "./presetGenerator.schema";

export async function presetGenerator(
  tree: Tree,
  options: PresetGeneratorSchema,
) {
  logger.info(
    `Generating @chiubaka/nx-plugin workspace preset with options:\n${JSON.stringify(
      options,
      undefined,
      2,
    )}`,
  );

  modifyWorkspaceLayout(tree, options);
  addPackageJsonScripts(tree);

  const installTask = reinstallPackagesWithYarn(tree, options);
  const tsconfigTask = await tsconfigGenerator(tree);
  const lintingTask = await lintingGenerator(tree, { packageManager: "yarn" });
  const testingTask = await testingGenerator(tree);
  ciGenerator(tree);
  readmeGenerator(tree, options);
  const gitTask = await setUpGit(tree, options);

  await formatFiles(tree);

  return async () => {
    logger.info("Running post-processing tasks for preset generator");

    await installTask();
    await tsconfigTask();
    await lintingTask();
    await testingTask();
    await gitTask();
  };
}

function modifyWorkspaceLayout(tree: Tree, options: PresetGeneratorSchema) {
  logger.info("Modifying workspace layout to conform to e2e/ and packages/");

  const workspaceConfig = readWorkspaceConfiguration(tree);
  updateWorkspaceConfiguration(tree, {
    ...workspaceConfig,
    workspaceLayout: {
      appsDir: "e2e",
      libsDir: "packages",
    },
    cli: {
      packageManager: "yarn",
    },
  });

  updateJson(tree, "package.json", (packageJson: PackageJsonType) => {
    packageJson.name = options.workspaceName;

    packageJson.workspaces = {
      packages: ["packages/*"],
    };

    return packageJson;
  });

  tree.delete("apps");
  tree.delete("libs");

  tree.write("e2e/.gitkeep", "");
  tree.write("packages/.gitkeep", "");
}

function addPackageJsonScripts(tree: Tree) {
  logger.info("Adding standard scripts to package.json");

  generateFiles(tree, path.join(__dirname, "./files/scripts"), "scripts", {});

  updateJson(tree, "package.json", (packageJson: PackageJsonType) => {
    const scripts = packageJson.scripts ?? {};

    scripts["build:affected"] = "nx affected --target=build";
    scripts["build:ci"] = "yarn build:affected --base=$NX_BASE --head=$NX_HEAD";
    scripts["e2e"] = "nx e2e";
    scripts["e2e:affected"] = "nx affected --target=e2e";
    scripts["e2e:all"] = "nx run-many --target=e2e --all";
    scripts["test:affected"] = "nx affected --target=test";
    scripts["test:all"] = "nx run-many --target=test --all";
    scripts["test:ci"] = "./scripts/test-ci.sh";
    scripts["test:ci:affected"] =
      "yarn test:affected --ci --coverage --base=$NX_BASE --head=$NX_HEAD && yarn e2e:affected --ci --coverage --base=$NX_BASE --head=$NX_HEAD";
    scripts["test:ci:all"] =
      "yarn test:all --ci --coverage && yarn e2e:all --ci --coverage";
    scripts["deploy"] = "nx deploy $@ --configuration=production";
    scripts["deploy:ci"] = "yarn deploy";

    packageJson.scripts = scripts;

    return packageJson;
  });
}

function reinstallPackagesWithYarn(tree: Tree, options: PresetGeneratorSchema) {
  const { disableImmutableInstalls, skipInstall, registry } = options;

  if (skipInstall) {
    return noOpTask;
  }

  tree.delete("package-lock.json");
  generateFiles(tree, path.join(__dirname, "./files/yarn"), ".", {});

  const pmc = getPackageManagerCommand("yarn");

  return async () => {
    logger.info("Reinstalling packages with yarn");

    await rm(path.join(tree.root, "node_modules"), {
      force: true,
      recursive: true,
    });

    await exec(`yarn set version berry`, {
      cwd: tree.root,
    });

    if (disableImmutableInstalls) {
      await exec(`yarn config set enableImmutableInstalls false`, {
        cwd: tree.root,
      });
    }

    if (registry) {
      logger.info(`Using registry ${registry}`);

      await exec(`yarn config set npmRegistryServer ${registry}`, {
        cwd: tree.root,
      });

      const registryUrl = new URL(registry);

      if (registryUrl.protocol === "http:") {
        await exec(
          `yarn config set unsafeHttpWhitelist ${registryUrl.hostname}`,
          {
            cwd: tree.root,
          },
        );
      }
    }

    await exec(`${pmc.install} --no-immutable`, {
      cwd: tree.root,
    });
  };
}

function setUpGit(tree: Tree, options: PresetGeneratorSchema) {
  const generatorPackageInfo = getGeneratorPackageInfo();

  return gitGenerator(tree, {
    commitMessage: `Initial commit with files generated by ${generatorPackageInfo} preset.`,
    preCommitCommand: "yarn lint:staged",
    prePushCommand: "yarn test:affected",

    organization: options.workspaceScope,
    repositoryName: options.workspaceName,
    repositoryDescription: options.description,
    privateRepository: true,
    enableCircleCiStatusChecks: true,
    enableCodecovStatusChecks: true,

    skipGitHub: options.skipGitHub,
  });
}

function getGeneratorPackageInfo() {
  const { name: packageName, version: packageVersion } =
    PackageJson as PackageJsonType;
  return `${packageName}@${packageVersion}`;
}
