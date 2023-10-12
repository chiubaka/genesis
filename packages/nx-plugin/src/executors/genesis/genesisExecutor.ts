import { getPackageManagerCommand, logger } from "@nx/devkit";
import { tmpProjPath, uniq } from "@nx/plugin/testing";
import { ensureDirSync, existsSync, moveSync, removeSync } from "fs-extra";
import os from "node:os";
import path from "node:path";

import { spawn } from "../../utils";
import { GenesisExecutorSchema } from "./genesisExecutor.schema";

export async function genesisExecutor(options: GenesisExecutorSchema) {
  const {
    workspaceScope,
    workspaceName,
    description,
    disableImmutableInstalls,
    skipGitHub,
    registry,
  } = options;

  // Generate inside of a temporary directory, then move to the destination afterward to avoid git repo inside
  // of git repo errors in E2E testing situations
  const tmpDir = path.join(os.tmpdir(), uniq(workspaceName));
  const tmpDestination = path.join(tmpDir, workspaceName);
  const destination =
    options.destination || path.join(tmpProjPath(), "..", workspaceName);

  const destinationExists = existsSync(destination);

  const isCi = process.env.CI === "true";
  const skipE2eSetup = process.env.SKIP_E2E_SETUP === "true";

  if (destinationExists) {
    if (isCi) {
      logger.log("Genesis E2E template workspace has already been generated!");
      return {
        success: true,
      };
    } else if (skipE2eSetup) {
      logger.log("Genesis E2E template workspace has already been generated!");
      logger.log("Reinstalling template workspace dependencies...");

      await spawn("rm -rf node_modules yarn.lock", {
        stdio: "inherit",
        cwd: destination,
      });

      await spawn("touch yarn.lock", {
        stdio: "inherit",
        cwd: destination,
      });

      const pmc = getPackageManagerCommand("yarn");
      await spawn(pmc.install, {
        stdio: "inherit",
        cwd: destination,
      });

      await spawn("git commit --amend --no-edit", {
        stdio: "inherit",
        cwd: destination,
      });

      return {
        success: true,
      };
    }
  }

  removeSync(tmpDir);
  ensureDirSync(tmpDir);

  let command = `genesis @${workspaceScope}/${workspaceName} --description="${description}"`;

  if (disableImmutableInstalls) {
    command = `${command} --disable-immutable-installs`;
  }

  if (skipGitHub) {
    command = `${command} --skip-github`;
  }

  if (registry) {
    command = `${command} --registry=${registry}`;
  }

  await spawn(command, {
    stdio: "inherit",
    cwd: tmpDir,
    env: {
      ...process.env,
      npm_config_registry: registry,
    },
  });

  removeSync(destination);
  moveSync(tmpDestination, destination);

  return {
    success: true,
  };
}
