import { getPackageManagerCommand } from "@nrwl/devkit";
import { program } from "commander";
import { spawn as nodeSpawn } from "node:child_process";
import { promisify } from "node:util";

const spawn = promisify(nodeSpawn);

interface GenesisOptions {
  workspaceScope: string;
  workspaceName: string;
  description: string;
  registry?: string;
  skipGithub?: boolean;
  yarnCacheClean?: boolean;
}

export async function genesis(argv = process.argv) {
  program
    .requiredOption("-s, --workspace-scope <workspaceScope>")
    .requiredOption("-n, --workspace-name <workspaceName>")
    .requiredOption("-d, --description <description>")
    .option("-r, --registry <registry>")
    .option("--skip-github")
    .option("--yarn-cache-clean");

  program.parse(argv);

  const opts = program.opts<GenesisOptions>();

  const {
    workspaceScope,
    workspaceName,
    description,
    registry,
    skipGithub: skipGitHub,
    yarnCacheClean,
  } = opts;

  const pmc = getPackageManagerCommand("npm");

  let fullCommand = `${pmc.exec} create-nx-workspace ${workspaceScope} --preset=@chiubaka/nx-plugin --nxCloud=false --directory=${workspaceName} --workspaceName=${workspaceName} --workspaceScope=${workspaceScope}`;

  if (skipGitHub) {
    fullCommand = `${fullCommand} --skipGitHub`;
  }

  if (registry) {
    fullCommand = `${fullCommand} --registry=${registry}`;
  }

  if (yarnCacheClean) {
    fullCommand = `${fullCommand} --yarnCacheClean`;
  }

  const commandTokens = fullCommand.split(" ");
  const [command, ...args] = commandTokens;

  await spawn(command, [...args, `--description="${description}"`], {
    cwd: process.cwd(),
    env: registry
      ? {
          ...process.env,
          npm_config_registry: registry,
        }
      : undefined,
  });
}
