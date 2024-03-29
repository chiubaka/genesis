import { NX_VERSION } from "@chiubaka/nx-plugin";
import { getPackageManagerCommand } from "@nx/devkit";
import { Command } from "commander";
import { spawn } from "node:child_process";
import packageNameRegex from "package-name-regex";

import packageInfo from "../package.json";

interface GenesisOptions {
  importPath: string;
  description: string;
  disableImmutableInstalls?: boolean;
  registry?: string;
  skipGithub?: boolean;
}

const cliVersion = packageInfo["version"];

export function genesis(argv = process.argv) {
  const program = new Command();

  program
    .version(cliVersion)
    .argument(
      "<importPath>",
      "full import path (@scope/project) for the primary project you are creating in this workspace",
    )
    .requiredOption("-d, --description <description>")
    .option("--disable-immutable-installs")
    .option("-r, --registry <registry>")
    .option("--skip-github");

  program.parse(argv);

  const importPath = program.args[0];

  const opts = program.opts<GenesisOptions>();

  const {
    description,
    disableImmutableInstalls,
    registry,
    skipGithub: skipGitHub,
  } = opts;

  const pmc = getPackageManagerCommand("npm");
  const { workspaceScope, workspaceName } = parseImportPath(importPath);

  let fullCommand = `${pmc.exec} create-nx-workspace@${NX_VERSION} ${workspaceName} --preset=@chiubaka/nx-plugin --nxCloud=false --workspaceName=${workspaceName} --workspaceScope=${workspaceScope} --skipGit`;

  if (skipGitHub) {
    fullCommand = `${fullCommand} --skipGitHub`;
  }

  if (registry) {
    fullCommand = `${fullCommand} --registry=${registry}`;
  }

  if (disableImmutableInstalls) {
    fullCommand = `${fullCommand} --disableImmutableInstalls=true`;
  }

  const commandTokens = fullCommand.split(" ");
  const [command, ...args] = commandTokens;

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    NX_DAEMON: "false",
    NX_VERBOSE_LOGGING: "true",
  };

  if (registry) {
    env.npm_config_registry = registry;
  }

  const escapedDescription = description
    // eslint-disable-next-line unicorn/prefer-string-replace-all
    .replace(/["'\\]/g, "\\$&")
    .replace("\0", "\\0");

  spawn(command, [...args, `--description="${escapedDescription}"`], {
    cwd: process.cwd(),
    env,
    stdio: "inherit",
  });
}

export function parseImportPath(importPath: string) {
  if (!importPath.startsWith("@") || !packageNameRegex.test(importPath)) {
    throw new Error(`${importPath} is not a valid import path`);
  }

  const tokens = importPath.split("/");
  const workspaceScope = tokens[0].slice(1);
  const workspaceName = tokens[1];

  return { workspaceScope, workspaceName };
}
