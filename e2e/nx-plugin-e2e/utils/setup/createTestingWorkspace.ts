import {
  cleanup,
  patchPackageJsonForPlugin,
  runPackageManagerInstall,
  tmpProjPath,
  uniq,
} from "@nrwl/nx-plugin/testing";
import { moveSync } from "fs-extra";
import { execSync } from "node:child_process";
import os from "node:os";
import path from "node:path";

interface TestingWorkspaceOptions {
  skipInstall?: boolean;
  skipGit?: boolean;
}

/**
 * Does essentially what ensureNxProject does, but creates the new workspace outside of the
 * current project and then moves it in. This is to ensure that we can get a full workspace
 * complete with features like a working git repo which are needed in order to test some of
 * our generators.
 */
export const createTestingWorkspace = (
  npmPackageName: string,
  distPath: string,
  options?: TestingWorkspaceOptions,
) => {
  cleanup();
  const workspaceDirectory = createEmptyWorkspace(options);
  moveWorkspaceToE2eTmpDir(workspaceDirectory);
  patchPackageJsonForPlugin(npmPackageName, distPath);
  runPackageManagerInstall();
};

const createEmptyWorkspace = (options: TestingWorkspaceOptions) => {
  const { skipGit, skipInstall } = { skipInstall: true, ...options };

  const workspaceRoot = os.tmpdir();
  const workspaceName = uniq("proj");

  let command = `node ${require.resolve(
    "nx",
  )} new ${workspaceName} --nx-workspace--root=${workspaceRoot} --no-interactive --collection=@nrwl/workspace --npmScope=proj --preset=empty`;

  if (skipGit) {
    command = `${command} --skip-git`;
  }

  if (skipInstall) {
    command = `${command} --skip-install`;
  }

  execSync(command, {
    cwd: workspaceRoot,
  });

  const workspaceDirectory = path.join(workspaceRoot, workspaceName);
  return workspaceDirectory;
};

const moveWorkspaceToE2eTmpDir = (workspaceDirectory: string) => {
  moveSync(workspaceDirectory, tmpProjPath());
};
