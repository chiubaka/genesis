import { tmpProjPath, uniq } from "@nrwl/nx-plugin/testing";
import { ensureDirSync, moveSync, removeSync } from "fs-extra";
import os from "node:os";
import path from "node:path";

import { exec } from "../../utils";
import { GenesisExecutorSchema } from "./genesisExecutor.schema";

export async function genesisExecutor(options: GenesisExecutorSchema) {
  const { workspaceScope, workspaceName, description, skipGitHub, registry } =
    options;

  // Generate inside of a temporary directory, then move to the destination afterward to avoid git repo inside
  // of git repo errors in E2E testing situations
  const tmpDir = path.join(os.tmpdir(), uniq(workspaceName));
  ensureDirSync(tmpDir);

  let command = `genesis --workspace-scope=${workspaceScope} --workspace-name=${workspaceName} --description="${description} --disable-immutable-installs"`;

  if (skipGitHub) {
    command = `${command} --skip-github`;
  }

  if (registry) {
    command = `${command} --registry=${registry}`;
  }

  await exec(command, {
    cwd: tmpDir,
    env: {
      ...process.env,
      npm_config_registry: registry,
    },
  });

  const tmpDestination = path.join(tmpDir, workspaceName);
  const destination =
    options.destination || path.join(tmpProjPath(), "..", workspaceName);

  removeSync(destination);
  moveSync(tmpDestination, destination);

  return {
    success: true,
  };
}
